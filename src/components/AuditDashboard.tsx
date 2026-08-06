import React from 'react';
import type { CampusAuditRecord } from '../types/audit';
import { ShieldCheck, MapPin, Play, Activity, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';

interface AuditDashboardProps {
  records: CampusAuditRecord[];
  onStartPilotAudit: () => void;
  onNavigateToTab: (tab: string) => void;
  onSelectRecord: (record: CampusAuditRecord) => void;
}

export const AuditDashboard: React.FC<AuditDashboardProps> = ({
  records,
  onStartPilotAudit,
  onNavigateToTab,
  onSelectRecord
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Featured Hero Banner: Medical Center Sample Pilot #1 */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '20px', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: '#FFFFFF', position: 'relative', overflow: 'hidden', border: 'none', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)' }}>
        <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.1, pointerEvents: 'none' }}>
          <ShieldCheck size={320} color="#3B82F6" />
        </div>

        <div style={{ maxWidth: '820px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.25)', color: '#93C5FD', padding: '6px 14px', borderRadius: '30px', fontSize: '0.78rem', fontWeight: 800, border: '1px solid rgba(59, 130, 246, 0.4)', marginBottom: '12px' }}>
            <span>📍 SAMPLE PILOT IMPLEMENTATION #1 OF 56</span>
          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#F8FAFC', lineHeight: '1.2' }}>
            Campus Health & Medical Center Smart FC Audit
          </h1>

          <p style={{ fontSize: '0.92rem', color: '#CBD5E1', marginTop: '8px', lineHeight: '1.6', fontWeight: 500 }}>
            Eliminate ghost auditing across 56 college venues. Pre-defined geo-location coordinates (11.493954° N, 77.274503° E), 25m Geo-fence enforcement, physical QR plaque scanning, mandatory photo evidence for failed checks, dynamic AI spot questions, and automated 85%+ self-approval score ranking.
          </p>

          <div style={{ display: 'flex', gap: '14px', marginTop: '24px', flexWrap: 'wrap' }}>
            <button
              onClick={onStartPilotAudit}
              className="btn-primary"
              style={{ padding: '14px 32px', fontSize: '1rem', fontWeight: 900, borderRadius: '12px', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(5, 150, 105, 0.4)' }}
            >
              <Play size={20} /> Launch Medical Center Pilot Audit (24 Qs)
            </button>

            <button
              onClick={() => onNavigateToTab('56-venues-registry')}
              className="btn-secondary"
              style={{ padding: '14px 24px', fontSize: '0.9rem', fontWeight: 800, borderRadius: '12px', background: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <MapPin size={18} /> View All 56 Campus Venues
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', background: '#FFFFFF' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>Total FC Venues</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>56 <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Venues</span></div>
          <div style={{ fontSize: '0.72rem', color: '#2563EB', marginTop: '4px', fontWeight: 700 }}>100% Geo-Fenced</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', background: '#FFFFFF' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>Self-Approved FC Passed</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669', marginTop: '4px' }}>38 <span style={{ fontSize: '0.8rem', color: '#64748B' }}>(Score ≥ 85%)</span></div>
          <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '4px', fontWeight: 700 }}>Auto-Certified</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', background: '#FFFFFF' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>Auditor Review Queue</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#DC2626', marginTop: '4px' }}>8 <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Venues</span></div>
          <div style={{ fontSize: '0.72rem', color: '#DC2626', marginTop: '4px', fontWeight: 700 }}>Requires Re-Inspection</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', background: '#FFFFFF' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>Ghost Audits Prevented</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#D97706', marginTop: '4px' }}>42 <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Pings</span></div>
          <div style={{ fontSize: '0.72rem', color: '#D97706', marginTop: '4px', fontWeight: 700 }}>Outside 25m Radius</div>
        </div>

      </div>

      {/* Recent Audit Sessions Log */}
      <div className="glass-panel" style={{ padding: '24px', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="#2563EB" /> Recent Campus Audit Submissions & AI Scorecards
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
              Real-time audit history showing GPS verification, photo evidence, and authenticity score routing.
            </p>
          </div>

          <button onClick={() => onNavigateToTab('56-venues-registry')} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
            View Full Log <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {records.map(rec => {
            const isApproved = rec.authenticity.overallScore >= 85;

            return (
              <div
                key={rec.id}
                onClick={() => onSelectRecord(rec)}
                style={{
                  background: '#F8FAFC',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: isApproved ? '1px solid #A7F3D0' : '1px solid #FCA5A5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Score circle */}
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: isApproved ? '#D1FAE5' : '#FEE2E2', border: `2px solid ${isApproved ? '#059669' : '#DC2626'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem', color: isApproved ? '#065F46' : '#991B1B' }}>
                    {rec.authenticity.overallScore}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F172A' }}>
                        {rec.venueName}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#2563EB', fontFamily: 'monospace', fontWeight: 700 }}>
                        ({rec.venueCode})
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                      Auditor: <strong>{rec.auditorName}</strong> • Inspector: <strong>{rec.auditedByAuditeeName}</strong> • GPS Drift: <strong>{rec.gpsDistanceMeters}m</strong>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div style={{ textAlign: 'right' }}>
                  {isApproved ? (
                    <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, border: '1px solid #A7F3D0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> SELF-APPROVED (PASSED)
                    </span>
                  ) : (
                    <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, border: '1px solid #FCA5A5', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle size={14} /> AUDITOR REVIEW REQ
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
