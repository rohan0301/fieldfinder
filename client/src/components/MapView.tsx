// MapView — FieldFinder
// RBI view: ZIP-boundary choropleth via Google Maps Data Layer.
// Parent view: program pins by type.

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapView as GoogleMapView } from './Map';
import type { Neighborhood, Program } from '@/lib/data';
import { neighborhoods, programs, getAllAdjustedNeighborhoods } from '@/lib/data';
import { getPrimaryNeighborhoodId, getZipsForNeighborhoodId } from '@/lib/zipNeighborhoodMap';
import { usePersistFn } from '@/hooks/usePersistFn';

type ViewMode = 'rbi' | 'parents';

interface MapViewProps {
  viewMode: ViewMode;
  selectedNeighborhood: Neighborhood | null;
  selectedProgram: Program | null;
  onNeighborhoodClick: (n: Neighborhood) => void;
  onProgramClick: (p: Program) => void;
  searchQuery: string;
  programFilters: {
    costFreeOnly: boolean;
    programTypes: Program['orgType'][];
  };
  userLocation: { lat: number; lng: number } | null;
  sidebarOpen: boolean;
}

// ── Choropleth scale ───────────────────────────────────────────────
type ChoroStyle = { fill: string; fillOpacity: number; stroke: string; strokeOpacity: number };
type ChoroBin = ChoroStyle & { min: number; max: number; label: string };

const CHORO_COLORS = [
  '#2DD4BF',
  '#38BDF8',
  '#60A5FA',
  '#A3E635',
  '#FACC15',
  '#FB923C',
  '#EF4444',
] as const;

const adjustedNeighborhoods = getAllAdjustedNeighborhoods(programs);
const adjustedNeighborhoodMap = new Map(adjustedNeighborhoods.map(n => [n.id, n]));

const scoreValues = adjustedNeighborhoods
  .map(n => n.adjustedNeedScore)
  .filter(score => Number.isFinite(score))
  .sort((a, b) => a - b);

function quantile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) return 0;
  const index = (sortedValues.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

function formatScore(score: number): string {
  return score.toFixed(1);
}

const choroThresholds = CHORO_COLORS.slice(1).map((_, index) =>
  quantile(scoreValues, (index + 1) / CHORO_COLORS.length)
);

const choroMin = scoreValues[0] ?? 0;
const choroMax = scoreValues[scoreValues.length - 1] ?? 10;

const CHORO_BINS: ChoroBin[] = CHORO_COLORS.map((fill, index) => {
  const min = index === 0 ? choroMin : choroThresholds[index - 1];
  const max = index === CHORO_COLORS.length - 1 ? choroMax : choroThresholds[index];

  return {
    min,
    max,
    label: index === CHORO_COLORS.length - 1
      ? `${formatScore(min)}-${formatScore(choroMax)}`
      : `${formatScore(min)}-${formatScore(max)}`,
    fill,
    fillOpacity: 0.42 + index * 0.055,
    stroke: fill,
    strokeOpacity: 0.68 + index * 0.045,
  };
});

function getChoroStyle(score: number): ChoroStyle {
  const binIndex = choroThresholds.findIndex(threshold => score <= threshold);
  return CHORO_BINS[binIndex === -1 ? CHORO_BINS.length - 1 : binIndex];
}

const UNMAPPED_STYLE = { fill: '#1A3A22', fillOpacity: 0.06, stroke: '#2A5A32', strokeOpacity: 0.22 };

// ── Map constants ──────────────────────────────────────────────────
const ALAMEDA_CENTER = { lat: 37.6879, lng: -122.1598 };
const ALAMEDA_ZOOM   = 11;

const COLORS = {
  amber:       '#F2C14E',
  brightAmber: '#FFD166',
  readyGreen:  '#4ADE80',
  fieldGreen:  '#0D2B1E',
  turfGreen:   '#1A4A2E',
  chalkWhite:  '#F7F5F0',
  gapRed:      '#E05243',
};

// ── Custom dark map style ──────────────────────────────────────────
const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry',        stylers: [{ color: '#0F1F14' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#F7F5F0', lightness: -30 }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0D2B1E' }] },
  { featureType: 'administrative',       elementType: 'geometry',          stylers: [{ color: '#1A4A2E' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality',  elementType: 'labels.text.fill', stylers: [{ color: 'rgba(247,245,240,0.7)' }] },
  { featureType: 'administrative.neighborhood', elementType: 'labels.text.fill', stylers: [{ color: 'rgba(247,245,240,0.55)' }] },
  { featureType: 'poi',    stylers: [{ visibility: 'off' }] },
  { featureType: 'road',   elementType: 'geometry',        stylers: [{ color: '#1A2A1A' }] },
  { featureType: 'road',   elementType: 'geometry.stroke', stylers: [{ color: '#212a16' }] },
  { featureType: 'road',   elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#1e3020' }] },
  { featureType: 'road.highway',  elementType: 'geometry', stylers: [{ color: '#2A3A2A' }] },
  { featureType: 'road.highway',  elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'road.local',    elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'transit',  stylers: [{ visibility: 'off' }] },
  { featureType: 'water',    elementType: 'geometry',          stylers: [{ color: '#0A1628' }] },
  { featureType: 'water',    elementType: 'labels.text.fill',  stylers: [{ color: '#515c6d' }] },
  { featureType: 'water',    elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
  { featureType: 'landscape',         elementType: 'geometry', stylers: [{ color: '#0F1F14' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#0D2318' }] },
];

// ── Overlay helpers ────────────────────────────────────────────────
function createFieldPin(
  map: google.maps.Map,
  lat: number,
  lng: number,
  condition: 'ready' | 'investment-needed' | 'gap',
  name: string,
): google.maps.Marker {
  const color =
    condition === 'ready'             ? COLORS.readyGreen  :
    condition === 'investment-needed' ? COLORS.brightAmber : COLORS.gapRed;

  return new google.maps.Marker({
    map,
    position: { lat, lng },
    title: name,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
    },
  });
}

function createProgramPin(
  map: google.maps.Map,
  program: Program,
  isSelected: boolean,
  onClick: () => void,
): google.maps.Marker {
  const colors: Record<Program['orgType'], string> = {
    'rbi':          COLORS.brightAmber,
    'little-league': '#BFEA7C',
    'parks-rec':     COLORS.readyGreen,
    'nonprofit':     'rgba(247,245,240,0.7)',
  };

  const marker = new google.maps.Marker({
    map,
    position: { lat: program.lat, lng: program.lng },
    title: program.name,
    icon: {
      path: 'M -8,-8 L 8,-8 L 8,8 L -8,8 Z',
      fillColor: colors[program.orgType],
      fillOpacity: 1,
      strokeColor: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
      strokeWeight: isSelected ? 2.5 : 1.5,
      scale: isSelected ? 1.3 : 1,
      anchor: new google.maps.Point(0, 0),
    },
  });

  marker.addListener('click', onClick);
  return marker;
}

function createCoverageRing(map: google.maps.Map, program: Program): google.maps.Circle {
  return new google.maps.Circle({
    map,
    center: { lat: program.lat, lng: program.lng },
    radius: program.coverageRadiusMiles * 1609.34,
    fillColor: COLORS.readyGreen,
    fillOpacity: 0.06,
    strokeColor: COLORS.readyGreen,
    strokeOpacity: 0.42,
    strokeWeight: 1.5,
    clickable: false,
  });
}

// ── GeoJSON module-level cache ─────────────────────────────────────
// Avoids re-fetching on every render; persists for the page session.
let geojsonCache: object | null = null;

// ── Component ──────────────────────────────────────────────────────
export function MapViewComponent({
  viewMode,
  selectedNeighborhood,
  selectedProgram,
  onNeighborhoodClick,
  onProgramClick,
  searchQuery,
  programFilters,
  userLocation,
  sidebarOpen,
}: MapViewProps) {
  const mapRef       = useRef<google.maps.Map | null>(null);
  const overlaysRef  = useRef<(google.maps.Circle | google.maps.Marker)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Data layer management
  const dataListenersRef  = useRef<google.maps.MapsEventListener[]>([]);
  const hoverInfoRef      = useRef<google.maps.InfoWindow | null>(null);
  const hasFitBoundsRef   = useRef(false);
  const isLoadingRef      = useRef(false);

  // Stable callbacks for use inside Google Maps event listeners
  const onNeighborhoodClickStable = usePersistFn(onNeighborhoodClick);
  const onProgramClickStable      = usePersistFn(onProgramClick);

  const [hoveredZip, setHoveredZip] = useState<string | null>(null);

  // ── Clear traditional overlays (Markers, Circles) ─────────────
  const clearOverlays = useCallback(() => {
    overlaysRef.current.forEach(o => o.setMap(null));
    overlaysRef.current = [];
  }, []);

  // ── Clear the Data Layer (features + event listeners) ─────────
  const clearDataLayer = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.data.forEach(f => mapRef.current!.data.remove(f));
    dataListenersRef.current.forEach(l => google.maps.event.removeListener(l));
    dataListenersRef.current = [];
    hoverInfoRef.current?.close();
  }, []);

  // ── Data Layer event listeners (set up once per data load) ────
  const setupDataLayerListeners = useCallback(() => {
    if (!mapRef.current || dataListenersRef.current.length > 0) return;
    const map = mapRef.current;

    hoverInfoRef.current = new google.maps.InfoWindow({
      disableAutoPan: true,
      pixelOffset: new google.maps.Size(0, -6),
    });

    const overL = map.data.addListener('mouseover', (e: google.maps.Data.MouseEvent) => {
      const zip = e.feature.getProperty('ZIP_CODE') as string;
      setHoveredZip(zip);

      const primaryId = getPrimaryNeighborhoodId(zip);
      const nhood = primaryId ? neighborhoods.find(n => n.id === primaryId) : null;
      const adjusted = nhood ? adjustedNeighborhoodMap.get(nhood.id) : null;
      const displayScore = adjusted?.adjustedNeedScore ?? nhood?.needScore ?? 0;
      const base = nhood ? getChoroStyle(displayScore).fillOpacity : UNMAPPED_STYLE.fillOpacity;

      map.data.overrideStyle(e.feature, {
        strokeWeight: 2.5,
        strokeColor: '#FFD166',
        fillOpacity: Math.min(base + 0.22, 0.88),
      });

      if (nhood && hoverInfoRef.current && e.latLng) {
        hoverInfoRef.current.setContent(
          `<div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;` +
          `color:#F2C14E;background:#0D2B1E;padding:4px 10px;border-radius:4px;` +
          `letter-spacing:0.04em;white-space:nowrap;">` +
          `${nhood.name}` +
          `<span style="font-weight:400;color:rgba(247,245,240,0.6);margin-left:8px;">${displayScore.toFixed(1)}</span>` +
          `</div>`
        );
        hoverInfoRef.current.setPosition(e.latLng);
        hoverInfoRef.current.open(map);
      }
    });

    const outL = map.data.addListener('mouseout', (e: google.maps.Data.MouseEvent) => {
      setHoveredZip(null);
      map.data.revertStyle(e.feature);
      hoverInfoRef.current?.close();
    });

    const clickL = map.data.addListener('click', (e: google.maps.Data.MouseEvent) => {
      const zip = e.feature.getProperty('ZIP_CODE') as string;
      const primaryId = getPrimaryNeighborhoodId(zip);
      if (!primaryId) return;
      const nhood = neighborhoods.find(n => n.id === primaryId);
      if (nhood) onNeighborhoodClickStable(nhood);
    });

    dataListenersRef.current = [overL, outL, clickL];
  }, [onNeighborhoodClickStable]);

  // ── RBI View ──────────────────────────────────────────────────
  const renderRBIView = useCallback(async () => {
    if (!mapRef.current) return;

    // Clear traditional overlay refs; leave data layer in place if already loaded
    clearOverlays();

    // Determine whether the data layer is already populated
    let featureCount = 0;
    mapRef.current.data.forEach(() => featureCount++);

    if (featureCount === 0 && !isLoadingRef.current) {
      isLoadingRef.current = true;
      try {
        // Fetch GeoJSON (use module-level cache after first load)
        if (!geojsonCache) {
          const res = await fetch('/data/alameda_sf_tracts.geojson');
          if (!res.ok) throw new Error(`GeoJSON fetch failed: ${res.status}`);
          geojsonCache = await res.json();
        }

        if (!mapRef.current) return; // component may have unmounted during fetch

        mapRef.current.data.addGeoJson(geojsonCache as object);

        // Fit map to all tract boundaries on first load
        if (!hasFitBoundsRef.current) {
          hasFitBoundsRef.current = true;
          const bounds = new google.maps.LatLngBounds();
          mapRef.current.data.forEach(f => {
            f.getGeometry()?.forEachLatLng(ll => bounds.extend(ll));
          });
          mapRef.current.fitBounds(bounds, 24);
        }

        setupDataLayerListeners();
      } catch (err) {
        console.error('FieldFinder: failed to load tract GeoJSON', err);
      } finally {
        isLoadingRef.current = false;
      }
    }

    // Re-apply style (always runs — captures current selectedNeighborhood from closure)
    const selectedZips = selectedNeighborhood
      ? getZipsForNeighborhoodId(selectedNeighborhood.id)
      : [];

    mapRef.current?.data.setStyle((feature) => {
      const zip = (feature.getProperty('ZIP_CODE') as string) ?? '';
      const primaryId = getPrimaryNeighborhoodId(zip);
      const nhood = primaryId ? neighborhoods.find(n => n.id === primaryId) : null;
      const adjusted = nhood ? adjustedNeighborhoodMap.get(nhood.id) : null;
      const displayScore = adjusted?.adjustedNeedScore ?? nhood?.needScore ?? 0;
      const isSelected = selectedZips.includes(zip);
      const c = nhood ? getChoroStyle(displayScore) : UNMAPPED_STYLE;

      return {
        fillColor:    isSelected ? '#FFD166' : c.fill,
        fillOpacity:  isSelected ? Math.min(c.fillOpacity + 0.18, 0.85) : c.fillOpacity,
        strokeColor:  isSelected ? '#FFFFFF' : c.stroke,
        strokeOpacity: isSelected ? 1 : c.strokeOpacity,
        strokeWeight: isSelected ? 2.5 : 1.2,
        clickable: true,
        zIndex:    isSelected ? 10 : 1,
      };
    });

    // Field pins for gap neighborhoods
    neighborhoods.forEach(n => {
      if (n.gapStatus === 'gap') {
        n.fields.forEach(field => {
          overlaysRef.current.push(
            createFieldPin(mapRef.current!, field.lat, field.lng, field.condition, field.name)
          );
        });
      }
    });

    // RBI program coverage rings
    programs
      .filter(p => p.orgType === 'rbi' && p.status === 'confirmed-active')
      .forEach(p => overlaysRef.current.push(createCoverageRing(mapRef.current!, p)));

  }, [selectedNeighborhood, clearOverlays, setupDataLayerListeners]);

  // ── Parent View ───────────────────────────────────────────────
  const renderParentView = useCallback(() => {
    if (!mapRef.current) return;
    clearOverlays();
    clearDataLayer();

    const filteredPrograms = programs.filter(p => {
      if (programFilters.costFreeOnly && p.cost !== 'free') return false;
      if (programFilters.programTypes.length > 0 && !programFilters.programTypes.includes(p.orgType)) return false;
      return true;
    });

    filteredPrograms.forEach(p => {
      const isSelected = selectedProgram?.id === p.id;
      overlaysRef.current.push(
        createProgramPin(mapRef.current!, p, isSelected, () => onProgramClickStable(p))
      );
    });

    filteredPrograms
      .filter(p => p.orgType === 'rbi')
      .forEach(p => overlaysRef.current.push(createCoverageRing(mapRef.current!, p)));

  }, [selectedProgram, onProgramClickStable, programFilters, clearOverlays, clearDataLayer]);

  // ── Map ready ─────────────────────────────────────────────────
  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    map.setOptions({
      styles: MAP_STYLE,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: 'greedy',
    });
    map.setCenter(ALAMEDA_CENTER);
    map.setZoom(ALAMEDA_ZOOM);

    if (viewMode === 'rbi') {
      renderRBIView();
    } else {
      renderParentView();
    }
  }, [viewMode, renderRBIView, renderParentView]);

  // ── Re-render on mode / selection / filter changes ────────────
  useEffect(() => {
    if (!mapRef.current) return;
    if (viewMode === 'rbi') {
      renderRBIView();
    } else {
      renderParentView();
    }
  }, [viewMode, selectedNeighborhood, selectedProgram, programFilters, renderRBIView, renderParentView]);

  // ── Pan to selected neighborhood ──────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !selectedNeighborhood) return;
    const offset = sidebarOpen ? 0.015 : 0;
    mapRef.current.panTo({ lat: selectedNeighborhood.lat, lng: selectedNeighborhood.lng + offset });
    if ((mapRef.current.getZoom() ?? 0) < 13) mapRef.current.setZoom(13);
  }, [selectedNeighborhood, sidebarOpen]);

  // ── Pan to selected program ───────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !selectedProgram) return;
    const offset = sidebarOpen ? 0.015 : 0;
    mapRef.current.panTo({ lat: selectedProgram.lat, lng: selectedProgram.lng + offset });
    if ((mapRef.current.getZoom() ?? 0) < 13) mapRef.current.setZoom(13);
  }, [selectedProgram, sidebarOpen]);

  // ── Pan to user location ──────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    mapRef.current.panTo(userLocation);
    mapRef.current.setZoom(13);
  }, [userLocation]);

  // ── Resize map when sidebar toggles ──────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    const t = setTimeout(() => {
      if (mapRef.current) google.maps.event.trigger(mapRef.current, 'resize');
    }, 320);
    return () => clearTimeout(t);
  }, [sidebarOpen]);

  // ── Render ────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="flex-1 relative" style={{ background: '#0F1F14', width: '100%', height: '100%' }}>
      <GoogleMapView
        onMapReady={handleMapReady}
        initialCenter={ALAMEDA_CENTER}
        initialZoom={ALAMEDA_ZOOM}
        className="w-full"
        style={{ height: '100%', minHeight: '400px' }}
      />

      {/* Legend */}
      <div
        className="absolute bottom-6 right-6 px-3 py-2 rounded-lg"
        style={{
          background: 'rgba(13,43,30,0.90)',
          border: '1px solid rgba(247,245,240,0.1)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {viewMode === 'rbi' ? (
          <div className="flex flex-col gap-1.5">
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '10px', color: 'rgba(247,245,240,0.4)', letterSpacing: '0.08em', marginBottom: '2px' }}>
              RELATIVE NEED
            </div>
            {[...CHORO_BINS].reverse().map(({ label, fill, fillOpacity }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-8 h-3 rounded-sm flex-shrink-0" style={{ background: fill, opacity: fillOpacity, border: `1px solid ${fill}` }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.6)' }}>{label}</span>
              </div>
            ))}
            {hoveredZip && (
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: 'rgba(247,245,240,0.35)', marginTop: '4px', borderTop: '1px solid rgba(247,245,240,0.1)', paddingTop: '4px' }}>
                ZIP {hoveredZip}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {([
              { label: 'RBI',         color: COLORS.brightAmber },
              { label: 'Little League', color: '#BFEA7C' },
              { label: 'Parks & Rec',   color: COLORS.readyGreen },
            ] as const).map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.6)' }}>{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RBI callout */}
      {viewMode === 'rbi' && !selectedNeighborhood && (
        <div
          className="absolute top-4 left-4 max-w-xs px-4 py-3 rounded-lg"
          style={{ background: 'rgba(13,43,30,0.92)', border: '1px solid rgba(242,193,78,0.3)', backdropFilter: 'blur(8px)' }}
        >
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: COLORS.brightAmber, letterSpacing: '0.05em', marginBottom: '4px' }}>
            NEIGHBORHOOD NEED MAP
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(247,245,240,0.7)', lineHeight: 1.5 }}>
            Warmer colors = higher unmet need relative to the current dataset. Scores stay on the original 0-10 scale. Click any region to see its full profile.
          </div>
        </div>
      )}

      {/* Families callout */}
      {viewMode === 'parents' && !selectedProgram && (
        <div
          className="absolute top-4 left-4 max-w-xs px-4 py-3 rounded-lg"
          style={{ background: 'rgba(13,43,30,0.92)', border: '1px solid rgba(74,222,128,0.3)', backdropFilter: 'blur(8px)' }}
        >
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: COLORS.readyGreen, letterSpacing: '0.05em', marginBottom: '4px' }}>
            {programs.length} PROGRAMS · BAY AREA
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(247,245,240,0.7)', lineHeight: 1.5 }}>
            Click any pin to see program details, contact info, and directions.
          </div>
        </div>
      )}
    </div>
  );
}
