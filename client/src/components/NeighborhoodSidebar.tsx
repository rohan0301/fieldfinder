// NeighborhoodSidebar — First Base
// RBI Officials view sidebar.
// Shows neighborhood profile with need score, stats, fields, anchor, and CTA.
// Slides in from left on neighborhood click.

import { X, AlertTriangle, CheckCircle, Building2, MapPin, Users, DollarSign, Navigation, Star } from 'lucide-react';
import type { Neighborhood } from '@/lib/data';
import { formatIncome, getConditionLabel } from '@/lib/data';
import { sortedNeighborhoods } from '@/lib/data';

interface NeighborhoodSidebarProps {
  neighborhood: Neighborhood | null;
  onClose: () => void;
  onSelectNeighborhood: (n: Neighborhood) => void;
  isOpen: boolean;
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
          PRIORITY NEIGHBORHOODS
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(247,245,240,0.5)', marginTop: '4px' }}>
          Alameda County · Ranked by need score
        </div>
      </div>

      {/* Sort hint */}
      <div className="px-5 py-2 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Sort by
        </span>
        <button className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(232,168,56,0.15)', color: '#E8A838', fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
          Need Score
        </button>
        <button className="text-xs px-2 py-0.5 rounded" style={{ color: 'rgba(247,245,240,0.35)', fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
          Gap Distance
        </button>
        <button className="text-xs px-2 py-0.5 rounded" style={{ color: 'rgba(247,245,240,0.35)', fontFamily: "'Inter', sans-serif", fontSize: '11px' }}>
          Youth Pop.
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
              background: selectedId === n.id ? 'rgba(232,168,56,0.12)' : 'transparent',
              borderLeft: selectedId === n.id ? '3px solid #E8A838' : '3px solid transparent',
            }}
          >
            {/* Rank */}
            <span
              className="flex-shrink-0 w-6 text-center"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'rgba(247,245,240,0.35)' }}
            >
              {i + 1}
            </span>

            {/* Name + city */}
            <div className="flex-1 min-w-0">
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '15px', color: '#F7F5F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {n.name}
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.45)' }}>
                {n.city}
              </div>
            </div>

            {/* Score bar + value */}
            <div className="flex-shrink-0 flex flex-col items-end gap-1">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#E8A838', fontWeight: 500 }}>
                {n.needScore.toFixed(1)}
              </span>
              <div style={{ width: '48px', height: '3px', background: 'rgba(247,245,240,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${(n.needScore / 10) * 100}%`, height: '100%', background: '#E8A838', borderRadius: '2px' }} />
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: '#C0392B' }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.5)' }}>No RBI affiliate within 4mi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: '#27AE60' }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.5)' }}>Covered</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NeighborhoodProfile({ neighborhood, onClose }: {
  neighborhood: Neighborhood;
  onClose: () => void;
}) {
  const isGap = neighborhood.gapStatus === 'gap';

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(247,245,240,0.1)' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '28px', color: '#F7F5F0', lineHeight: 1.1, letterSpacing: '0.02em' }}
            >
              {neighborhood.name.toUpperCase()}
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: 'rgba(247,245,240,0.5)', marginTop: '3px' }}>
              {neighborhood.city} · Alameda County
            </div>
          </div>
          <div className="flex items-start gap-2 flex-shrink-0">
            {/* Score badge */}
            <div
              className="flex flex-col items-center px-3 py-1.5 rounded-xl"
              style={{ background: '#E8A838' }}
            >
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '24px', color: '#0D2B1E', lineHeight: 1 }}>
                {neighborhood.needScore.toFixed(1)}
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
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', marginTop: '4px' }}>
          Priority Score
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* Stats strip */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <Users size={11} style={{ color: 'rgba(247,245,240,0.4)' }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Youth Pop.</span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '15px', color: '#F7F5F0', fontWeight: 500 }}>
                {neighborhood.youthPopulation.toLocaleString()}
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: 'rgba(247,245,240,0.35)' }}>ages 5–18</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <DollarSign size={11} style={{ color: 'rgba(247,245,240,0.4)' }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Median Income</span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '15px', color: '#F7F5F0', fontWeight: 500 }}>
                {formatIncome(neighborhood.medianIncome)}
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: 'rgba(247,245,240,0.35)' }}>household/yr</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <AlertTriangle size={11} style={{ color: 'rgba(247,245,240,0.4)' }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Poverty Rate</span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '15px', color: '#F7F5F0', fontWeight: 500 }}>
                {neighborhood.povertyRate}%
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: 'rgba(247,245,240,0.35)' }}>below poverty line</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <Navigation size={11} style={{ color: 'rgba(247,245,240,0.4)' }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nearest Affiliate</span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '15px', color: '#F7F5F0', fontWeight: 500 }}>
                {neighborhood.milestoNearestAffiliate} mi
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', color: 'rgba(247,245,240,0.35)' }}>to nearest RBI</span>
            </div>
          </div>
        </div>

        {/* Gap status banner */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
            style={{
              background: isGap ? 'rgba(192,57,43,0.15)' : 'rgba(39,174,96,0.15)',
              border: `1px solid ${isGap ? 'rgba(192,57,43,0.35)' : 'rgba(39,174,96,0.35)'}`,
            }}
          >
            {isGap ? (
              <AlertTriangle size={14} style={{ color: '#C0392B', flexShrink: 0 }} />
            ) : (
              <CheckCircle size={14} style={{ color: '#27AE60', flexShrink: 0 }} />
            )}
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', color: isGap ? '#C0392B' : '#27AE60', fontWeight: 500 }}>
              {isGap
                ? `No RBI affiliate within ${neighborhood.milestoNearestAffiliate} miles`
                : 'Affiliate present — coverage confirmed'}
            </span>
          </div>
        </div>

        {/* Demographics */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Demographics
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: '#F7F5F0' }}>{neighborhood.pctBlack}%</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.45)' }}>Black</div>
            </div>
            <div className="flex-1">
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: '#F7F5F0' }}>{neighborhood.pctLatino}%</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.45)' }}>Latino</div>
            </div>
            <div className="flex-1">
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: '#E8A838' }}>{neighborhood.sviScore.toFixed(2)}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.45)' }}>CDC SVI</div>
            </div>
          </div>
        </div>

        {/* Fields */}
        {neighborhood.fields.length > 0 && (
          <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Nearby Fields
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
                      background: field.condition === 'ready' ? '#27AE60' :
                                  field.condition === 'investment-needed' ? '#E8A838' : '#C0392B'
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#F7F5F0', fontWeight: 500 }}>
                      {field.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1">
                        <Star size={10} style={{ color: '#E8A838', fill: '#E8A838' }} />
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(247,245,240,0.6)' }}>
                          {field.googleRating} ({field.reviewCount})
                        </span>
                      </div>
                      {field.isRecCenter && (
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(74,144,217,0.15)', color: '#4A90D9', fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
                          Rec Center
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', marginTop: '3px' }}>
                      {getConditionLabel(field.condition)}
                    </div>
                    {field.conditionNotes && (
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.35)', marginTop: '2px', fontStyle: 'italic' }}>
                        {field.conditionNotes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested anchor */}
        {neighborhood.suggestedAnchor && (
          <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              Suggested Anchor
            </div>
            <div
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: 'rgba(232,168,56,0.06)', border: '1px solid rgba(232,168,56,0.2)' }}
            >
              <Building2 size={16} style={{ color: '#E8A838', flexShrink: 0, marginTop: '2px' }} />
              <div className="flex-1">
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#F7F5F0', fontWeight: 500 }}>
                  {neighborhood.suggestedAnchor.name}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin size={10} style={{ color: 'rgba(247,245,240,0.4)' }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(247,245,240,0.6)' }}>
                      {neighborhood.suggestedAnchor.distanceMiles} mi away
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={10} style={{ color: '#E8A838', fill: '#E8A838' }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(247,245,240,0.6)' }}>
                      {neighborhood.suggestedAnchor.googleRating}
                    </span>
                  </div>
                  {neighborhood.suggestedAnchor.hasGym && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(39,174,96,0.15)', color: '#27AE60', fontSize: '10px', fontFamily: "'Inter', sans-serif" }}>
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

        {/* Scoring signals */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(247,245,240,0.08)' }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
            Scoring Signals
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: 'High SVI Score', active: neighborhood.sviScore > 0.7 },
              { label: 'High Youth Density', active: neighborhood.youthPopulation > 1500 },
              { label: 'No RBI Affiliate (4mi)', active: neighborhood.gapStatus === 'gap' },
              { label: 'Field Infrastructure Confirmed', active: neighborhood.hasConfirmedField },
              { label: 'Near High Free-Lunch School', active: neighborhood.nearHighFreeLunchSchool },
              { label: 'No Little League Nearby', active: neighborhood.noLittleLeagueNearby },
            ].map((signal) => (
              <div key={signal.label} className="flex items-center gap-2.5">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: signal.active ? '#E8A838' : 'rgba(247,245,240,0.2)' }}
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

        {/* Spacer for CTA */}
        <div className="h-4" />
      </div>

      {/* CTA button */}
      <div className="px-5 py-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(247,245,240,0.1)', background: '#1A4A2E' }}>
        <button
          className="w-full py-3 rounded-lg font-bold text-sm transition-all duration-150 active:scale-[0.98]"
          style={{
            background: '#E8A838',
            color: '#0D2B1E',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '15px',
            letterSpacing: '0.05em',
          }}
          onClick={() => {
            window.open(`mailto:rbi@mlb.com?subject=RBI Outreach: ${neighborhood.name}&body=Neighborhood: ${neighborhood.name}%0ANeed Score: ${neighborhood.needScore}/10%0ACity: ${neighborhood.city}%0A%0AThis neighborhood has been identified as a high-priority candidate for RBI program deployment.`, '_blank');
          }}
        >
          FLAG FOR RBI OUTREACH
        </button>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: 'rgba(247,245,240,0.35)', textAlign: 'center', marginTop: '8px' }}>
          Opens pre-filled email to RBI affiliate inquiry
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
