// Home — FieldFinder
// Full-viewport layout: TopNav (56px) + [Sidebar (380px) | Map (flex-1)]
// Night Diamond design: dark field-green, amber accents, chalk-white text.

import { useState, useCallback } from 'react';
import { TopNav } from '@/components/TopNav';
import { NeighborhoodSidebar } from '@/components/NeighborhoodSidebar';
import { ProgramSidebar, type ProgramFilters } from '@/components/ProgramSidebar';
import { MapViewComponent } from '@/components/MapView';
import type { Neighborhood, Program } from '@/lib/data';
import { findBestNeighborhoodMatch } from '@/lib/data';
import { LocateFixed } from 'lucide-react';
import { toast } from 'sonner';

type ViewMode = 'rbi' | 'parents';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('rbi');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [programFilters, setProgramFilters] = useState<ProgramFilters>({
    ageMin: null,
    ageMax: null,
    costFreeOnly: false,
    programTypes: [],
  });

  const handleViewChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    setSelectedNeighborhood(null);
    setSelectedProgram(null);
    setSidebarOpen(true);
  }, []);

  const handleNeighborhoodClick = useCallback((n: Neighborhood) => {
    setSelectedNeighborhood(n);
    setSidebarOpen(true);
  }, []);

  const handleProgramClick = useCallback((p: Program) => {
    setSelectedProgram(p);
    setSidebarOpen(true);
  }, []);

  const handleSidebarClose = useCallback(() => {
    if (viewMode === 'rbi') {
      setSelectedNeighborhood(null);
    } else {
      setSelectedProgram(null);
    }
  }, [viewMode]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const match = findBestNeighborhoodMatch(query);
    if (match) {
      setSelectedProgram(null);
      setSelectedNeighborhood(match);
      setSidebarOpen(true);
    } else if (!query.trim()) {
      setSelectedNeighborhood(null);
    }
  }, []);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success('Location found. Map centered on your position.');
      },
      () => {
        toast.error('Could not access your location. Please allow location access.');
      }
    );
  }, []);

  const isSidebarVisible = sidebarOpen;

  return (
    <div
      className="flex flex-col"
      style={{ height: '100vh', background: '#0D2B1E', overflow: 'hidden' }}
    >
      {/* Top navigation */}
      <TopNav
        viewMode={viewMode}
        onViewChange={handleViewChange}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />

      {/* Main content: sidebar + map */}
      <div className="relative overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
        {/* Sidebar layer */}
        {viewMode === 'rbi' ? (
          <NeighborhoodSidebar
            neighborhood={selectedNeighborhood}
            onClose={handleSidebarClose}
            onSelectNeighborhood={handleNeighborhoodClick}
            isOpen={isSidebarVisible}
          />
        ) : (
          <ProgramSidebar
            program={selectedProgram}
            onClose={handleSidebarClose}
            onSelectProgram={handleProgramClick}
            isOpen={isSidebarVisible}
            userLocation={userLocation}
            onFilterChange={setProgramFilters}
            filters={programFilters}
          />
        )}

        {/* Map layer — full bleed, sidebar overlaps */}
        <div
          className="absolute inset-0"
          style={{
            left: isSidebarVisible ? '380px' : '0',
            transition: 'left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <MapViewComponent
            viewMode={viewMode}
            selectedNeighborhood={selectedNeighborhood}
            selectedProgram={selectedProgram}
            onNeighborhoodClick={handleNeighborhoodClick}
            onProgramClick={handleProgramClick}
            searchQuery={searchQuery}
            programFilters={programFilters}
            userLocation={userLocation}
            sidebarOpen={isSidebarVisible}
          />
        </div>

        {/* Sidebar toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute z-50 flex items-center justify-center w-8 h-16 rounded-r-lg transition-all duration-300"
          style={{
            left: isSidebarVisible ? '380px' : '0',
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#1A4A2E',
            border: '1px solid rgba(247,245,240,0.15)',
            borderLeft: 'none',
            color: 'rgba(247,245,240,0.6)',
            transition: 'left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{
              transform: isSidebarVisible ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 200ms ease-out',
            }}
          >
            <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Locate me button */}
        <button
          onClick={handleLocate}
          className="absolute z-50 flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-150 hover:opacity-90 active:scale-95"
          style={{
            bottom: '80px',
            right: '16px',
            background: '#1A4A2E',
            border: '1px solid rgba(247,245,240,0.15)',
            color: '#BFEA7C',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <LocateFixed size={16} />
        </button>
      </div>
    </div>
  );
}
