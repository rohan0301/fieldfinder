// NeighborhoodSidebar — FieldFinder
// RBI Officials view sidebar.
// Shows ZIP-level profile: RBI score, economic indicators, infrastructure signals, and field notes.

import { X, AlertTriangle, CheckCircle, Building2, MapPin, Activity, TrendingUp, FileText } from 'lucide-react';
import type { Neighborhood } from '@/lib/data';
import { getConditionLabel, sortedNeighborhoods, getAllAdjustedNeighborhoods, programs } from '@/lib/data';

interface NeighborhoodSidebarProps {
  neighborhood: Neighborhood | null;
  onClose: () => void;
  onSelectNeighborhood: (n: Neighborhood) => void;
  isOpen: boolean;
}

const adjustedNeighborhoods = getAllAdjustedNeighborhoods(programs);
const adjustedNeighborhoodMap = new Map(adjustedNeighborhoods.map(n => [n.id, n]));

function getDisplayScore(neighborhood: Neighborhood): number {
  return adjustedNeighborhoodMap.get(neighborhood.id)?.adjustedNeedScore ?? neighborhood.needScore;
}

function PriorityList({ onSelectNeighborhood, selectedId }: {
  onSelectNeighborhood: (n: Neighborhood) => void;
  selectedId: string | null;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(247,245,240,0.1)' }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '18px', color: '#F7F5F0', letterSpacing: '0.03em' }}>
          PRIORITY ZIP CODES
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(247,245,240,0.5)', marginTop: '4px' }}>
          Alameda + SF County · Ranked by RBI Readiness
        </div>
      </div>

      {/* Sort hint */}
      <div className="px-5 py-2 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Sort by
        </span>
        <button className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(242,193,78,0.15)', color: '#F2C14E', fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
          RBI Score
        </button>
        <button className="text-xs px-2 py-0.5 rounded" style={{ color: 'rgba(247,245,240,0.35)', fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
          Free Lunch %
        </button>
        <button className="text-xs px-2 py-0.5 rounded" style={{ color: 'rgba(247,245,240,0.35)', fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
          Field Count
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {sortedNeighborhoods.map((n, i) => (
          <button
            key={n.id}
            onClick={() => onSelectNeighborhood(n)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150"
            style={{
              background: selectedId === n.id ? 'rgba(242,193,78,0.12)' : 'transparent',
              borderLeft: selectedId === n.id ? '3px solid #F2C14E' : '3px solid transparent',
            }}
          >
            {/* Rank */}
            <span
              className="flex-shrink-0 w-6 text-center"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'rgba(247,245,240,0.35)' }}
            >
              {i + 1}
            </span>

            {/* Name + city + ZIP */}
            <div className="flex-1 min-w-0">
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '15px', color: '#F7F5F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {n.name}
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.45)' }}>
                {n.city} · {n.zipCodes[0]}
              </div>
            </div>

            {/* Score bar + value */}
            <div className="flex-shrink-0 flex flex-col items-end gap-1">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#F2C14E', fontWeight: 500 }}>
                {getDisplayScore(n).toFixed(1)}
              </span>
              <div style={{ width: '48px', height: '3px', background: 'rgba(247,245,240,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${(getDisplayScore(n) / 10) * 100}%`, height: '100%', background: '#F2C14E', borderRadius: '2px' }} />
              </div>
            </div>

            {/* Gap indicator */}
            {n.gapStatus === 'gap' && (
              <div className="flex-shrink-0 w-2 h-2 rounded-full" style={{ background: '#C0392B' }} />
            )}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(247,245,240,0.1)' }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: 'rgba(247,245,240,0.4)', marginBottom: '6px' }}>
          Score = SVI (50%) + Field density (25%) + B&GC (25%) × 10 − Org Impact
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: '#C0392B' }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.5)' }}>No strong org coverage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: '#4ADE80' }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.5)' }}>Org present</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCell({ icon, label, value, sub }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        {icon}
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '15px', color: '#F7F5F0', fontWeight: 500 }}>{value}</span>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: 'rgba(247,245,240,0.35)' }}>{sub}</span>
    </div>
  );
}

function NeighborhoodProfile({ neighborhood, onClose }: {
  neighborhood: Neighborhood;
  onClose: () => void;
}) {
  const isGap = neighborhood.gapStatus === 'gap';
  const displayScore = getDisplayScore(neighborhood);
  const adjusted = adjustedNeighborhoodMap.get(neighborhood.id);
  const orgReduction = adjusted?.orgCoverageReduction ?? 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(247,245,240,0.1)' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '24px', color: '#F7F5F0', lineHeight: 1.1, letterSpacing: '0.02em' }}
            >
              {neighborhood.name.toUpperCase()}
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(247,245,240,0.5)', marginTop: '3px' }}>
              {neighborhood.city} · ZIP {neighborhood.zipCodes[0]} · {neighborhood.county}
            </div>
          </div>
          <div className="flex items-start gap-2 flex-shrink-0">
            {/* Score badge */}
            <div className="flex flex-col items-center px-3 py-1.5 rounded-xl" style={{ background: '#F2C14E' }}>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '24px', color: '#0D2B1E', lineHeight: 1 }}>
                {displayScore.toFixed(1)}
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', color: 'rgba(13,43,30,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                / 10
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
              style={{ color: 'rgba(247,245,240,0.5)' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: 'rgba(247,245,240,0.35)', marginTop: '4px' }}>
          RBI Readiness Score · SVI (50%) + Field density (25%) + B&GC (25%)
          {orgReduction > 0 && (
            <>
              {' · '}
              <span style={{ color: 'rgba(242,193,78,0.8)' }}>Org Coverage -{orgReduction.toFixed(2)}</span>
            </>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* Key indicators strip */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
          <div className="grid grid-cols-2 gap-3">
            <StatCell
              icon={<TrendingUp size={11} style={{ color: 'rgba(247,245,240,0.4)' }} />}
              label="Free Lunch %"
              value={`${(neighborhood.freeLunchPct * 100).toFixed(0)}%`}
              sub="students qualifying (poverty proxy)"
            />
            <StatCell
              icon={<Activity size={11} style={{ color: 'rgba(247,245,240,0.4)' }} />}
              label="CDC SVI"
              value={neighborhood.sviScore.toFixed(3)}
              sub="social vulnerability (0–1)"
            />
            <StatCell
              icon={<MapPin size={11} style={{ color: 'rgba(247,245,240,0.4)' }} />}
              label="Baseball Fields"
              value={neighborhood.baseballFieldCount.toString()}
              sub="confirmed in ZIP"
            />
            <StatCell
              icon={<Building2 size={11} style={{ color: 'rgba(247,245,240,0.4)' }} />}
              label="B&GC Locations"
              value={neighborhood.bgcCount.toString()}
              sub="Boys & Girls Club in ZIP"
            />
          </div>
        </div>

        {/* Population */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(247,245,240,0.5)' }}>ZIP Population</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#F7F5F0' }}>
              {neighborhood.population.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Org coverage banner */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
            style={{
              background: isGap ? 'rgba(192,57,43,0.15)' : 'rgba(74,222,128,0.15)',
              border: `1px solid ${isGap ? 'rgba(192,57,43,0.35)' : 'rgba(74,222,128,0.35)'}`,
            }}
          >
            {isGap ? (
              <AlertTriangle size={14} style={{ color: '#C0392B', flexShrink: 0 }} />
            ) : (
              <CheckCircle size={14} style={{ color: '#4ADE80', flexShrink: 0 }} />
            )}
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: isGap ? '#C0392B' : '#4ADE80', fontWeight: 500 }}>
              {isGap ? 'No strong org coverage detected' : 'Org presence confirmed in this ZIP'}
            </span>
          </div>
        </div>

        {/* Deployment readiness signals */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
            Deployment Signals
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: 'High Social Vulnerability (SVI > 0.3)', active: neighborhood.sviScore > 0.3 },
              { label: 'High Economic Need (Free Lunch > 70%)', active: neighborhood.freeLunchPct > 0.7 },
              { label: 'Baseball Field Infrastructure Present', active: neighborhood.baseballFieldCount > 0 },
              { label: 'Strong Infrastructure (field quality)', active: neighborhood.strongInfrastructure },
              { label: 'Strong Org Signal (community programs)', active: neighborhood.strongOrg },
              { label: 'Dense B&GC Network (5+ locations)', active: neighborhood.bgcCount >= 5 },
            ].map((signal) => (
              <div key={signal.label} className="flex items-center gap-2.5">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: signal.active ? '#F2C14E' : 'rgba(247,245,240,0.2)' }}
                />
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  color: signal.active ? 'rgba(247,245,240,0.8)' : 'rgba(247,245,240,0.3)',
                }}>
                  {signal.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Nearest affiliate (if known) */}
        {neighborhood.milestoNearestAffiliate !== null && (
          <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
              Nearest RBI Affiliate
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(247,245,240,0.7)' }}>
                {neighborhood.nearestAffiliateName}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#F2C14E' }}>
                {neighborhood.milestoNearestAffiliate} mi
              </span>
            </div>
          </div>
        )}

        {/* Confirmed fields */}
        {neighborhood.fields.length > 0 && (
          <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Confirmed Fields / Sites
            </div>
            <div className="flex flex-col gap-2">
              {neighborhood.fields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ background: 'rgba(247,245,240,0.04)', border: '1px solid rgba(247,245,240,0.08)' }}
                >
                  <div
                    className="mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full"
                    style={{
                      background: field.condition === 'ready' ? '#4ADE80' :
                                  field.condition === 'investment-needed' ? '#F2C14E' : '#C0392B'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#F7F5F0', fontWeight: 500 }}>
                      {field.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span style={{
                        fontFamily: "'Inter', sans-serif", fontSize: '10px',
                        color: field.condition === 'ready' ? '#4ADE80' : field.condition === 'investment-needed' ? '#F2C14E' : '#C0392B',
                        fontWeight: 500,
                      }}>
                        {getConditionLabel(field.condition)}
                      </span>
                      {field.isRecCenter && (
                        <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(191,234,124,0.15)', color: '#BFEA7C', fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                          Rec Center
                        </span>
                      )}
                    </div>
                    {field.conditionNotes && (
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', marginTop: '4px', lineHeight: 1.45 }}>
                        {field.conditionNotes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested anchor org */}
        {neighborhood.suggestedAnchor && (
          <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Suggested Anchor Org
            </div>
            <div
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: 'rgba(242,193,78,0.06)', border: '1px solid rgba(242,193,78,0.2)' }}
            >
              <Building2 size={16} style={{ color: '#F2C14E', flexShrink: 0, marginTop: '2px' }} />
              <div className="flex-1">
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#F7F5F0', fontWeight: 500 }}>
                  {neighborhood.suggestedAnchor.name}
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <div className="flex items-center gap-1">
                    <MapPin size={10} style={{ color: 'rgba(247,245,240,0.4)' }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(247,245,240,0.6)' }}>
                      {neighborhood.suggestedAnchor.distanceMiles} mi away
                    </span>
                  </div>
                  {neighborhood.suggestedAnchor.hasGym && (
                    <span className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ADE80', fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                      Has Gym
                    </span>
                  )}
                </div>
                {neighborhood.suggestedAnchor.phone && (
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.45)', marginTop: '4px' }}>
                    {neighborhood.suggestedAnchor.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Field / analyst note */}
        {neighborhood.fieldNote && (
          <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
              <FileText size={11} style={{ color: 'rgba(247,245,240,0.4)' }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Analyst Notes
              </span>
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(247,245,240,0.65)', lineHeight: 1.6 }}>
              {neighborhood.fieldNote}
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>

      {/* CTA button */}
      <div className="px-5 py-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(247,245,240,0.1)', background: '#1A4A2E' }}>
        <button
          className="w-full py-3 rounded-lg font-bold text-sm transition-all duration-150 active:scale-[0.98]"
          style={{
            background: '#F2C14E',
            color: '#0D2B1E',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '15px',
            letterSpacing: '0.05em',
          }}
          onClick={() => {
            window.open(
              `mailto:rbi@mlb.com?subject=RBI Outreach: ${neighborhood.name} (${neighborhood.zipCodes[0]})` +
              `&body=Neighborhood: ${neighborhood.name}%0AZIP: ${neighborhood.zipCodes[0]}%0ACity: ${neighborhood.city}%0A` +
              `RBI Readiness Score: ${neighborhood.needScore}/10%0ASVI: ${neighborhood.sviScore.toFixed(3)}%0A` +
              `Free Lunch %%: ${(neighborhood.freeLunchPct * 100).toFixed(0)}%%%0A` +
              `Baseball Fields: ${neighborhood.baseballFieldCount}%0AB%26GC Locations: ${neighborhood.bgcCount}%0A%0A` +
              `This ZIP has been identified as a high-priority candidate for RBI program deployment.`,
              '_blank'
            );
          }}
        >
          FLAG FOR RBI OUTREACH
        </button>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.35)', textAlign: 'center', marginTop: '8px' }}>
          Opens pre-filled email with ZIP profile data
        </p>
      </div>
    </div>
  );
}

export function NeighborhoodSidebar({ neighborhood, onClose, onSelectNeighborhood, isOpen }: NeighborhoodSidebarProps) {
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
      {neighborhood ? (
        <NeighborhoodProfile neighborhood={neighborhood} onClose={onClose} />
      ) : (
        <PriorityList onSelectNeighborhood={onSelectNeighborhood} selectedId={null} />
      )}
    </div>
  );
}
