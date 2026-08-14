import React from 'react';
import type { CampusAuditRecord } from '../types/audit';
import { ShieldCheck, ShieldAlert, Award, Navigation, Clock, Camera, Sparkles, CheckCircle2, RefreshCcw } from 'lucide-react';

interface AuthenticityRankingScorecardProps {
  record: CampusAuditRecord;
  onViewCertificate?: () => void;
  onScheduleReview?: () => void;
}

export const AuthenticityRankingScorecard: React.FC<AuthenticityRankingScorecardProps> = ({
  record,
  onViewCertificate,
  onScheduleReview
}) => {
  const { authenticity } = record;
  const isApproved = authenticity.overallScore >= 85 && record.status === 'PASSED_SELF_APPROVED';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner: Score Gauge & Status */}
      <div className="glass-panel" style={{ padding: '28px', background: isApproved ? '#F0FDF4' : '#FEF2F2', border: isApproved ? '2px solid #86EFAC' : '2px solid #FCA5A5', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Radial Score Gauge */}
            <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', background: '#FFFFFF', border: `4px solid ${isApproved ? '#059669' : '#DC2626'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: isApproved ? '0 4px 15px rgba(5, 150, 105, 0.2)' : '0 4px 15px rgba(220, 38, 38, 0.2)' }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: isApproved ? '#065F46' : '#991B1B', lineHeight: '1' }}>
                {authenticity.overallScore}
              </span>
              <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800, marginTop: '2px' }}>
                / 100 SCORE
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {isApproved ? (
                  <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 900, border: '1px solid #A7F3D0', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} /> SELF-APPROVED (SCORE ≥ 85%)
                  </span>
                ) : (
                  <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 900, border: '1px solid #FCA5A5', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldAlert size={16} /> AUDITOR REVIEW REQUIRED (SCORE &lt; 85%)
                  </span>
                )}
                <span style={{ fontSize: '0.8rem', color: '#475569', fontFamily: 'monospace', fontWeight: 700 }}>
                  Cert ID: {record.certificateNumber}
                </span>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '8px' }}>
                {record.venueName} ({record.venueCode})
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#334155', marginTop: '2px', fontWeight: 600 }}>
                {authenticity.reviewReason}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {isApproved ? (
              <button
                onClick={onViewCertificate}
                className="btn-primary"
                style={{ padding: '12px 24px', fontSize: '0.9rem', fontWeight: 900, background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Award size={18} /> View Fitness Certificate
              </button>
            ) : (
              <button
                onClick={onScheduleReview}
                className="btn-danger"
                style={{ padding: '12px 24px', fontSize: '0.9rem', fontWeight: 900, background: '#DC2626', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <RefreshCcw size={18} /> Schedule Auditor Re-Inspection
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Grid: 4 Metric Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Metric 1: GPS Proximity */}
        <div className="glass-panel" style={{ padding: '18px', borderRadius: '12px', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Navigation size={14} color="#2563EB" /> GPS Geo-Fence Precision
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: authenticity.gpsProximityScore >= 80 ? '#059669' : '#DC2626' }}>
              {authenticity.gpsProximityScore}%
            </span>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A' }}>
            {record.gpsDistanceMeters} meters drift
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
            Limit: {25}m radius
          </div>
        </div>

        {/* Metric 2: Inspection Dwell Time */}
        <div className="glass-panel" style={{ padding: '18px', borderRadius: '12px', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#D97706" /> Dwell Duration Audit
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: authenticity.dwellTimeScore >= 80 ? '#059669' : '#DC2626' }}>
              {authenticity.dwellTimeScore}%
            </span>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A' }}>
            {record.timeSpentMinutes} mins logged
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
            Standard min: 15 mins
          </div>
        </div>

        {/* Metric 3: Photo Proof Validation */}
        <div className="glass-panel" style={{ padding: '18px', borderRadius: '12px', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Camera size={14} color="#DB2777" /> Photo Evidence Score
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: authenticity.photoAuthenticityScore >= 80 ? '#059669' : '#DC2626' }}>
              {authenticity.photoAuthenticityScore}%
            </span>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A' }}>
            {Object.values(record.predefinedAnswers).filter(a => a.photoProof).length} Photos Attached
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
            Verified Exif & Geo-tags
          </div>
        </div>

        {/* Metric 4: AI Dynamic Spot Checks */}
        <div className="glass-panel" style={{ padding: '18px', borderRadius: '12px', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="#7C3AED" /> AI Dynamic Spot Checks
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: authenticity.aiDynamicCheckScore >= 80 ? '#059669' : '#DC2626' }}>
              {authenticity.aiDynamicCheckScore}%
            </span>
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A' }}>
            {record.aiDynamicQuestions.filter(q => q.isCorrect).length} / {record.aiDynamicQuestions.length || 1} Correct
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
            Spot Check Validation
          </div>
        </div>

      </div>

      {/* Captured Photo Evidence Gallery */}
      {(() => {
        const photos = Object.values(record.predefinedAnswers || {}).filter(a => a && a.photoProof).map(a => a.photoProof!);
        if (photos.length === 0) return null;

        return (
          <div className="glass-panel" style={{ padding: '20px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={18} color="#2563EB" /> Captured On-Ground Photo Proofs ({photos.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {photos.map(p => (
                <div key={p.id} style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: '180px', background: '#0F172A' }}>
                    <img src={p.photoUrl} alt={p.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '8px', right: '8px', background: '#2563EB', color: '#FFF', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                      {p.issueCategory || 'Proof'}
                    </span>
                  </div>
                  <div style={{ padding: '12px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                      {p.caption}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                      <span>🕒 {p.timestamp}</span>
                      {p.geoTag && <span>📍 {p.geoTag.lat.toFixed(4)}°, {p.geoTag.lng.toFixed(4)}°</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Discrepancy & Anomaly Warnings Log */}
      {authenticity.discrepancyFlags.length > 0 && (
        <div className="glass-panel" style={{ padding: '20px', border: '1px solid #FCA5A5', background: '#FEE2E2' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#991B1B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} /> Flagged Discrepancies & Audit Anomaly Alerts
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#7F1D1D', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px', fontWeight: 600 }}>
            {authenticity.discrepancyFlags.map((flag, idx) => (
              <li key={idx}>⚠️ {flag}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Cryptographic Hash & Verification Seal */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', background: '#FFFFFF' }}>
        <div style={{ fontSize: '0.75rem', color: '#475569', fontFamily: 'monospace', fontWeight: 700 }}>
          CRYPTOGRAPHIC SEAL HASH: <span style={{ color: '#2563EB' }}>{record.cryptoSignatureHash}</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={14} /> Immutable Campus Audit Ledger Record Verified
        </div>
      </div>

    </div>
  );
};
