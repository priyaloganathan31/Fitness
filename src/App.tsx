import React, { useState, useEffect } from 'react';
import type { CampusVenue, QuestionTemplate, CampusAuditRecord, UserRole, AuditAssignment, AuditAssignmentStatus } from './types/audit';
import { ADMIN_PROFILE, DEMO_AUDITORS } from './types/audit';
import { ALL_56_CAMPUS_VENUES } from './data/locationRegistry';
import { loadAssignments, saveAssignments, loadQuestionBank, saveQuestionBank, loadAuditRecords, saveAuditRecords, loadActiveAuditorId, saveActiveAuditorId, loadVenues, saveVenues, loadAuditors, saveAuditors } from './utils/storage';
import { fetchVenuesApi, fetchTemplatesApi, fetchAssignmentsApi, fetchRecordsApi, fetchAuditorsApi } from './utils/api';
import { SmartAuditLogin } from './components/SmartAuditLogin';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import { AuditorDashboard } from './components/AuditorDashboard';
import { GeoFenceAuditGate } from './components/GeoFenceAuditGate';
import { ActiveAuditSession } from './components/ActiveAuditSession';
import { PreAuditTemplateOverview } from './components/PreAuditTemplateOverview';
import { AuthenticityRankingScorecard } from './components/AuthenticityRankingScorecard';
import { LocationRegistryManager } from './components/LocationRegistryManager';
import { TaskAssignmentEmailDemo } from './components/TaskAssignmentEmailDemo';
import { FitnessCertificateModal } from './components/FitnessCertificateModal';
import { ArrowLeft } from 'lucide-react';

export const App: React.FC = () => {
  const [venues, setVenues] = useState<CampusVenue[]>(() => loadVenues());
  const [auditors, setAuditors] = useState<UserRole[]>(() => loadAuditors());
  
  // Login Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Persistent localStorage Reactive States
  const [templates, setTemplates] = useState<QuestionTemplate[]>(() => loadQuestionBank());
  const [assignments, setAssignments] = useState<AuditAssignment[]>(() => loadAssignments());
  const [records, setRecords] = useState<CampusAuditRecord[]>(() => loadAuditRecords());

  const [activeTab, setActiveTab] = useState<string>('admin-dashboard');
  const [activeRole, setActiveRole] = useState<UserRole>(ADMIN_PROFILE);
  const [activeAuditor, setActiveAuditor] = useState<UserRole>(() => {
    const savedId = loadActiveAuditorId();
    return auditors.find(a => a.id === savedId) || auditors[0] || DEMO_AUDITORS[0];
  });
  
  // Interactive Audit Session State
  const [activeVenue, setActiveVenue] = useState<CampusVenue>(() => venues[0] || ALL_56_CAMPUS_VENUES[0]);
  const [activeVenueTemplate, setActiveVenueTemplate] = useState<QuestionTemplate>(() => templates[0]);
  const [auditStep, setAuditStep] = useState<'OVERVIEW' | 'GEOFENCE' | 'SESSION'>('OVERVIEW');
  const [verifiedGps, setVerifiedGps] = useState<{ lat: number; lng: number }>({ lat: 11.493954, lng: 77.274503 });
  const [verifiedDistance, setVerifiedDistance] = useState<number>(2.1);
  
  const [selectedRecord, setSelectedRecord] = useState<CampusAuditRecord | null>(records[0] || null);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);

  // Hydrate from MongoDB Backend if available
  useEffect(() => {
    const hydrateFromMongoDB = async () => {
      const dbVenues = await fetchVenuesApi();
      if (dbVenues && dbVenues.length > 0) setVenues(dbVenues);

      const dbTemplates = await fetchTemplatesApi();
      if (dbTemplates && dbTemplates.length > 0) setTemplates(dbTemplates);

      const dbAssignments = await fetchAssignmentsApi();
      if (dbAssignments && dbAssignments.length > 0) setAssignments(dbAssignments);

      const dbRecords = await fetchRecordsApi();
      if (dbRecords && dbRecords.length > 0) setRecords(dbRecords);

      const dbAuditors = await fetchAuditorsApi();
      if (dbAuditors && dbAuditors.length > 0) setAuditors(dbAuditors);
    };
    hydrateFromMongoDB();
  }, []);

  // Sync state changes to localStorage & MongoDB API
  useEffect(() => {
    saveVenues(venues);
  }, [venues]);

  useEffect(() => {
    saveAuditors(auditors);
  }, [auditors]);

  useEffect(() => {
    saveAssignments(assignments);
  }, [assignments]);

  useEffect(() => {
    saveQuestionBank(templates);
  }, [templates]);

  useEffect(() => {
    saveAuditRecords(records);
  }, [records]);

  useEffect(() => {
    saveActiveAuditorId(activeAuditor.id);
  }, [activeAuditor]);

  const flaggedCount = records.filter(r => r.authenticity.overallScore < 85 || r.status === 'FLAGGED_REVIEW_REQUIRED').length;

  const handleStartVenueAudit = (venue: CampusVenue) => {
    setActiveVenue(venue);
    const resolvedTmpl = templates.find(t => t.id === venue.activeTemplateId) ||
                         templates.find(t => t.venueCategory === venue.category) ||
                         templates[0];
    setActiveVenueTemplate(resolvedTmpl);
    setAuditStep('OVERVIEW');
    setActiveTab('pilot-medical-center');
  };

  const handleGateUnlocked = (gps: { lat: number; lng: number }, distance: number) => {
    setVerifiedGps(gps);
    setVerifiedDistance(distance);
    setAuditStep('SESSION');
  };

  const handleCreateAssignment = (newAsg: AuditAssignment) => {
    setAssignments(prev => [newAsg, ...prev]);
  };

  const handleAddTemplateToBank = (newTmpl: QuestionTemplate) => {
    setTemplates(prev => [newTmpl, ...prev]);
  };

  const handleCompleteAuditAssignment = (asg: AuditAssignment, newRecord: CampusAuditRecord) => {
    setRecords(prev => [newRecord, ...prev]);
    setSelectedRecord(newRecord);

    const isAutoApproved = newRecord.authenticity.overallScore >= 85;
    const finalStatus: AuditAssignmentStatus = isAutoApproved ? 'Completed (Auto-Approved)' : 'Pending Admin Review';

    // Update assignment status
    setAssignments(prev => prev.map(a => {
      if (a.id === asg.id) {
        return {
          ...a,
          status: finalStatus,
          progressPercentage: 100,
          recordId: newRecord.id
        };
      }
      return a;
    }));

    if (isAutoApproved) {
      setShowCertModal(true);
    } else {
      alert(`⚠️ Audit Submitted with Score ${newRecord.authenticity.overallScore}%. Status: Pending Admin Review. Submitted to Admin Dashboard for review!`);
    }
  };

  const handleCompleteAuditSession = (newRecord: CampusAuditRecord) => {
    setRecords(prev => [newRecord, ...prev]);
    setSelectedRecord(newRecord);

    if (newRecord.authenticity.isSelfApproved) {
      setShowCertModal(true);
    }
    
    if (activeRole.roleType === 'ADMIN') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('auditor-portal');
    }
  };

  const handleLoginSuccess = (role: UserRole, targetTab: 'admin-dashboard' | 'auditor-portal') => {
    setActiveRole(role);
    if (role.roleType === 'AUDITOR') {
      setActiveAuditor(role);
    }
    setActiveTab(targetTab);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <SmartAuditLogin
        auditors={auditors}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  const handleUpdateAssignmentStatus = (assignmentId: string, newStatus: AuditAssignment['status'], notes?: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === assignmentId) {
        return {
          ...a,
          status: newStatus,
          notes: notes ? `${a.notes || ''} | ${notes}` : a.notes
        };
      }
      return a;
    }));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#090D16', color: '#F8FAFC' }}>
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        flaggedReviewCount={flaggedCount}
        onSignOut={() => setIsAuthenticated(false)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '16px 24px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
          
          {/* Admin Dashboard View */}
          {activeRole.roleType === 'ADMIN' && activeTab !== 'location-registry' && activeTab !== 'email-notification-demo' && activeTab !== 'view-scorecard' && (
            <AdminDashboard
              venues={venues}
              templates={templates}
              assignments={assignments}
              records={records}
              auditors={auditors}
              onAddAuditor={(aud) => setAuditors(prev => [...prev, aud])}
              onUpdateAuditor={(updated) => setAuditors(prev => prev.map(a => a.id === updated.id ? updated : a))}
              onAddVenue={(v) => setVenues(prev => [...prev, v])}
              onCreateAssignment={handleCreateAssignment}
              onAddTemplateToBank={handleAddTemplateToBank}
              onNavigateToTab={setActiveTab}
              onSelectRecord={(rec) => {
                setSelectedRecord(rec);
                setActiveTab('view-scorecard');
              }}
              onViewCertificate={(rec) => {
                setSelectedRecord(rec);
                setShowCertModal(true);
              }}
            />
          )}

          {/* Auditor Portal View */}
          {activeRole.roleType === 'AUDITOR' && activeTab !== 'pilot-medical-center' && activeTab !== 'view-scorecard' && (
            <AuditorDashboard
              activeAuditor={activeAuditor}
              onSwitchAuditorProfile={setActiveAuditor}
              auditors={auditors}
              assignments={assignments}
              records={records}
              templates={templates}
              venues={venues}
              onUpdateAssignmentStatus={handleUpdateAssignmentStatus}
              onCompleteAuditAssignment={handleCompleteAuditAssignment}
              onViewCertificate={(rec) => {
                setSelectedRecord(rec);
                setShowCertModal(true);
              }}
            />
          )}

          {/* Active Audit Gate & Execution */}
          {activeTab === 'pilot-medical-center' && (() => {
            if (auditStep === 'OVERVIEW') {
              return (
                <PreAuditTemplateOverview
                  venue={activeVenue}
                  activeRole={activeRole}
                  templates={templates}
                  selectedTemplate={activeVenueTemplate}
                  onSelectTemplate={(tmpl) => setActiveVenueTemplate(tmpl)}
                  onProceedToGeoFence={() => setAuditStep('GEOFENCE')}
                  onBack={() => setActiveTab(activeRole.roleType === 'ADMIN' ? 'admin-dashboard' : 'auditor-portal')}
                />
              );
            }

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    onClick={() => setAuditStep('OVERVIEW')}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ArrowLeft size={16} /> Back to Checklist Overview
                  </button>

                  <div style={{ fontSize: '0.82rem', color: '#60A5FA', fontWeight: 700 }}>
                    Target: <strong style={{ color: '#F8FAFC' }}>{activeVenue.name} ({activeVenue.code})</strong>
                  </div>
                </div>

                {auditStep === 'GEOFENCE' ? (
                  <GeoFenceAuditGate
                    venue={activeVenue}
                    activeRole={activeRole}
                    onUnlockSuccess={(gps, dist) => {
                      handleGateUnlocked(gps, dist);
                      setAuditStep('SESSION');
                    }}
                  />
                ) : (
                  <ActiveAuditSession
                    venue={activeVenue}
                    template={activeVenueTemplate}
                    verifiedGps={verifiedGps}
                    gpsDistanceMeters={verifiedDistance}
                    auditorName={activeAuditor.name}
                    auditeeName="Campus Inspector"
                    onCompleteAudit={(record) => {
                      handleCompleteAuditSession(record);
                      setAuditStep('OVERVIEW');
                    }}
                  />
                )}
              </div>
            );
          })()}

          {/* Question Templates Manager */}
          {activeTab === 'template-manager' && (
            <AdminDashboard
              venues={venues}
              templates={templates}
              assignments={assignments}
              records={records}
              onCreateAssignment={handleCreateAssignment}
              onAddTemplateToBank={handleAddTemplateToBank}
              onNavigateToTab={setActiveTab}
              onSelectRecord={(rec) => {
                setSelectedRecord(rec);
                setActiveTab('view-scorecard');
              }}
              onViewCertificate={(rec) => {
                setSelectedRecord(rec);
                setShowCertModal(true);
              }}
            />
          )}

          {/* Campus Venues Registry */}
          {activeTab === '56-venues-registry' && (
            <LocationRegistryManager
              venues={venues}
              onSelectVenueForAudit={handleStartVenueAudit}
              onAddVenue={(newV) => setVenues(prev => [...prev, newV])}
            />
          )}

          {/* Task Email Dispatcher */}
          {activeTab === 'task-email-dispatch' && (
            <TaskAssignmentEmailDemo
              venues={venues}
              activeRole={activeRole}
              setActiveRole={setActiveRole}
              onLaunchAuditForVenue={handleStartVenueAudit}
            />
          )}

          {/* View Scorecard */}
          {activeTab === 'view-scorecard' && selectedRecord && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <button
                onClick={() => setActiveTab(activeRole.roleType === 'ADMIN' ? 'admin-dashboard' : 'auditor-portal')}
                className="btn-secondary"
                style={{ width: 'fit-content', padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={16} /> Back to Dashboard
              </button>

              <AuthenticityRankingScorecard
                record={selectedRecord}
                onViewCertificate={() => setShowCertModal(true)}
                onScheduleReview={() => alert(`Re-inspection ticket generated for ${selectedRecord.venueName}. Auditor notified.`)}
              />
            </div>
          )}

        </main>

        {/* Fitness Certificate Modal */}
        {showCertModal && selectedRecord && (
          <FitnessCertificateModal
            record={selectedRecord}
            onClose={() => setShowCertModal(false)}
          />
        )}

      </div>
  );
};
