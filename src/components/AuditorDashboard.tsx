import React, { useState } from 'react';
import type { CampusVenue, CampusAuditRecord, AuditAssignment, UserRole, QuestionTemplate } from '../types/audit';
import { DEMO_AUDITORS } from '../types/audit';
import { GeoFenceAuditGate } from './GeoFenceAuditGate';
import { ActiveAuditSession } from './ActiveAuditSession';
import { PreAuditTemplateOverview } from './PreAuditTemplateOverview';
import { Play, Award, Clock, ArrowLeft, CheckCircle2, Building2, MapPin, ShieldCheck, Menu, X, Calendar, Download, ExternalLink } from 'lucide-react';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';

interface AuditorDashboardProps {
  activeAuditor: UserRole;
  onSwitchAuditorProfile: (auditor: UserRole) => void;
  auditors?: UserRole[];
  assignments: AuditAssignment[];
  records: CampusAuditRecord[];
  templates: QuestionTemplate[];
  venues: CampusVenue[];
  onUpdateAssignmentStatus?: (assignmentId: string, status: AuditAssignment['status'], notes?: string) => void;
  onCompleteAuditAssignment: (assignment: AuditAssignment, record: CampusAuditRecord) => void;
  onViewCertificate: (record: CampusAuditRecord) => void;
}

export const AuditorDashboard: React.FC<AuditorDashboardProps> = ({
  activeAuditor,
  onSwitchAuditorProfile,
  auditors = DEMO_AUDITORS,
  assignments,
  records,
  templates,
  venues,
  onUpdateAssignmentStatus,
  onCompleteAuditAssignment,
  onViewCertificate
}) => {
  const [auditorSubTab, setAuditorSubTab] = useState<'assigned' | 'completed' | 'venues'>('assigned');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [auditorSubTab]);
  const [activeExecutingAssignment, setActiveExecutingAssignment] = useState<AuditAssignment | null>(null);
  const [selectedTemplateForAudit, setSelectedTemplateForAudit] = useState<QuestionTemplate | null>(null);
  const [auditExecutionStep, setAuditExecutionStep] = useState<'GEOFENCE' | 'SESSION' | 'OVERVIEW'>('GEOFENCE');
  const [viewAllTasksMode, setViewAllTasksMode] = useState<boolean>(false);

  // Geo-Fence & Active Audit Session Gate State
  const [verifiedGps, setVerifiedGps] = useState<{ lat: number; lng: number }>({ lat: 13.01025, lng: 80.23549 });
  const [verifiedDistance, setVerifiedDistance] = useState<number>(2.1);

  const allAuditors = auditors.length > 0 ? auditors : DEMO_AUDITORS;

  // Filter assignments for active auditor (or view all if toggled)
  const myAssignments = (assignments || []).filter(a => {
    if (!a) return false;
    if (viewAllTasksMode) return true;
    const audIdMatch = a.auditorId === activeAuditor?.id;
    const nameMatch = Boolean(
      a.auditorName && activeAuditor?.name && (
        a.auditorName.toLowerCase().includes(activeAuditor.name.toLowerCase()) ||
        activeAuditor.name.toLowerCase().includes(a.auditorName.toLowerCase()) ||
        (activeAuditor.email && a.auditorName.toLowerCase().includes(activeAuditor.email.toLowerCase()))
      )
    );
    return audIdMatch || nameMatch;
  });

  const pendingAssignments = myAssignments.filter(a => a && (a.status === 'Assigned' || a.status === 'In Progress' || a.status === 'Accepted' || a.status === 'Re-Audit Requested' || a.status === 'Pending Admin Review'));
  const completedAssignments = myAssignments.filter(a => a && (a.status === 'Completed' || a.status === 'Completed (Auto-Approved)' || a.status === 'Approved by Admin' || a.status === 'Under Review'));

  const myPassedRecords = (records || []).filter(r => r && (viewAllTasksMode || (r.auditorName && activeAuditor?.name && r.auditorName.toLowerCase().includes(activeAuditor.name.toLowerCase()))));

  const handleStartAuditExecution = (asg: AuditAssignment) => {
    setActiveExecutingAssignment(asg);
    // Resolve matching template by templateId or category
    const venueObj = venues.find(v => v.id === asg.venueId || v.code === asg.venueCode) || venues[0];
    const tmpl = templates.find(t => t.id === asg.templateId) || 
                 templates.find(t => t.venueCategory === venueObj.category) || 
                 templates[0];
    setSelectedTemplateForAudit(tmpl);
    setAuditExecutionStep('GEOFENCE');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Auditor Context Switcher & Welcome Banner */}
      <div className="glass-panel" style={{ padding: '24px 28px', borderRadius: '16px', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '8px' }}>
              <span>🔍 CERTIFIED ON-GROUND AUDITOR PORTAL</span>
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF' }}>
              Welcome back, {activeAuditor.name}
            </h1>

            <p style={{ fontSize: '0.86rem', color: '#E2E8F0', marginTop: '4px' }}>
              {activeAuditor.title} ({activeAuditor.email})
            </p>
          </div>

          {/* AUDITOR CONTEXT SWITCHER DROPDOWN */}
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#A7F3D0', display: 'block', marginBottom: '4px' }}>
              👤 Switch Active Auditor Context:
            </label>
            <select
              value={activeAuditor.id}
              onChange={(e) => {
                const found = allAuditors.find(a => a.id === e.target.value);
                if (found) onSwitchAuditorProfile(found);
              }}
              style={{ background: '#064E3B', color: '#FFFFFF', border: '1px solid #10B981', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}
            >
              {allAuditors.map(auditor => (
                <option key={auditor.id} value={auditor.id}>
                  {auditor.name} ({auditor.email})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* IF AN AUDIT EXECUTION IS ACTIVE, RUN STEP 1 (PRE-AUDIT OVERVIEW), STEP 2 (GEOFENCE GATE), STEP 3 (ACTIVE AUDIT SESSION) */}
      {activeExecutingAssignment ? (() => {
        const activeVenueObj = venues.find(v => v.id === activeExecutingAssignment.venueId || v.code === activeExecutingAssignment.venueCode) || venues[0];
        const activeTemplateObj = selectedTemplateForAudit || templates.find(t => t.id === activeExecutingAssignment.templateId) || templates[0];

        if (auditExecutionStep === 'OVERVIEW') {
          return (
            <PreAuditTemplateOverview
              venue={activeVenueObj}
              assignment={activeExecutingAssignment}
              activeRole={activeAuditor}
              templates={templates}
              selectedTemplate={activeTemplateObj}
              onSelectTemplate={(tmpl) => setSelectedTemplateForAudit(tmpl)}
              onProceedToGeoFence={() => setAuditExecutionStep('GEOFENCE')}
              onBack={() => setActiveExecutingAssignment(null)}
            />
          );
        }

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Visual Process Stepper Header */}
            <div className="glass-panel" style={{ padding: '14px 20px', borderRadius: '12px', background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34D399', background: 'rgba(16, 185, 129, 0.2)', padding: '3px 8px', borderRadius: '4px' }}>
                  ✓ 1. Accept Audit
                </span>
                <span style={{ color: '#64748B' }}>→</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34D399', background: 'rgba(16, 185, 129, 0.2)', padding: '3px 8px', borderRadius: '4px' }}>
                  ✓ 2. Do Audit
                </span>
                <span style={{ color: '#64748B' }}>→</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: auditExecutionStep === 'GEOFENCE' ? '#60A5FA' : '#34D399', background: auditExecutionStep === 'GEOFENCE' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(16, 185, 129, 0.2)', border: auditExecutionStep === 'GEOFENCE' ? '1px solid #3B82F6' : 'none', padding: '3px 8px', borderRadius: '4px' }}>
                  {auditExecutionStep === 'GEOFENCE' ? '⚡ 3. Geo Location Verification' : '✓ 3. Geo Location Verified'}
                </span>
                <span style={{ color: '#64748B' }}>→</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: auditExecutionStep === 'SESSION' ? '#60A5FA' : '#94A3B8', background: auditExecutionStep === 'SESSION' ? 'rgba(59, 130, 246, 0.25)' : '#1E293B', padding: '3px 8px', borderRadius: '4px' }}>
                  4. Audit Questions (YES/NO)
                </span>
                <span style={{ color: '#64748B' }}>→</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', background: '#1E293B', padding: '3px 8px', borderRadius: '4px' }}>
                  5. AI Verification
                </span>
                <span style={{ color: '#64748B' }}>→</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', background: '#1E293B', padding: '3px 8px', borderRadius: '4px' }}>
                  6. Submit Audit
                </span>
                <span style={{ color: '#64748B' }}>→</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', background: '#1E293B', padding: '3px 8px', borderRadius: '4px' }}>
                  7. Certificate / Admin Approval
                </span>
              </div>

              <button
                onClick={() => setActiveExecutingAssignment(null)}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={14} /> Exit Audit Session
              </button>
            </div>

            {auditExecutionStep === 'GEOFENCE' ? (
              <GeoFenceAuditGate
                venue={activeVenueObj}
                activeRole={activeAuditor}
                onUnlockSuccess={(gps, dist) => {
                  setVerifiedGps(gps);
                  setVerifiedDistance(dist);
                  setAuditExecutionStep('SESSION');
                }}
              />
            ) : (
              <ActiveAuditSession
                venue={activeVenueObj}
                template={activeTemplateObj}
                verifiedGps={verifiedGps}
                gpsDistanceMeters={verifiedDistance}
                auditorName={activeAuditor.name}
                auditeeName="Campus Inspector"
                onCompleteAudit={(newRecord) => {
                  onCompleteAuditAssignment(activeExecutingAssignment, newRecord);
                  setActiveExecutingAssignment(null);
                  setAuditExecutionStep('OVERVIEW');
                }}
              />
            )}
          </div>
        );
      })() : (
        /* AUDITOR ASSIGNED DASHBOARD VIEW */
        <div style={{ display: 'flex', gap: '24px', minHeight: 'calc(100vh - 120px)', flexWrap: 'wrap' }}>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ padding: '10px 16px', background: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 800, alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />} {isSidebarOpen ? 'Close Menu' : 'Open Auditor Menu'}
          </button>

          {/* Modern Left Sidebar Navigation for Auditor */}
          <aside className={`dashboard-sidebar ${isSidebarOpen ? 'mobile-open' : ''}`} style={{
            width: '240px',
            background: '#0F172A',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexShrink: 0,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ padding: '8px 12px', fontSize: '0.72rem', fontWeight: 900, color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                Auditor Navigation
              </div>

              <button
                onClick={() => setAuditorSubTab('assigned')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  background: auditorSubTab === 'assigned' ? '#059669' : 'transparent',
                  color: auditorSubTab === 'assigned' ? '#FFFFFF' : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={18} /> Assigned Audits
                </div>
                <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                  {pendingAssignments.length}
                </span>
              </button>

              <button
                onClick={() => setAuditorSubTab('completed')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  background: auditorSubTab === 'completed' ? '#059669' : 'transparent',
                  color: auditorSubTab === 'completed' ? '#FFFFFF' : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Award size={18} /> Completed Audits
                </div>
                <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.25)', color: '#34D399', padding: '2px 6px', borderRadius: '4px' }}>
                  {completedAssignments.length}
                </span>
              </button>

              <button
                onClick={() => setAuditorSubTab('venues')}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  background: auditorSubTab === 'venues' ? '#059669' : 'transparent',
                  color: auditorSubTab === 'venues' ? '#FFFFFF' : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Building2 size={18} /> Campus Venues
                </div>
                <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                  {venues.length}
                </span>
              </button>
            </div>

            {/* Auditor Context Switcher & Profile Card at Sidebar Bottom */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#A7F3D0' }}>
                👤 Switch Active Auditor Context:
              </label>
              <select
                value={activeAuditor.id}
                onChange={(e) => {
                  const found = allAuditors.find(a => a.id === e.target.value);
                  if (found) onSwitchAuditorProfile(found);
                }}
                style={{ background: '#064E3B', color: '#FFFFFF', border: '1px solid #10B981', padding: '8px 12px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', width: '100%' }}
              >
                {allAuditors.map(auditor => (
                  <option key={auditor.id} value={auditor.id}>
                    {auditor.name} ({auditor.email})
                  </option>
                ))}
              </select>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <img src={activeAuditor.avatar} alt={activeAuditor.name} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #10B981', objectFit: 'cover' }} />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {activeAuditor.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#34D399' }}>
                    Certified Auditor
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Right Workspace Panel */}
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
            
            {/* Workspace Action Header Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '20px 24px', borderRadius: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                  {auditorSubTab === 'assigned' && 'Assigned Audit Tasks'}
                  {auditorSubTab === 'completed' && 'Completed Audits & Fitness Certificates'}
                  {auditorSubTab === 'venues' && 'Campus Buildings & Facilities'}
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: 0, marginTop: '4px' }}>
                  {auditorSubTab === 'assigned' && (viewAllTasksMode ? 'Viewing all assigned campus audits across all auditors.' : `Audits assigned by Administration to ${activeAuditor.name}.`)}
                  {auditorSubTab === 'completed' && `Review verified audit completion scorecards and print Fitness Certificates.`}
                  {auditorSubTab === 'venues' && `Explore registered campus venues and launch on-ground GPS geo-fenced audits.`}
                </p>
              </div>

              {auditorSubTab === 'assigned' && (
                <button
                  type="button"
                  onClick={() => setViewAllTasksMode(!viewAllTasksMode)}
                  style={{
                    background: viewAllTasksMode ? '#2563EB' : '#1E293B',
                    color: viewAllTasksMode ? '#FFFFFF' : '#CBD5E1',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '9px 16px',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {viewAllTasksMode ? '🌐 Showing All Tasks (Click to Filter)' : `👤 Filtered to ${activeAuditor.name} (Show All)`}
                </button>
              )}
            </div>

            {/* TAB 1: ASSIGNED AUDITS QUEUE */}
            {auditorSubTab === 'assigned' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pendingAssignments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#64748B', background: '#F8FAFC', borderRadius: '8px' }}>
                  🎉 No pending audit tasks assigned to {activeAuditor.name} right now! Switch context or wait for Admin assignment.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
                  {pendingAssignments.map(asg => (
                    <div
                      key={asg.id}
                      style={{
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563EB', background: '#EFF6FF', padding: '3px 8px', borderRadius: '4px' }}>
                            {asg.id}
                          </span>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: asg.priority === 'HIGH' ? '#FEE2E2' : '#FEF3C7',
                            color: asg.priority === 'HIGH' ? '#991B1B' : '#92400E'
                          }}>
                            {asg.priority} PRIORITY
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>
                          {asg.title}
                        </h4>

                        <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                          <div>📍 <strong>{asg.departmentSite}</strong> • Due: <strong style={{ color: '#DC2626' }}>{asg.dueDate}</strong></div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              title="Add to Google Calendar"
                              onClick={() => {
                                const url = getGoogleCalendarUrl({
                                  title: asg.title,
                                  description: asg.notes || 'Campus FC Audit Task',
                                  location: asg.departmentSite,
                                  dueDate: asg.dueDate,
                                  priority: asg.priority
                                });
                                window.open(url, '_blank');
                              }}
                              style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E40AF', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                            >
                              <Calendar size={11} /> Google Cal
                            </button>
                            <button
                              type="button"
                              title="Download .ics Calendar File"
                              onClick={() => {
                                downloadIcsFile({
                                  title: asg.title,
                                  description: asg.notes || 'Campus FC Audit Task',
                                  location: asg.departmentSite,
                                  dueDate: asg.dueDate,
                                  priority: asg.priority
                                });
                              }}
                              style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#F0FDF4', border: '1px solid #86EFAC', color: '#166534', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                            >
                              <Download size={11} /> .ICS
                            </button>
                          </div>
                        </div>

                        {asg.notes && (
                          <div style={{ fontSize: '0.78rem', background: '#FEF3C7', border: '1px solid #FCD34D', padding: '8px 12px', borderRadius: '6px', color: '#78350F', marginBottom: '14px' }}>
                            💡 <strong>Admin Note:</strong> {asg.notes}
                          </div>
                        )}
                      </div>

                        {/* Task Lifecycle Actions */}
                        {asg.status === 'Re-Audit Requested' && (
                          <div style={{ fontSize: '0.78rem', background: '#FEE2E2', border: '1px solid #FCA5A5', padding: '8px 12px', borderRadius: '6px', color: '#991B1B', marginBottom: '12px', fontWeight: 800 }}>
                            ⚠️ RE-AUDIT REQUESTED BY ADMIN: {asg.notes || 'Dissatisfied report details. Please re-inspect and re-verify proof.'}
                          </div>
                        )}

                        {asg.status === 'Assigned' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                            <button
                              onClick={() => {
                                if (onUpdateAssignmentStatus) {
                                  onUpdateAssignmentStatus(asg.id, 'Accepted');
                                } else {
                                  asg.status = 'Accepted';
                                }
                                handleStartAuditExecution({ ...asg, status: 'Accepted' });
                              }}
                              className="btn-primary"
                              style={{
                                padding: '10px',
                                fontSize: '0.84rem',
                                fontWeight: 900,
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              <CheckCircle2 size={16} /> Accept & Start Audit
                            </button>

                            <button
                              onClick={() => {
                                const reason = prompt('Please enter the reason for rejecting this audit task:');
                                if (reason !== null) {
                                  const rejNote = `❌ REJECTED BY AUDITOR: ${reason || 'No reason provided.'}`;
                                  if (onUpdateAssignmentStatus) {
                                    onUpdateAssignmentStatus(asg.id, 'Rejected', rejNote);
                                  } else {
                                    asg.status = 'Rejected';
                                    asg.notes = rejNote;
                                  }
                                }
                              }}
                              style={{
                                padding: '10px',
                                fontSize: '0.84rem',
                                fontWeight: 900,
                                borderRadius: '8px',
                                background: '#FEF2F2',
                                color: '#DC2626',
                                border: '1px solid #FCA5A5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              ❌ Reject Audit
                            </button>
                          </div>
                        )}

                        {asg.status === 'Rejected' && (
                          <div style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800, textAlign: 'center', marginTop: '12px' }}>
                            ❌ Audit Task Rejected by Auditor (Reflected on Admin Dashboard)
                          </div>
                        )}

                        {(asg.status === 'Accepted' || asg.status === 'In Progress' || asg.status === 'Re-Audit Requested') && (
                          <button
                            onClick={() => {
                              if (onUpdateAssignmentStatus && asg.status !== 'In Progress') {
                                onUpdateAssignmentStatus(asg.id, 'In Progress');
                              } else {
                                asg.status = 'In Progress';
                              }
                              handleStartAuditExecution({ ...asg, status: 'In Progress' });
                            }}
                            className="btn-primary"
                            style={{
                              width: '100%',
                              padding: '12px',
                              fontSize: '0.88rem',
                              fontWeight: 900,
                              borderRadius: '8px',
                              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              marginTop: '12px',
                              cursor: 'pointer',
                              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                            }}
                          >
                            <Play size={18} /> {asg.status === 'Re-Audit Requested' ? '🚀 Start Re-Audit Session' : '🚀 Start Audit (Geo-Fence Gate)'}
                          </button>
                        )}

                        {asg.status === 'Pending Admin Review' && (
                          <div style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800, textAlign: 'center', marginTop: '12px' }}>
                            ⏳ Pending Admin Review (Audit Score &lt; 85%) — Submitted to Admin
                          </div>
                        )}

                        {(asg.status === 'Completed (Auto-Approved)' || asg.status === 'Approved by Admin' || asg.status === 'Completed') && (
                          <button
                            onClick={() => {
                              const recordObj = records.find(r => r.id === asg.recordId || r.venueId === asg.venueId) || records[0];
                              if (recordObj) onViewCertificate(recordObj);
                            }}
                            className="btn-primary"
                            style={{
                              width: '100%',
                              padding: '12px',
                              fontSize: '0.88rem',
                              fontWeight: 900,
                              borderRadius: '8px',
                              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              marginTop: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            <Award size={18} /> 🏆 View Fitness Certificate ({asg.status})
                          </button>
                        )}

                        {asg.status === 'Rejected by Admin' && (
                          <div style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800, textAlign: 'center', marginTop: '12px' }}>
                            ❌ Audit Rejected by Admin
                          </div>
                        )}
                      </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub-Tab 2: Completed & Issued Certificates */}
          {auditorSubTab === 'completed' && (
            <div className="glass-panel" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="#059669" /> Completed Audits & Certificates ({myPassedRecords.length})
              </h3>

              {myPassedRecords.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                  No completed records for {activeAuditor.name} yet.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  {myPassedRecords.map(rec => (
                    <div
                      key={rec.id}
                      style={{
                        background: '#F0FDF4',
                        border: '1px solid #86EFAC',
                        borderRadius: '12px',
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#065F46', background: '#D1FAE5', padding: '3px 8px', borderRadius: '4px' }}>
                            CERTIFIED COMPLIANT
                          </span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#059669' }}>
                            Score: {rec.authenticity.overallScore}%
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A', marginBottom: '2px' }}>
                          {rec.venueName}
                        </h4>
                        <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginBottom: '10px' }}>
                          Cert #: {rec.certificateNumber}
                        </div>
                      </div>

                      <button
                        onClick={() => onViewCertificate(rec)}
                        className="btn-primary"
                        style={{
                          padding: '10px',
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          borderRadius: '8px',
                          background: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Award size={16} /> View Fitness Certificate
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        {/* Sub-Tab 3: Campus Venues */}
        {auditorSubTab === 'venues' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {venues.map(v => (
              <div key={v.id} style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34D399', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.3)', fontFamily: 'monospace' }}>
                      Code: {v.code}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700 }}>
                      {v.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', margin: 0, marginBottom: '6px' }}>
                    {v.name}
                  </h3>

                  <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: 0, marginBottom: '16px' }}>
                    📍 {v.building} • GPS Geofence: {v.geofenceRadiusMeters}m radius
                  </p>
                </div>

                <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <button
                    onClick={() => {
                      const asg: AuditAssignment = {
                        id: `ASG-ONGOING-${Date.now().toString().slice(-4)}`,
                        title: `${v.name} FC On-Demand Audit`,
                        departmentSite: `${v.name} (${v.code})`,
                        venueId: v.id,
                        venueName: v.name,
                        venueCode: v.code,
                        templateId: v.activeTemplateId,
                        templateTitle: `${v.name} Inspection Template`,
                        auditorId: activeAuditor.id,
                        auditorName: activeAuditor.name,
                        assignedByAdmin: 'On-Ground Auditor Request',
                        assignedDate: new Date().toISOString().split('T')[0],
                        dueDate: new Date().toISOString().split('T')[0],
                        status: 'Accepted',
                        priority: 'MEDIUM',
                        notes: 'On-ground facility audit initiated directly by certified auditor.',
                        progressPercentage: 0
                      };
                      handleStartAuditExecution(asg);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '0.86rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Play size={16} /> 🚀 Launch On-Ground GPS Audit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

    </div>
  )}

</div>
  );
};
