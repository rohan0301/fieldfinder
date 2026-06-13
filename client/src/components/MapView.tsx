// MapView — FieldFinder
// Full-bleed Google Maps with custom dark style.
// RBI view: neighborhood shading, coverage rings, field pins.
// Parent view: program pins by type.

import { useEffect, useRef, useCallback } from 'react';
import { MapView as GoogleMapView } from './Map';
import type { Neighborhood, Program } from '@/lib/data';
import { neighborhoods, programs, getScoreOpacity } from '@/lib/data';

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

// Alameda County center
const ALAMEDA_CENTER = { lat: 37.6879, lng: -122.1598 };
const ALAMEDA_ZOOM = 11;

const COLORS = {
  amber: '#F2C14E',
  brightAmber: '#FFD166',
  readyGreen: '#4ADE80',
  fieldGreen: '#0D2B1E',
  turfGreen: '#1A4A2E',
  chalkWhite: '#F7F5F0',
  gapRed: '#E05243',
};

// Custom dark map style — field-green palette
const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0F1F14' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#F7F5F0', lightness: -30 }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0D2B1E' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#1A4A2E' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: 'rgba(247,245,240,0.7)' }] },
  { featureType: 'administrative.neighborhood', elementType: 'labels.text.fill', stylers: [{ color: 'rgba(247,245,240,0.55)' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1A2A1A' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a16' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#1e3020' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2A3A2A' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0A1628' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0F1F14' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#0D2318' }] },
];

function createNeighborhoodMarker(
  map: google.maps.Map,
  neighborhood: Neighborhood,
  isSelected: boolean,
  onClick: () => void
): google.maps.Circle {
  const opacity = getScoreOpacity(neighborhood.needScore);
  const circle = new google.maps.Circle({
    map,
    center: { lat: neighborhood.lat, lng: neighborhood.lng },
    radius: 1200,
    fillColor: COLORS.amber,
    fillOpacity: isSelected
      ? Math.min(opacity * 0.5 + 0.24, 0.72)
      : Math.min(opacity * 0.42 + 0.1, 0.48),
    strokeColor: isSelected ? COLORS.brightAmber : 'rgba(255, 209, 102, 0.78)',
    strokeOpacity: isSelected ? 1 : 0.86,
    strokeWeight: isSelected ? 3 : 1.5,
    clickable: true,
  });

  circle.addListener('click', onClick);
  return circle;
}

function createFieldPin(
  map: google.maps.Map,
  lat: number,
  lng: number,
  condition: 'ready' | 'investment-needed' | 'gap',
  name: string,
  onClick?: () => void
): google.maps.Marker {
  const color = condition === 'ready' ? COLORS.readyGreen :
                condition === 'investment-needed' ? COLORS.brightAmber : COLORS.gapRed;

  const marker = new google.maps.Marker({
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

  if (onClick) marker.addListener('click', onClick);
  return marker;
}

function createProgramPin(
  map: google.maps.Map,
  program: Program,
  isSelected: boolean,
  onClick: () => void
): google.maps.Marker {
  const colors: Record<Program['orgType'], string> = {
    'rbi': COLORS.brightAmber,
    'little-league': '#BFEA7C',
    'parks-rec': COLORS.readyGreen,
    'nonprofit': 'rgba(247,245,240,0.7)',
  };
  const color = colors[program.orgType];

  const marker = new google.maps.Marker({
    map,
    position: { lat: program.lat, lng: program.lng },
    title: program.name,
    icon: {
      path: 'M -8,-8 L 8,-8 L 8,8 L -8,8 Z',
      fillColor: color,
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

function createCoverageRing(
  map: google.maps.Map,
  program: Program
): google.maps.Circle {
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
  const mapRef = useRef<google.maps.Map | null>(null);
  const overlaysRef = useRef<(google.maps.Circle | google.maps.Marker)[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const clearOverlays = useCallback(() => {
    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];
  }, []);

  const renderRBIView = useCallback(() => {
    if (!mapRef.current) return;
    clearOverlays();

    // Draw neighborhood circles
    neighborhoods.forEach((n) => {
      const isSelected = selectedNeighborhood?.id === n.id;
      const circle = createNeighborhoodMarker(
        mapRef.current!,
        n,
        isSelected,
        () => onNeighborhoodClick(n)
      );
      overlaysRef.current.push(circle);
    });

    // Draw field pins for gap neighborhoods
    neighborhoods.forEach((n) => {
      if (n.gapStatus === 'gap') {
        n.fields.forEach((field) => {
          const pin = createFieldPin(
            mapRef.current!,
            field.lat,
            field.lng,
            field.condition,
            field.name
          );
          overlaysRef.current.push(pin);
        });
      }
    });

    // Draw coverage rings for confirmed active programs (RBI only)
    programs
      .filter((p) => p.orgType === 'rbi' && p.status === 'confirmed-active')
      .forEach((p) => {
        const ring = createCoverageRing(mapRef.current!, p);
        overlaysRef.current.push(ring);
      });

  }, [selectedNeighborhood, onNeighborhoodClick, clearOverlays]);

  const renderParentView = useCallback(() => {
    if (!mapRef.current) return;
    clearOverlays();

    const filteredPrograms = programs.filter((p) => {
      if (programFilters.costFreeOnly && p.cost !== 'free') return false;
      if (programFilters.programTypes.length > 0 && !programFilters.programTypes.includes(p.orgType)) return false;
      return true;
    });

    filteredPrograms.forEach((p) => {
      const isSelected = selectedProgram?.id === p.id;
      const pin = createProgramPin(
        mapRef.current!,
        p,
        isSelected,
        () => onProgramClick(p)
      );
      overlaysRef.current.push(pin);
    });

    // Coverage rings for RBI affiliates
    filteredPrograms
      .filter((p) => p.orgType === 'rbi')
      .forEach((p) => {
        const ring = createCoverageRing(mapRef.current!, p);
        overlaysRef.current.push(ring);
      });

  }, [selectedProgram, onProgramClick, programFilters, clearOverlays]);

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

    // Initial render
    if (viewMode === 'rbi') {
      renderRBIView();
    } else {
      renderParentView();
    }
  }, [viewMode, renderRBIView, renderParentView]);

  // Re-render when view mode or selections change
  useEffect(() => {
    if (!mapRef.current) return;
    if (viewMode === 'rbi') {
      renderRBIView();
    } else {
      renderParentView();
    }
  }, [viewMode, selectedNeighborhood, selectedProgram, programFilters, renderRBIView, renderParentView]);

  // Pan to selected neighborhood
  useEffect(() => {
    if (!mapRef.current || !selectedNeighborhood) return;
    const offset = sidebarOpen ? 0.015 : 0;
    mapRef.current.panTo({
      lat: selectedNeighborhood.lat,
      lng: selectedNeighborhood.lng + offset,
    });
    if (mapRef.current.getZoom()! < 13) {
      mapRef.current.setZoom(13);
    }
  }, [selectedNeighborhood, sidebarOpen]);

  // Pan to selected program
  useEffect(() => {
    if (!mapRef.current || !selectedProgram) return;
    const offset = sidebarOpen ? 0.015 : 0;
    mapRef.current.panTo({
      lat: selectedProgram.lat,
      lng: selectedProgram.lng + offset,
    });
    if (mapRef.current.getZoom()! < 13) {
      mapRef.current.setZoom(13);
    }
  }, [selectedProgram, sidebarOpen]);

  // Pan to user location
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    mapRef.current.panTo(userLocation);
    mapRef.current.setZoom(13);
  }, [userLocation]);

  // Trigger map resize when sidebar opens/closes
  useEffect(() => {
    if (!mapRef.current) return;
    const timer = setTimeout(() => {
      if (mapRef.current) {
        google.maps.event.trigger(mapRef.current, 'resize');
      }
    }, 320);
    return () => clearTimeout(timer);
  }, [sidebarOpen]);

  return (
    <div ref={containerRef} className="flex-1 relative" style={{ background: '#0F1F14', width: '100%', height: '100%' }}>
      <GoogleMapView
        onMapReady={handleMapReady}
        initialCenter={ALAMEDA_CENTER}
        initialZoom={ALAMEDA_ZOOM}
        className="w-full"
        style={{ height: '100%', minHeight: '400px' }}
      />

      {/* View mode indicator overlay */}
      <div
        className="absolute bottom-6 right-6 px-3 py-1.5 rounded-lg"
        style={{
          background: 'rgba(13,43,30,0.85)',
          border: '1px solid rgba(247,245,240,0.1)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {viewMode === 'rbi' ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.gapRed }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.6)' }}>Gap field</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.readyGreen }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.6)' }}>Ready</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.brightAmber }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.6)' }}>Needs investment</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS.brightAmber }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.6)' }}>RBI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#BFEA7C' }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.6)' }}>Little League</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS.readyGreen }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.6)' }}>Parks & Rec</span>
            </div>
          </div>
        )}
      </div>

      {/* RBI view callout — explains scoring logic */}
      {viewMode === 'rbi' && !selectedNeighborhood && (
        <div
          className="absolute top-4 left-4 max-w-xs px-4 py-3 rounded-lg"
          style={{
            background: 'rgba(13,43,30,0.92)',
            border: '1px solid rgba(242,193,78,0.3)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: COLORS.brightAmber, letterSpacing: '0.05em', marginBottom: '4px' }}>
            PROXIMITY-ADJUSTED SCORES
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(247,245,240,0.7)', lineHeight: 1.5 }}>
            Need scores are reduced for neighborhoods near existing RBI programs. Brighter circles = higher priority. Click any circle to see the full profile.
          </div>
        </div>
      )}

      {/* Families view callout */}
      {viewMode === 'parents' && !selectedProgram && (
        <div
          className="absolute top-4 left-4 max-w-xs px-4 py-3 rounded-lg"
          style={{
            background: 'rgba(13,43,30,0.92)',
            border: '1px solid rgba(74,222,128,0.3)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: COLORS.readyGreen, letterSpacing: '0.05em', marginBottom: '4px' }}>
            4 PROGRAMS · BAY AREA
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(247,245,240,0.7)', lineHeight: 1.5 }}>
            Click any pin to see program details, contact info, and directions.
          </div>
        </div>
      )}
    </div>
  );
}
