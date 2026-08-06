import React from 'react';
import type { CampusAuditRecord } from '../types/audit';
import { Award, QrCode, Printer } from 'lucide-react';

interface FitnessCertificateModalProps {
  record: CampusAuditRecord;
  onClose: () => void;
}

export const FitnessCertificateModal: React.FC<FitnessCertificateModalProps> = ({ record, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: '780px', background: '#FFFFFF', border: '3px solid #D97706', borderRadius: '16px', padding: '32px', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.25)', color: '#0F172A' }}>
        
        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', right: '20px', top: '20px', background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#0F172A', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 800 }}>✕ Close</button>

        {/* Certificate Frame */}
        <div style={{ border: '2px dashed #D97706', padding: '28px', borderRadius: '12px', background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', textAlign: 'center' }}>
          
          {/* Top Emblem */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4)' }}>
              <Award size={36} color="#FFFFFF" />
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '2px', color: '#B45309', textTransform: 'uppercase' }}>
            COLLEGE CAMPUS INFRASTRUCTURE AUDIT AUTHORITY
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#78350F', margin: '8px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
            CERTIFICATE OF INFRASTRUCTURE FITNESS
          </h1>

          <div style={{ fontSize: '0.85rem', color: '#475569', fontFamily: 'monospace', fontWeight: 700 }}>
            Certificate Serial No: <strong style={{ color: '#2563EB' }}>{record.certificateNumber}</strong>
          </div>

          <hr style={{ borderColor: '#FDE68A', margin: '20px 0' }} />

          <p style={{ fontSize: '0.95rem', color: '#1E293B', lineHeight: '1.6', fontWeight: 600 }}>
            This is to certify that the campus infrastructure venue <strong style={{ color: '#78350F', fontSize: '1.1rem' }}>"{record.venueName}"</strong> (Code: {record.venueCode}) located at <strong>{record.venueCategory}</strong> has been physically inspected & verified on-site.
          </p>

          {/* Audit Metrics Summary Box */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', margin: '20px 0', background: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #FDE68A', textAlign: 'left' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>AI Authenticity Score</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#059669' }}>{record.authenticity.overallScore}% (PASSED)</div>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>GPS Geo-Fence Match</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#2563EB' }}>{record.gpsDistanceMeters}m Verified</div>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>Audit Date</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A' }}>{record.auditDate}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>Recurrence Cycle</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#D97706' }}>15-Day Cycle</div>
            </div>
          </div>

          {/* Signatures & Seal Grid */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '24px', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>Assigned Lead Auditor:</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>{record.auditorName || 'Prof. Sibi John'}</div>
              <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 800 }}>Fitness Certificate Incharge</div>
            </div>

            {/* QR Verification Seal */}
            <div style={{ background: '#0F172A', padding: '6px', borderRadius: '8px', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={68} color="#FFFFFF" />
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>Inspected By Auditee:</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>{record.auditedByAuditeeName || 'Mrs. Priya L, AP-III, Dept of IT'}</div>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800 }}>✓ Verified On-Site</div>
            </div>
          </div>

          <div style={{ marginTop: '20px', fontSize: '0.68rem', color: '#64748B', fontFamily: 'monospace', fontWeight: 700 }}>
            CRYPTOGRAPHIC HASH: {record.cryptoSignatureHash}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={handlePrint} className="btn-secondary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={16} /> Print Certificate
          </button>
          <button onClick={onClose} className="btn-primary" style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}>
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
