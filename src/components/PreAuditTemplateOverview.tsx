import React, { useState } from 'react';
import type { CampusVenue, QuestionTemplate, AuditAssignment, UserRole } from '../types/audit';
import { 
  FileText, MapPin, Search, ArrowRight, ArrowLeft, Sparkles
} from 'lucide-react';

interface PreAuditTemplateOverviewProps {
  venue: CampusVenue;
  assignment?: AuditAssignment | null;
  activeRole: UserRole;
  templates: QuestionTemplate[];
  selectedTemplate: QuestionTemplate;
  onSelectTemplate: (tmpl: QuestionTemplate) => void;
  onProceedToGeoFence: () => void;
  onBack: () => void;
}

export const PreAuditTemplateOverview: React.FC<PreAuditTemplateOverviewProps> = ({
  venue,
  assignment,
  templates,
  selectedTemplate,
  onSelectTemplate,
  onProceedToGeoFence,
  onBack
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeSectionFilter, setActiveSectionFilter] = useState<string>('ALL');

  // Extract unique sections in the current template
  const questions = selectedTemplate.questions || [];
  const sections = Array.from(new Set(questions.map(q => q.section || 'General Checkpoints')));

  // Filter questions based on search & active section filter
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = 
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.description && q.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      q.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSection = activeSectionFilter === 'ALL' || q.section === activeSectionFilter;

    return matchesSearch && matchesSection;
  });

  const mandatoryCount = questions.filter(q => q.isMandatory).length;
  const highRiskCount = questions.filter(q => q.priority === 'HIGH').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={onBack}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>
            Audit Preparation Phase
          </span>
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3B82F6', color: '#60A5FA', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> Step 1 of 3: Predefined Question Verification
          </div>
        </div>
      </div>

      {/* Target Location & Assignment Summary Banner */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '10px' }}>
              <MapPin size={14} /> TARGET LOCATION VERIFIED
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F8FAFC' }}>
              {venue.name} <span style={{ fontSize: '1rem', color: '#94A3B8', fontWeight: 600 }}>({venue.code})</span>
            </h2>

            <p style={{ fontSize: '0.86rem', color: '#CBD5E1', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏢 Building: <strong>{venue.building}</strong></span>
              <span>•</span>
              <span>🏷️ Category: <strong style={{ color: '#60A5FA' }}>{venue.category}</strong></span>
            </p>

            {assignment && (
              <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', fontSize: '0.82rem', color: '#93C5FD' }}>
                📌 <strong>Assigned Task Title:</strong> {assignment.title}
                {assignment.specialInstructions && (
                  <div style={{ marginTop: '4px', fontSize: '0.78rem', color: '#CBD5E1' }}>
                    💡 <em>Instructions: {assignment.specialInstructions}</em>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '14px 18px', textAlign: 'center', minWidth: '110px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38BDF8' }}>{questions.length}</div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Checkpoints</div>
            </div>

            <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '14px 18px', textAlign: 'center', minWidth: '110px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#F59E0B' }}>{mandatoryCount}</div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Mandatory</div>
            </div>

            <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '14px 18px', textAlign: 'center', minWidth: '110px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#EF4444' }}>{highRiskCount}</div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>High Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Audit Template Selector & Summary Header */}
      <div className="glass-panel" style={{ padding: '20px 24px', borderRadius: '16px', background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#60A5FA', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', textTransform: 'uppercase' }}>
              <FileText size={14} /> Selected Predefined Audit Checklist Template:
            </label>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F8FAFC' }}>
              {selectedTemplate.title}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '2px' }}>
              {selectedTemplate.description}
            </p>
          </div>

          {/* Template Switcher Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>
              Change Template for this session:
            </label>
            <select
              value={selectedTemplate.id}
              onChange={(e) => {
                const found = templates.find(t => t.id === e.target.value);
                if (found) onSelectTemplate(found);
              }}
              style={{
                background: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid #3B82F6',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {templates.map(tmpl => (
                <option key={tmpl.id} value={tmpl.id}>
                  📋 {tmpl.title} ({tmpl.questions.length} Questions)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search & Section Category Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            
            {/* Search input */}
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="text"
                placeholder="Search predefined questions in this template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1E293B',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '9px 12px 9px 36px',
                  color: '#F8FAFC',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
              Showing {filteredQuestions.length} of {questions.length} questions
            </div>
          </div>

          {/* Section Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button
              onClick={() => setActiveSectionFilter('ALL')}
              style={{
                background: activeSectionFilter === 'ALL' ? '#3B82F6' : '#1E293B',
                color: activeSectionFilter === 'ALL' ? '#FFFFFF' : '#94A3B8',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              All Sections ({questions.length})
            </button>
            {sections.map(sec => {
              const secCount = questions.filter(q => q.section === sec).length;
              const isSelected = activeSectionFilter === sec;
              return (
                <button
                  key={sec}
                  onClick={() => setActiveSectionFilter(sec)}
                  style={{
                    background: isSelected ? '#3B82F6' : '#1E293B',
                    color: isSelected ? '#FFFFFF' : '#94A3B8',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {sec} ({secCount})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Predefined Questions Checklist ({filteredQuestions.length})
        </h4>

        {filteredQuestions.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', background: '#0F172A', borderRadius: '12px', color: '#64748B' }}>
            No predefined questions found matching "{searchTerm}".
          </div>
        ) : (
          filteredQuestions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="glass-panel"
              style={{
                padding: '16px 20px',
                borderRadius: '12px',
                background: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start'
              }}
            >
              {/* Question Number Badge */}
              <div style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.3)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900, flexShrink: 0 }}>
                {idx + 1}
              </div>

              {/* Question Detail */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#A7F3D0', background: 'rgba(6, 78, 59, 0.5)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    {q.section || 'General'}
                  </span>

                  {q.isMandatory && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#F87171', background: 'rgba(153, 27, 27, 0.4)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                      MANDATORY
                    </span>
                  )}

                  {q.requiresPhotoIfNo && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#FBBF24', background: 'rgba(146, 64, 14, 0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                      📸 Photo Proof if NO
                    </span>
                  )}

                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    marginLeft: 'auto',
                    color: q.priority === 'HIGH' ? '#FCA5A5' : q.priority === 'MEDIUM' ? '#FDE68A' : '#93C5FD',
                    background: q.priority === 'HIGH' ? 'rgba(185, 28, 28, 0.3)' : q.priority === 'MEDIUM' ? 'rgba(180, 83, 9, 0.3)' : 'rgba(30, 58, 138, 0.3)'
                  }}>
                    {q.priority || 'MEDIUM'} RISK
                  </span>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '4px', lineHeight: 1.4 }}>
                  {q.questionText}
                </h4>

                {q.description && (
                  <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '2px' }}>
                    {q.description}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Sticky Action Footer */}
      <div className="glass-panel" style={{ padding: '18px 24px', borderRadius: '16px', background: 'linear-gradient(90deg, #1E293B 0%, #0F172A 100%)', border: '1px solid #3B82F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '12px' }}>
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#F8FAFC' }}>
            Ready to perform on-ground audit verification?
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
            Next step: Geo-Fence Verification & Live QR Code Scan at <strong>{venue.name}</strong>.
          </div>
        </div>

        <button
          onClick={onProceedToGeoFence}
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: '0.95rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', border: 'none', borderRadius: '10px', color: '#FFFFFF', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}
        >
          <span>Confirm Checklist & Proceed to Geo-Fence</span>
          <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
};
