// TopNav — FieldFinder
// 56px tall. Field-green background. Brand wordmark, view toggle, search.
// The toggle is the most important UI element — amber pill slides between states.

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { findNeighborhoodMatches, neighborhoods, getAllAdjustedNeighborhoods, programs } from '@/lib/data';

type ViewMode = 'rbi' | 'parents';

const adjustedNeighborhoods = getAllAdjustedNeighborhoods(programs);
const adjustedNeighborhoodMap = new Map(adjustedNeighborhoods.map(n => [n.id, n]));

function getDisplayScore(neighborhood: typeof neighborhoods[0]): number {
  return adjustedNeighborhoodMap.get(neighborhood.id)?.adjustedNeedScore ?? neighborhood.needScore;
}

interface TopNavProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function TopNav({ viewMode, onViewChange, onSearch, searchQuery }: TopNavProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof neighborhoods>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchResults(findNeighborhoodMatches(searchQuery));
  }, [searchQuery]);

  const handleSearchSelect = (neighborhood: typeof neighborhoods[0]) => {
    onSearch(neighborhood.name);
    setSearchResults([]);
    searchRef.current?.blur();
  };

  return (
    <nav
      className="flex items-center justify-between px-5 h-14 flex-shrink-0 relative z-50"
      style={{ background: '#0D2B1E', borderBottom: '1px solid rgba(247,245,240,0.1)' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Diamond logo mark */}
        <div className="flex items-center justify-center">
          <img
            src="/logo/fieldfinder1.png"
            alt="FieldFinder logo"
            style={{ width: '60px', height: '60px', objectFit: 'contain' }}
          />
        </div>
        <span
          className="text-2xl tracking-wide"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            color: '#F7F5F0',
            letterSpacing: '0.04em',
          }}
        >
          FIELDFINDER
        </span>
        <span
          className="hidden lg:block text-xs ml-1"
          style={{ color: 'rgba(247,245,240,0.45)', fontFamily: "'Inter', sans-serif" }}
        >
          Alameda County
        </span>
      </div>

      {/* View Toggle — the signature UI element */}
      <div
        className="relative flex items-center rounded-full p-1"
        style={{
          background: 'rgba(247,245,240,0.08)',
          border: '1px solid rgba(247,245,240,0.12)',
        }}
      >
        {/* Sliding amber pill */}
        <div
          className="absolute top-1 bottom-1 rounded-full"
          style={{
            background: '#F2C14E',
            width: 'calc(50% - 4px)',
            left: viewMode === 'rbi' ? '4px' : 'calc(50%)',
            transition: 'left 200ms cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        />
        <button
          onClick={() => onViewChange('rbi')}
          className="relative z-10 px-5 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '0.05em',
            color: viewMode === 'rbi' ? '#0D2B1E' : 'rgba(247,245,240,0.6)',
            transition: 'color 200ms ease-out',
          }}
        >
          RBI OFFICIALS
        </button>
        <button
          onClick={() => onViewChange('parents')}
          className="relative z-10 px-5 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '0.05em',
            color: viewMode === 'parents' ? '#0D2B1E' : 'rgba(247,245,240,0.6)',
            transition: 'color 200ms ease-out',
          }}
        >
          FOR FAMILIES
        </button>
      </div>

      {/* Search */}
      <div className="relative flex-shrink-0" style={{ width: searchFocused ? '320px' : '280px', transition: 'width 200ms ease-out' }}>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            background: 'rgba(247,245,240,0.07)',
            border: `1px solid ${searchFocused ? 'rgba(242,193,78,0.5)' : 'rgba(247,245,240,0.12)'}`,
            transition: 'border-color 200ms ease-out, box-shadow 200ms ease-out',
            boxShadow: searchFocused ? '0 0 0 3px rgba(242,193,78,0.1)' : 'none',
          }}
        >
          <Search size={14} style={{ color: 'rgba(247,245,240,0.45)', flexShrink: 0 }} />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search neighborhoods or zip codes"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: '#F7F5F0',
              fontSize: '13px',
            }}
          />
          {searchQuery && (
            <button onClick={() => onSearch('')} className="flex-shrink-0">
              <X size={12} style={{ color: 'rgba(247,245,240,0.45)' }} />
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {searchResults.length > 0 && searchFocused && (
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden z-50"
            style={{
              background: '#1A4A2E',
              border: '1px solid rgba(247,245,240,0.12)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            {searchResults.map((n) => (
              <button
                key={n.id}
                onClick={() => handleSearchSelect(n)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-white/5 transition-colors"
              >
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: '#F7F5F0', fontSize: '14px' }}>
                    {n.name}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", color: 'rgba(247,245,240,0.5)', fontSize: '11px' }}>
                    {n.city} · {n.zipCodes.join(', ')} · Need Score {getDisplayScore(n).toFixed(1)}/10
                  </div>
                </div>
                {n.gapStatus === 'gap' && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(192,57,43,0.2)', color: '#C0392B', border: '1px solid rgba(192,57,43,0.3)', fontFamily: "'Inter', sans-serif" }}>
                    Gap
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
