// ProgramSidebar — FieldFinder
// Parents view sidebar.
// Shows program card with details, filters, and action buttons.

import { X, MapPin, Phone, Globe, Clock, Users, DollarSign, CheckCircle, Navigation, Filter } from 'lucide-react';
import type { Program } from '@/lib/data';
import { getProgramTypeLabel, getCostLabel, programs } from '@/lib/data';
import { useState } from 'react';

type ProgramType = Program['orgType'];

interface ProgramSidebarProps {
  program: Program | null;
  onClose: () => void;
  onSelectProgram: (p: Program) => void;
  isOpen: boolean;
  userLocation: { lat: number; lng: number } | null;
  onFilterChange: (filters: ProgramFilters) => void;
  filters: ProgramFilters;
}

export interface ProgramFilters {
  ageMin: number | null;
  ageMax: number | null;
  costFreeOnly: boolean;
  programTypes: ProgramType[];
}

function getDistanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function ProgramTypeTag({ type }: { type: Program['orgType'] }) {
  const styles: Record<Program['orgType'], { bg: string; color: string; border: string }> = {
    'rbi': { bg: 'rgba(242,193,78,0.15)', color: '#F2C14E', border: 'rgba(242,193,78,0.3)' },
    'little-league': { bg: 'rgba(191,234,124,0.15)', color: '#BFEA7C', border: 'rgba(191,234,124,0.3)' },
    'parks-rec': { bg: 'rgba(74,222,128,0.15)', color: '#4ADE80', border: 'rgba(74,222,128,0.3)' },
    'nonprofit': { bg: 'rgba(247,245,240,0.08)', color: 'rgba(247,245,240,0.7)', border: 'rgba(247,245,240,0.15)' },
  };
  const s = styles[type];
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '11px' }}
    >
      {getProgramTypeLabel(type)}
    </span>
  );
}

function ProgramCard({ program, userLocation, onClose }: {
  program: Program;
  userLocation: { lat: number; lng: number } | null;
  onClose: () => void;
}) {
  const distance = userLocation
    ? getDistanceMiles(userLocation.lat, userLocation.lng, program.lat, program.lng)
    : null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(247,245,240,0.1)' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '22px', color: '#F7F5F0', lineHeight: 1.1, letterSpacing: '0.02em' }}
            >
              {program.name.toUpperCase()}
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <ProgramTypeTag type={program.orgType} />
              {program.status === 'confirmed-active' ? (
                <span className="flex items-center gap-1 text-xs" style={{ color: '#4ADE80', fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                  <CheckCircle size={10} />
                  Confirmed Active
                </span>
              ) : (
                <span className="text-xs" style={{ color: 'rgba(247,245,240,0.4)', fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
                  Listed
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/10 flex-shrink-0"
            style={{ color: 'rgba(247,245,240,0.5)' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* Quick stats */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
          <div className="flex gap-4">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <Users size={11} style={{ color: 'rgba(247,245,240,0.4)' }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ages</span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '15px', color: '#F7F5F0' }}>
                {program.ageMin}–{program.ageMax}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <DollarSign size={11} style={{ color: 'rgba(247,245,240,0.4)' }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cost</span>
              </div>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '15px',
                color: program.cost === 'free' ? '#4ADE80' : program.cost === 'low-cost' ? '#F2C14E' : '#F7F5F0',
              }}>
                {getCostLabel(program.cost)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Equipment</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '15px',
                color: program.equipmentProvided ? '#4ADE80' : 'rgba(247,245,240,0.6)',
              }}>
                {program.equipmentProvided ? 'Provided' : 'Bring own'}
              </span>
            </div>
          </div>
        </div>

        {/* Walk distance */}
        {distance !== null && (
          <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
            <div className="flex items-center gap-2">
              <Navigation size={13} style={{ color: '#BFEA7C' }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#BFEA7C' }}>
                {distance < 1
                  ? `${Math.round(distance * 5280)} ft from your location`
                  : `${distance.toFixed(1)} miles from your location`}
              </span>
            </div>
          </div>
        )}

        {/* Season info */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
          <div className="flex items-start gap-2.5">
            <Clock size={13} style={{ color: 'rgba(247,245,240,0.4)', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#F7F5F0' }}>
                {program.season}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: program.registrationOpen ? 'rgba(74,222,128,0.15)' : 'rgba(247,245,240,0.08)',
                    color: program.registrationOpen ? '#4ADE80' : 'rgba(247,245,240,0.45)',
                    border: `1px solid ${program.registrationOpen ? 'rgba(74,222,128,0.3)' : 'rgba(247,245,240,0.12)'}`,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '11px',
                  }}
                >
                  {program.registrationOpen ? 'Registration Open' : 'Registration Closed'}
                </span>
              </div>
              <div className="flex items-center gap-1.5" style={{ marginTop: '4px' }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)' }}>
                  {program.registrationWindow}
                </span>
                {program.registrationWindowIsPlaceholder && (
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: 'rgba(242,193,78,0.6)', fontStyle: 'italic' }}>(ph data)</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {program.description && (
          <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                About
              </span>
              {program.descriptionIsPlaceholder && (
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: 'rgba(242,193,78,0.6)', fontStyle: 'italic' }}>(ph data)</span>
              )}
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: 'rgba(247,245,240,0.75)', lineHeight: 1.6 }}>
              {program.description}
            </p>
            {program.notes && (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', marginTop: '8px', fontStyle: 'italic', lineHeight: 1.5 }}>
                {program.notes}
              </p>
            )}
          </div>
        )}

        {/* Address */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
          <div className="flex items-start gap-2.5">
            <MapPin size={13} style={{ color: 'rgba(247,245,240,0.4)', marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: 'rgba(247,245,240,0.7)' }}>
              {program.address}
            </span>
          </div>
        </div>

        {/* Contact */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Contact
          </div>
          <div className="flex flex-col gap-2">
            {program.phone && (
              <a
                href={`tel:${program.phone}`}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Phone size={12} style={{ color: '#BFEA7C' }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#BFEA7C' }}>
                  {program.phone}
                </span>
              </a>
            )}
            {program.website && (
              <a
                href={program.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Globe size={12} style={{ color: '#BFEA7C' }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#BFEA7C' }}>
                  Visit website
                </span>
              </a>
            )}
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* Action buttons */}
      <div className="px-5 py-4 flex-shrink-0 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(247,245,240,0.1)', background: '#1A4A2E' }}>
        {program.website && (
          <a
            href={program.website}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-lg font-bold text-sm text-center transition-all duration-150 active:scale-[0.98] block"
            style={{
              background: '#F2C14E',
              color: '#0D2B1E',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '15px',
              letterSpacing: '0.05em',
            }}
          >
            REGISTER NOW
          </a>
        )}
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(program.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 rounded-lg font-bold text-sm text-center transition-all duration-150 active:scale-[0.98] block"
          style={{
            background: 'transparent',
            color: '#F7F5F0',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '0.05em',
            border: '1px solid rgba(247,245,240,0.2)',
          }}
        >
          GET DIRECTIONS
        </a>
      </div>
    </div>
  );
}

function ProgramLegend({ filters, onFilterChange, onSelectProgram }: {
  filters: ProgramFilters;
  onFilterChange: (f: ProgramFilters) => void;
  onSelectProgram: (p: Program) => void;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const programTypes: ProgramType[] = ['rbi', 'little-league', 'parks-rec', 'nonprofit'];

  const toggleProgramType = (type: ProgramType) => {
    const nextTypes = filters.programTypes.includes(type)
      ? filters.programTypes.filter((selectedType) => selectedType !== type)
      : [...filters.programTypes, type];
    onFilterChange({ ...filters, programTypes: nextTypes });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(247,245,240,0.1)' }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '18px', color: '#F7F5F0', letterSpacing: '0.03em' }}>
          FIND A PROGRAM
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(247,245,240,0.5)', marginTop: '4px' }}>
          Tap any pin on the map to see program details
        </div>
      </div>

      {/* Filter toggle */}
      <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Filter size={13} style={{ color: '#F2C14E' }} />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: '#F2C14E', letterSpacing: '0.05em' }}>
            FILTERS
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)' }}>
            {showFilters ? '▲ hide' : '▼ show'}
          </span>
        </button>

        {showFilters && (
          <div className="mt-4 flex flex-col gap-4">
            {/* Cost filter */}
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Cost
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onFilterChange({ ...filters, costFreeOnly: false })}
                  className="px-3 py-1.5 rounded-lg text-xs transition-all"
                  style={{
                    background: !filters.costFreeOnly ? 'rgba(242,193,78,0.2)' : 'rgba(247,245,240,0.06)',
                    color: !filters.costFreeOnly ? '#F2C14E' : 'rgba(247,245,240,0.5)',
                    border: `1px solid ${!filters.costFreeOnly ? 'rgba(242,193,78,0.4)' : 'rgba(247,245,240,0.1)'}`,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                  }}
                >
                  Any cost
                </button>
                <button
                  onClick={() => onFilterChange({ ...filters, costFreeOnly: true })}
                  className="px-3 py-1.5 rounded-lg text-xs transition-all"
                  style={{
                    background: filters.costFreeOnly ? 'rgba(74,222,128,0.2)' : 'rgba(247,245,240,0.06)',
                    color: filters.costFreeOnly ? '#4ADE80' : 'rgba(247,245,240,0.5)',
                    border: `1px solid ${filters.costFreeOnly ? 'rgba(74,222,128,0.4)' : 'rgba(247,245,240,0.1)'}`,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                  }}
                >
                  Free only
                </button>
              </div>
            </div>

            {/* Program type filter */}
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Program Type
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onFilterChange({ ...filters, programTypes: [] })}
                  className="px-3 py-1.5 rounded-lg text-xs transition-all"
                  style={{
                    background: filters.programTypes.length === 0 ? 'rgba(242,193,78,0.2)' : 'rgba(247,245,240,0.06)',
                    color: filters.programTypes.length === 0 ? '#F2C14E' : 'rgba(247,245,240,0.5)',
                    border: `1px solid ${filters.programTypes.length === 0 ? 'rgba(242,193,78,0.4)' : 'rgba(247,245,240,0.1)'}`,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px',
                  }}
                >
                  All
                </button>
                {programTypes.map((type) => {
                  const isSelected = filters.programTypes.includes(type);
                  return (
                  <button
                    key={type}
                    onClick={() => toggleProgramType(type)}
                    className="px-3 py-1.5 rounded-lg text-xs transition-all"
                    style={{
                      background: isSelected ? 'rgba(242,193,78,0.2)' : 'rgba(247,245,240,0.06)',
                      color: isSelected ? '#F2C14E' : 'rgba(247,245,240,0.5)',
                      border: `1px solid ${isSelected ? 'rgba(242,193,78,0.4)' : 'rgba(247,245,240,0.1)'}`,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '12px',
                    }}
                  >
                    {getProgramTypeLabel(type)}
                  </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Program list */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-3">
          {(() => {
            const filtered = programs.filter(p => {
              if (filters.costFreeOnly && p.cost !== 'free') return false;
              if (filters.programTypes.length > 0 && !filters.programTypes.includes(p.orgType)) return false;
              return true;
            });
            return (
              <>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                  {filtered.length} Program{filtered.length !== 1 ? 's' : ''} · Bay Area
                </div>
                <div className="flex flex-col gap-2">
                  {filtered.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onSelectProgram(p)}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-white/5 active:bg-white/10"
                      style={{ border: '1px solid rgba(247,245,240,0.08)' }}
                    >
                      <div
                        className="w-3 h-3 rounded-sm flex-shrink-0"
                        style={{
                          background: p.orgType === 'rbi' ? '#F2C14E' :
                                     p.orgType === 'little-league' ? '#BFEA7C' :
                                     p.orgType === 'parks-rec' ? '#4ADE80' : 'rgba(247,245,240,0.4)',
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#F7F5F0', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.name}
                        </div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.45)' }}>
                          {p.city} · Ages {p.ageMin}–{p.ageMax} · {getCostLabel(p.cost)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(247,245,240,0.1)' }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
          Map Legend
        </div>
        <div className="flex flex-col gap-1.5">
          {[
            { color: '#F2C14E', label: 'RBI Affiliate' },
            { color: '#BFEA7C', label: 'Little League' },
            { color: '#4ADE80', label: 'Parks & Rec' },
            { color: 'rgba(247,245,240,0.5)', label: 'Nonprofit' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: color }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.55)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProgramSidebar({ program, onClose, onSelectProgram, isOpen, userLocation, onFilterChange, filters }: ProgramSidebarProps) {
  return (
    <div
      className="flex-shrink-0 flex flex-col h-full overflow-hidden"
      style={{
        width: '380px',
        background: '#1A4A2E',
        borderRight: '1px solid rgba(247,245,240,0.1)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
      }}
    >
      {program ? (
        <ProgramCard program={program} userLocation={userLocation} onClose={onClose} />
      ) : (
        <ProgramLegend filters={filters} onFilterChange={onFilterChange} onSelectProgram={onSelectProgram} />
      )}
    </div>
  );
}
