import React, { useState } from 'react';
import type { CampusVenue, QuestionTemplate, CampusAuditRecord, AuditAssignment, UserRole } from '../types/audit';
import { DEMO_AUDITORS, ADMIN_PROFILE } from '../types/audit';
import { readAndParseUploadedTemplate, convertParsedToQuestionTemplate } from '../utils/templateParser';
import type { TemplateParseResult } from '../utils/templateParser';
import { ShieldCheck, Plus, Upload, Search, CheckCircle2, Clock, UserCheck, Layers, AlertTriangle, Mail, Check, FileText, Sparkles, RefreshCw, X, UserPlus, Building2, LayoutDashboard, Edit3, Trash2, Menu, Calendar, CalendarDays, ExternalLink, Download } from 'lucide-react';
import { calculateDynamicDueDate, getGoogleCalendarUrl, getOutlookCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';

const AUDITOR_DESIGNATIONS = [
  'Assistant Professor - I',
  'Assistant Professor - II',
  'Assistant Professor - III',
  'Associate Professor',
  'Professor'
];

interface AdminDashboardProps {
  venues: CampusVenue[];
  templates: QuestionTemplate[];
  assignments: AuditAssignment[];
  records: CampusAuditRecord[];
  auditors?: UserRole[];
  onAddAuditor?: (newAuditor: UserRole) => void;
  onUpdateAuditor?: (updatedAuditor: UserRole) => void;
  onAddVenue?: (venue: CampusVenue) => void;
  onCreateAssignment: (assignment: AuditAssignment) => void;
  onAddTemplateToBank: (template: QuestionTemplate) => void;
  onNavigateToTab?: (tab: string) => void;
  onSelectRecord?: (record: CampusAuditRecord) => void;
  onViewCertificate: (record: CampusAuditRecord) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  venues,
  templates,
  assignments,
  records,
  auditors = DEMO_AUDITORS,
  onAddAuditor,
  onUpdateAuditor,
  onAddVenue,
  onCreateAssignment,
  onAddTemplateToBank,
  onViewCertificate
}) => {
  const [adminTab, setAdminTab] = useState<'venues' | 'assignments' | 'templates' | 'question_bank' | 'passed' | 'failed' | 'auditors'>('venues');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [adminTab]);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);

  // Add Auditor Modal State
  const [showAddAuditorModal, setShowAddAuditorModal] = useState<boolean>(false);
  const [newAuditorName, setNewAuditorName] = useState<string>('');
  const [newAuditorEmail, setNewAuditorEmail] = useState<string>('');
  const [newAuditorTitle, setNewAuditorTitle] = useState<string>('Assistant Professor - I');

  // Edit Auditor Modal State
  const [editingAuditor, setEditingAuditor] = useState<UserRole | null>(null);
  const [editAuditorName, setEditAuditorName] = useState<string>('');
  const [editAuditorEmail, setEditAuditorEmail] = useState<string>('');
  const [editAuditorTitle, setEditAuditorTitle] = useState<string>('Assistant Professor - I');

  // Add Venue Modal State
  const [showAddVenueModal, setShowAddVenueModal] = useState<boolean>(false);
  const [newVenueName, setNewVenueName] = useState<string>('');
  const [newVenueCode, setNewVenueCode] = useState<string>('');
  const [newVenueCategory, setNewVenueCategory] = useState<CampusVenue['category']>('Academic Buildings');
  const [newVenueBuilding, setNewVenueBuilding] = useState<string>('');
  const [newVenueLat, setNewVenueLat] = useState<number>(11.493954);
  const [newVenueLng, setNewVenueLng] = useState<number>(77.274503);

  // Re-Audit Request Modal State
  const [showReAuditModal, setShowReAuditModal] = useState<boolean>(false);
  const [reAuditTargetRecord, setReAuditTargetRecord] = useState<CampusAuditRecord | null>(null);
  const [reAuditReasonNotes, setReAuditReasonNotes] = useState<string>('Photos of equipment tags were blurry. Please re-inspect and re-upload clear proof.');

  // New Audit Assignment Form State
  const [selectedAssignVenueId, setSelectedAssignVenueId] = useState<string>(venues[0]?.id || 'FC-LOC-01');
  const [auditTitle, setAuditTitle] = useState<string>(venues[0] ? `${venues[0].name} FC Audit` : 'Campus Health & Medical Center Pilot FC Audit');
  const [departmentSite, setDepartmentSite] = useState<string>(venues[0] ? `${venues[0].name} (${venues[0].code})` : 'Campus Health & Medical Center (MED-CTR-01)');
  const [selectedAuditorId, setSelectedAuditorId] = useState<string>(auditors[0]?.id || 'auditor-priya');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [dueDate, setDueDate] = useState<string>(() => calculateDynamicDueDate(venues[0], 'HIGH'));
  const [notes, setNotes] = useState<string>('Verify emergency oxygen cylinder pressure, cold chain vaccine temperatures, and AED readiness.');

  const handleVenueSelectionChange = (vId: string) => {
    setSelectedAssignVenueId(vId);
    const targetVenue = venues.find(v => v.id === vId);
    if (targetVenue) {
      setDepartmentSite(`${targetVenue.name} (${targetVenue.code})`);
      setAuditTitle(`${targetVenue.name} FC Audit`);
      
      // Dynamic Due Date calculation based on selected venue & priority
      const computedDueDate = calculateDynamicDueDate(targetVenue, priority);
      setDueDate(computedDueDate);

      const matchingTmpl = templates.find(t => t.id === targetVenue.activeTemplateId) ||
                           templates.find(t => t.venueCategory === targetVenue.category) ||
                           templates.find(t => t.venueCode === targetVenue.code);
      if (matchingTmpl) {
        setSelectedTemplateId(matchingTmpl.id);
      }
    }
  };

  const handlePrioritySelectionChange = (newPriority: 'HIGH' | 'MEDIUM' | 'LOW') => {
    setPriority(newPriority);
    const targetVenue = venues.find(v => v.id === selectedAssignVenueId);
    const computedDueDate = calculateDynamicDueDate(targetVenue, newPriority);
    setDueDate(computedDueDate);
  };
  
  // Email Notification Modal State
  const [emailModalPayload, setEmailModalPayload] = useState<{
    assignment: AuditAssignment;
    sender: string;
    recipient: string;
    recipientEmail: string;
    sentTime: string;
  } | null>(null);

  // Multi-Format Template Upload State (PDF, DOCX, TXT, CSV)
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedUploadVenueId, setSelectedUploadVenueId] = useState<string>(venues[0]?.id || 'FC-LOC-01');
  const [parsedResult, setParsedResult] = useState<TemplateParseResult | null>(null);
  const [templateParseError, setTemplateParseError] = useState<string | null>(null);
  const [templateSuccessMsg, setTemplateSuccessMsg] = useState<string | null>(null);
  const [newTemplateTitle, setNewTemplateTitle] = useState<string>('Custom Venue Question Set');

  // Question Bank Search & Filter State
  const [bankSearchQuery, setBankSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  const passedRecords = records.filter(r => r.authenticity.overallScore >= 80 || r.status === 'PASSED_SELF_APPROVED');
  const failedRecords = records.filter(r => r.authenticity.overallScore < 80 || r.status === 'FLAGGED_REVIEW_REQUIRED');

  // Compute Workload Cards per Auditor
  const auditorWorkloads = (auditors || []).map(auditor => {
    if (!auditor) return { auditor: { id: 'demo', name: 'Auditor', avatar: '', title: '' }, total: 0, active: 0, completed: 0, status: 'Available' };
    const auditorAssigned = (assignments || []).filter(a => a && (a.auditorId === auditor.id || (a.auditorName && auditor.name && a.auditorName.toLowerCase().includes(auditor.name.toLowerCase()))));
    const activeCount = auditorAssigned.filter(a => a && (a.status === 'Assigned' || a.status === 'Accepted' || a.status === 'In Progress' || a.status === 'Re-Audit Requested')).length;
    const completedCount = auditorAssigned.filter(a => a && (a.status === 'Completed' || a.status === 'Completed (Auto-Approved)' || a.status === 'Approved by Admin' || a.status === 'Under Review')).length;
    return {
      auditor,
      total: auditorAssigned.length,
      active: activeCount,
      completed: completedCount,
      status: activeCount > 2 ? 'Heavy Load' : activeCount > 0 ? 'Optimal' : 'Available'
    };
  });

  const handleCreateAuditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuditorName.trim() || !newAuditorEmail.trim()) return;

    const newAuditorObj: UserRole = {
      id: `auditor-${Date.now()}`,
      roleType: 'AUDITOR',
      name: newAuditorName.trim(),
      email: newAuditorEmail.trim(),
      title: newAuditorTitle.trim() || 'Certified On-Ground Auditor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    };

    if (onAddAuditor) {
      onAddAuditor(newAuditorObj);
    }
    setShowAddAuditorModal(false);
    setNewAuditorName('');
    setNewAuditorEmail('');
    alert(`✅ Auditor details saved! ${newAuditorObj.name} (${newAuditorObj.email}) can now be assigned to audits.`);
  };

  const handleStartEditAuditor = (aud: UserRole) => {
    setEditingAuditor(aud);
    setEditAuditorName(aud.name);
    setEditAuditorEmail(aud.email);
    setEditAuditorTitle(aud.title || '');
  };

  const handleSaveEditAuditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuditor || !editAuditorName.trim() || !editAuditorEmail.trim()) return;

    const updated: UserRole = {
      ...editingAuditor,
      name: editAuditorName.trim(),
      email: editAuditorEmail.trim(),
      title: editAuditorTitle.trim() || 'Certified On-Ground Auditor'
    };

    if (onUpdateAuditor) {
      onUpdateAuditor(updated);
    } else if (onAddAuditor) {
      onAddAuditor(updated);
    }

    setEditingAuditor(null);
    alert(`✅ Auditor details updated for ${updated.name} (${updated.email})!`);
  };

  const handleCreateVenueInAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVenueName.trim() || !newVenueCode.trim()) return;

    const padId = String(venues.length + 1).padStart(2, '0');
    const created: CampusVenue = {
      id: `FC-LOC-${padId}`,
      code: newVenueCode.trim().toUpperCase(),
      name: newVenueName.trim(),
      category: newVenueCategory,
      building: newVenueBuilding.trim() || 'Campus Main Sector',
      geoCoordinates: { lat: Number(newVenueLat), lng: Number(newVenueLng) },
      geofenceRadiusMeters: 20,
      qrPayload: `QR-FC-${newVenueCode.trim().toUpperCase()}-SECURE-${newVenueLat}-${newVenueLng}`,
      assignedAuditor: 'Prof. Auditor Incharge',
      assignedAuditee: 'Department Facility Incharge',
      scheduleFrequencyDays: 15,
      lastAuditDate: new Date().toISOString().split('T')[0],
      nextAuditDueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'SCHEDULED',
      activeTemplateId: newVenueCategory === 'Media & Broadcasting' ? 'TMPL-BIT-FM-10' : 'TMPL-BIT-MED-24',
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
      totalCheckpoints: newVenueCategory === 'Media & Broadcasting' ? 10 : 24
    };

    if (onAddVenue) {
      onAddVenue(created);
    }
    setSelectedUploadVenueId(created.id);
    setShowAddVenueModal(false);
    setNewVenueName('');
    setNewVenueCode('');
    alert(`✅ New Venue Registered: ${created.name} (${created.code}). Reflected under 📍 Select Target Campus Venue!`);
  };

  const handleAssignReAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reAuditTargetRecord) return;

    const matchedAsg = assignments.find(a => a.recordId === reAuditTargetRecord.id || a.venueId === reAuditTargetRecord.venueId);
    if (matchedAsg) {
      matchedAsg.status = 'Re-Audit Requested';
      matchedAsg.notes = `🔄 RE-AUDIT REQUESTED BY ADMIN: ${reAuditReasonNotes}`;
    } else {
      const reAsg: AuditAssignment = {
        id: `ASG-RE-${Date.now().toString().slice(-4)}`,
        title: `Re-Audit: ${reAuditTargetRecord.venueName}`,
        departmentSite: `${reAuditTargetRecord.venueName} (${reAuditTargetRecord.venueCode})`,
        templateId: reAuditTargetRecord.templateId,
        templateTitle: 'Re-Audit Fitness Certificate Inspection',
        auditorId: auditors[0]?.id || 'auditor-priya',
        auditorName: reAuditTargetRecord.auditorName,
        assignedByAdmin: 'Prof. Sibi John (Admin)',
        assignedDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        status: 'Re-Audit Requested',
        priority: 'HIGH',
        notes: reAuditReasonNotes,
        progressPercentage: 0
      };
      onCreateAssignment(reAsg);
    }

    setShowReAuditModal(false);
    setReAuditTargetRecord(null);
    alert(`🔄 Re-Audit ticket assigned successfully! Auditor notified with admin feedback instructions.`);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = templates.find(tmp => tmp.id === selectedTemplateId) || templates[0];
    const auditor = auditors.find(a => a.id === selectedAuditorId) || auditors[0];

    const titleFinal = auditTitle.trim() || `Audit: ${t.title}`;
    const siteFinal = departmentSite.trim() || 'Campus Health & Medical Center (MED-CTR-01)';

    const newAssignment: AuditAssignment = {
      id: `ASG-2026-${Date.now().toString().slice(-4)}`,
      title: titleFinal,
      departmentSite: siteFinal,
      templateId: t.id,
      templateTitle: t.title,
      auditorId: auditor.id,
      auditorName: `${auditor.name} (${auditor.email})`,
      assignedByAdmin: 'Prof. Sibi John (sibi.john@bitsathy.ac.in)',
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate,
      status: 'Assigned',
      priority: priority,
      notes: notes,
      progressPercentage: 0
    };

    onCreateAssignment(newAssignment);
    setShowAssignModal(false);

    // Trigger Email Notification Popup Modal
    setEmailModalPayload({
      assignment: newAssignment,
      sender: 'Prof. Sibi John <sibi.john@bitsathy.ac.in>',
      recipient: auditor.name,
      recipientEmail: auditor.email,
      sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleProcessTemplateFile = async (file: File) => {
    setUploadedFile(file);
    setTemplateParseError(null);
    setTemplateSuccessMsg(null);

    const parseRes = await readAndParseUploadedTemplate(file);

    if (!parseRes.success) {
      setTemplateParseError(parseRes.error || 'Failed to parse uploaded document.');
      setParsedResult(null);
    } else {
      setParsedResult(parseRes);
      const targetV = venues.find(v => v.id === selectedUploadVenueId) || venues[0];
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      setNewTemplateTitle(`Fitness Certificate - ${targetV ? targetV.name : cleanName} Checklist`);
      setTemplateSuccessMsg(`✓ Extracted ${parseRes.totalQuestionsParsed} questions from ${file.name} and categorized them under the 6 Medical Center headers for ${targetV ? targetV.name : 'Selected Venue'}!`);
    }
  };

  const handleSaveTemplateToBank = () => {
    if (!parsedResult || parsedResult.questions.length === 0) return;
    const targetV = venues.find(v => v.id === selectedUploadVenueId) || venues[0];
    const newTemplate = convertParsedToQuestionTemplate(newTemplateTitle, targetV, parsedResult.questions);
    onAddTemplateToBank(newTemplate);

    setTemplateSuccessMsg(`🎉 Dedicated 6-Header Question Set bound specifically to ${targetV.name} (${targetV.code})! Ready for auditor assignment.`);
    setParsedResult(null);
    setUploadedFile(null);
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(bankSearchQuery.toLowerCase()) || t.description.toLowerCase().includes(bankSearchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'ALL' || t.venueCategory === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ display: 'flex', gap: '24px', minHeight: 'calc(100vh - 120px)', flexWrap: 'wrap' }}>

      {/* Mobile Menu Toggle Button */}
      <button 
        className="mobile-menu-btn" 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ padding: '10px 16px', background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 800, alignItems: 'center', gap: '8px', cursor: 'pointer' }}
      >
        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />} {isSidebarOpen ? 'Close Menu' : 'Open Navigation Menu'}
      </button>

      {/* Modern Left Sidebar Navigation */}
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
            Audit Admin Navigation
          </div>

          <button
            onClick={() => setAdminTab('venues')}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              background: adminTab === 'venues' ? '#4F46E5' : 'transparent',
              color: adminTab === 'venues' ? '#FFFFFF' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.86rem',
              fontWeight: 800,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 size={18} /> Buildings & Venues
            </div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px' }}>{venues.length}</span>
          </button>

          <button
            onClick={() => setAdminTab('assignments')}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              background: adminTab === 'assignments' ? '#4F46E5' : 'transparent',
              color: adminTab === 'assignments' ? '#FFFFFF' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.86rem',
              fontWeight: 800,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={18} /> Audit Assignments
            </div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px' }}>{assignments.length}</span>
          </button>

          <button
            onClick={() => setAdminTab('auditors')}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              background: adminTab === 'auditors' ? '#4F46E5' : 'transparent',
              color: adminTab === 'auditors' ? '#FFFFFF' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.86rem',
              fontWeight: 800,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck size={18} /> Auditor Directory
            </div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px' }}>{auditors.length}</span>
          </button>

          <button
            onClick={() => setAdminTab('templates')}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              background: adminTab === 'templates' ? '#4F46E5' : 'transparent',
              color: adminTab === 'templates' ? '#FFFFFF' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.86rem',
              fontWeight: 800,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Upload size={18} /> Question Sets
            </div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px' }}>{templates.length}</span>
          </button>

          <button
            onClick={() => setAdminTab('passed')}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              background: adminTab === 'passed' ? '#4F46E5' : 'transparent',
              color: adminTab === 'passed' ? '#FFFFFF' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.86rem',
              fontWeight: 800,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} /> Completed Audits
            </div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.25)', color: '#34D399', padding: '2px 6px', borderRadius: '4px' }}>{passedRecords.length}</span>
          </button>

          <button
            onClick={() => setAdminTab('failed')}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              background: adminTab === 'failed' ? '#4F46E5' : 'transparent',
              color: adminTab === 'failed' ? '#FFFFFF' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.86rem',
              fontWeight: 800,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={18} /> Review Queue
            </div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(239, 68, 68, 0.25)', color: '#F87171', padding: '2px 6px', borderRadius: '4px' }}>{failedRecords.length}</span>
          </button>
        </div>

        {/* Sidebar Admin User Profile Badge */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '6px' }}>
          <img src={ADMIN_PROFILE.avatar} alt="Admin User" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #6366F1' }} />
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF' }}>Prof. Sibi John</div>
            <div style={{ fontSize: '0.7rem', color: '#818CF8' }}>Admin User</div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Right Panel */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
        
        {/* Workspace Action Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '20px 24px', borderRadius: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              {adminTab === 'venues' && 'Buildings & Venues Registry'}
              {adminTab === 'assignments' && 'Audit Assignment Tracker'}
              {adminTab === 'auditors' && 'Registered Campus Auditors'}
              {adminTab === 'templates' && 'Upload Audit Question Set'}
              {adminTab === 'question_bank' && 'Registered Question Templates'}
              {adminTab === 'passed' && 'Completed Audits & Certificates'}
              {adminTab === 'failed' && 'Review Queue & Re-Audit Actions'}
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: 0, marginTop: '4px' }}>
              {adminTab === 'venues' && 'Manage campus physical buildings, structures, and assigned inspection templates.'}
              {adminTab === 'assignments' && 'Track real-time progress, auditor status, and manage active audit assignments.'}
              {adminTab === 'auditors' && 'Manage on-ground certified auditors, contact details, and edit roles.'}
              {adminTab === 'templates' && 'Upload .pdf, .docx, .txt, or .csv files categorized into 6 core operational headers.'}
              {adminTab === 'question_bank' && 'Browse facility-bound inspection question sets and compliance standards.'}
              {adminTab === 'passed' && 'Review auto-approved reports and verified Fitness Certificates.'}
              {adminTab === 'failed' && 'Audits requiring manual admin approval, feedback, or re-inspection dispatch.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowAddVenueModal(true)}
              style={{ padding: '10px 18px', fontSize: '0.85rem', fontWeight: 800, borderRadius: '10px', background: '#4F46E5', color: '#FFFFFF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' }}
            >
              <Plus size={16} /> Add Building
            </button>

            <button
              onClick={() => setShowAssignModal(true)}
              style={{ padding: '10px 18px', fontSize: '0.85rem', fontWeight: 800, borderRadius: '10px', background: '#2563EB', color: '#FFFFFF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Clock size={16} /> Assign Audit Task
            </button>
          </div>
        </div>

        {/* TAB: BUILDINGS & VENUES REGISTRY */}
        {adminTab === 'venues' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {venues.map(v => (
              <div key={v.id} style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#818CF8', background: 'rgba(99, 102, 241, 0.15)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(129, 140, 248, 0.3)', fontFamily: 'monospace' }}>
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
                    📍 {v.building} • Geofence: {v.geofenceRadiusMeters}m radius
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 800 }}>
                    📍 Registered Facility
                  </span>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => {
                        setSelectedUploadVenueId(v.id);
                        setAdminTab('templates');
                      }}
                      style={{ background: 'none', border: 'none', color: '#818CF8', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Edit Questions
                    </button>
                    <button
                      onClick={() => {
                        handleVenueSelectionChange(v.id);
                        setShowAssignModal(true);
                      }}
                      style={{ background: 'none', border: 'none', color: '#34D399', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Assign Audit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* TAB 1: ASSIGNMENT OVERVIEW TABLE */}
      {adminTab === 'assignments' && (
        <div className="glass-panel" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A' }}>
                Audit Assignment Register & Progress Tracker
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Track audits assigned to auditors, progress completion %, status, and target due dates.
              </p>
            </div>
            <button
              onClick={() => setShowAssignModal(true)}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            >
              <Plus size={14} /> Assign New Audit
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px' }}>ID</th>
                  <th style={{ padding: '12px' }}>Audit Title & Department</th>
                  <th style={{ padding: '12px' }}>Assigned Auditor</th>
                  <th style={{ padding: '12px' }}>Question Template</th>
                  <th style={{ padding: '12px' }}>Progress</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Due Date</th>
                  <th style={{ padding: '12px' }}>Admin Review & Controls</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(asg => (
                  <tr key={asg.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px', fontWeight: 800, color: '#2563EB' }}>{asg.id}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A' }}>{asg.title}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>📍 {asg.departmentSite}</div>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#0F172A' }}>{asg.auditorName}</td>
                    <td style={{ padding: '12px', color: '#334155' }}>{asg.templateTitle}</td>
                    <td style={{ padding: '12px', width: '140px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 800, marginBottom: '2px' }}>
                        <span>{asg.progressPercentage}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${asg.progressPercentage}%`, height: '100%', background: asg.progressPercentage === 100 ? '#10B981' : '#2563EB' }} />
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        background: (asg.status === 'Completed' || asg.status === 'Completed (Auto-Approved)' || asg.status === 'Approved by Admin') ? '#D1FAE5' : asg.status === 'Rejected' || asg.status === 'Rejected by Admin' ? '#FEE2E2' : asg.status === 'Pending Admin Review' ? '#FEF3C7' : '#DBEAFE',
                        color: (asg.status === 'Completed' || asg.status === 'Completed (Auto-Approved)' || asg.status === 'Approved by Admin') ? '#065F46' : asg.status === 'Rejected' || asg.status === 'Rejected by Admin' ? '#991B1B' : asg.status === 'Pending Admin Review' ? '#92400E' : '#1E40AF'
                      }}>
                        {asg.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#475569', fontWeight: 600 }}>{asg.dueDate}</td>
                    <td style={{ padding: '12px' }}>
                      {asg.status === 'Pending Admin Review' || asg.status === 'Under Review' ? (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => {
                              asg.status = 'Approved by Admin';
                              alert(`✅ Audit approved by Admin! Auditor can now view and print the Fitness Certificate.`);
                              setAdminTab('assignments');
                            }}
                            style={{ background: '#059669', color: '#FFF', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Reason for rejecting audit:');
                              if (reason !== null) {
                                asg.status = 'Rejected by Admin';
                                asg.notes = `❌ REJECTED BY ADMIN: ${reason || 'Incomplete inspection'}`;
                                alert(`❌ Audit rejected by Admin.`);
                                setAdminTab('assignments');
                              }
                            }}
                            style={{ background: '#DC2626', color: '#FFF', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            ❌ Reject
                          </button>
                          <button
                            onClick={() => {
                              const rec = records.find(r => r.id === asg.recordId || r.venueId === asg.venueId) || records[0];
                              setReAuditTargetRecord(rec);
                              setShowReAuditModal(true);
                            }}
                            style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', padding: '5px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            🔄 Re-Audit
                          </button>
                        </div>
                      ) : asg.status === 'Accepted' ? (
                        <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 800 }}>✅ Accepted by Auditor</span>
                      ) : asg.status === 'Rejected' ? (
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.74rem', color: '#DC2626', fontWeight: 800 }}>❌ Rejected by Auditor</span>
                          <button
                            onClick={() => {
                              setSelectedAuditorId(asg.auditorId);
                              setShowAssignModal(true);
                            }}
                            style={{ background: '#2563EB', color: '#FFF', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            🔄 Reassign
                          </button>
                        </div>
                      ) : (asg.status === 'Approved by Admin' || asg.status === 'Completed (Auto-Approved)' || asg.status === 'Completed') ? (
                        <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 800 }}>🏆 Approved (Cert Issued)</span>
                      ) : asg.status === 'Re-Audit Requested' ? (
                        <span style={{ fontSize: '0.74rem', color: '#D97706', fontWeight: 800 }}>🔄 Re-Audit Dispatched</span>
                      ) : (
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>⏳ Awaiting Auditor Acceptance</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-FORMAT TEMPLATE UPLOAD & AUTOMATIC 6 MEDICAL HEADERS CATEGORIZER */}
      {adminTab === 'templates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={20} color="#2563EB" /> Upload Venue Audit Questions File (Direct Facility Binding)
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                  Upload an audit question file (.pdf, .docx, .txt, .csv) for any of the Campus Venues. Questions are categorized into the 6 headers (1. Cleaning, 2. Electrical, 3. Network, 4. Plumbing, 5. Documentation, 6. Feedback) and bound <em>exclusively</em> to the selected facility without merging into a global pool.
                </p>
              </div>
            </div>

            {/* VENUE SELECTOR DROPDOWN & NEW VENUE REGISTER PROVISION */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📍 Select Target Campus Venue:
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddVenueModal(true)}
                  style={{
                    background: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={14} /> + Register New Venue
                </button>
              </div>
              <select
                value={selectedUploadVenueId}
                onChange={(e) => {
                  setSelectedUploadVenueId(e.target.value);
                  const foundV = venues.find(v => v.id === e.target.value);
                  if (foundV && parsedResult) {
                    setNewTemplateTitle(`Fitness Certificate - ${foundV.name} Checklist`);
                  }
                }}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', background: '#FFFFFF' }}
              >
                {venues.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.code}) — {v.category} [{v.building}]
                  </option>
                ))}
              </select>
            </div>

            {/* Drag & Drop Dropzone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleProcessTemplateFile(e.dataTransfer.files[0]);
                }
              }}
              style={{
                border: isDragOver ? '2px dashed #2563EB' : '2px dashed #CBD5E1',
                borderRadius: '12px',
                padding: '36px',
                textAlign: 'center',
                background: isDragOver ? '#EFF6FF' : '#F8FAFC',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Upload size={40} color={isDragOver ? '#2563EB' : '#94A3B8'} style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                {uploadedFile ? `📄 Uploaded File: ${uploadedFile.name}` : 'Drag and drop your Venue Question File here'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
                Supported formats: PDF (.pdf), Word (.docx, .doc), Text (.txt), CSV (.csv)
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt,.csv"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleProcessTemplateFile(e.target.files[0]);
                  }
                }}
                style={{ display: 'none' }}
                id="template-file-input"
              />
              <label htmlFor="template-file-input" className="btn-secondary" style={{ marginTop: '16px', display: 'inline-block', padding: '10px 24px', fontSize: '0.84rem', cursor: 'pointer', background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 800 }}>
                Browse Template File
              </label>
            </div>

            {/* Parse Error Notification */}
            {templateParseError && (
              <div style={{ marginTop: '16px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} /> {templateParseError}
              </div>
            )}

            {/* Parse Success Notification */}
            {templateSuccessMsg && (
              <div style={{ marginTop: '16px', background: '#F0FDF4', border: '1px solid #86EFAC', color: '#065F46', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} /> {templateSuccessMsg}
              </div>
            )}

            {/* Categorization & Preview Table */}
            {parsedResult && parsedResult.questions.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                
                {/* 6 Medical Center Operational Headers Categorization Breakdown Badges */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0F172A', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} color="#2563EB" /> 6 Operational Headers Categorization Breakdown for {venues.find(v => v.id === selectedUploadVenueId)?.name}:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                    {Object.entries(parsedResult.headerDistribution).map(([headerName, count]) => (
                      <div key={headerName} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '8px 12px', borderRadius: '6px', fontSize: '0.78rem' }}>
                        <div style={{ fontWeight: 800, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {headerName.split('(')[0]}
                        </div>
                        <div style={{ color: '#2563EB', fontWeight: 900, marginTop: '2px' }}>
                          {count} Questions
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A' }}>
                    Preview Questions ({parsedResult.questions.length} Checkpoints)
                  </h4>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={newTemplateTitle}
                      onChange={(e) => setNewTemplateTitle(e.target.value)}
                      style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.84rem', minWidth: '300px' }}
                      placeholder="Template Title..."
                    />
                    <button
                      onClick={handleSaveTemplateToBank}
                      className="btn-primary"
                      style={{ padding: '10px 22px', fontSize: '0.84rem', background: '#059669', fontWeight: 900 }}
                    >
                      Bind 6-Header Question Set to Selected Venue
                    </button>
                  </div>
                </div>

                <div style={{ overflowX: 'auto', maxHeight: '380px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#475569' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Assigned Header Section</th>
                        <th style={{ padding: '10px' }}>Question Text</th>
                        <th style={{ padding: '10px' }}>Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedResult.questions.map((pq) => (
                        <tr key={pq.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '10px', fontWeight: 800, color: '#2563EB' }}>{pq.id}</td>
                          <td style={{ padding: '10px', fontWeight: 800, color: '#0F172A' }}>{pq.categoryHeader}</td>
                          <td style={{ padding: '10px', color: '#334155' }}>{pq.questionText}</td>
                          <td style={{ padding: '10px' }}>
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              background: pq.priority === 'HIGH' ? '#FEE2E2' : '#FEF3C7',
                              color: pq.priority === 'HIGH' ? '#991B1B' : '#92400E'
                            }}>
                              {pq.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: 56 VENUES INDIVIDUAL QUESTION SETS REGISTER */}
      {adminTab === 'question_bank' && (
        <div className="glass-panel" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={20} color="#2563EB" /> Campus Venues Question Sets Register ({templates.length} Sets Configured)
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                Manage individual, un-merged 6-header question sets for each of the Campus Venues (1. Cleaning, 2. Electrical, 3. Network, 4. Plumbing, 5. Documentation, 6. Feedback).
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input
                  type="text"
                  value={bankSearchQuery}
                  onChange={(e) => setBankSearchQuery(e.target.value)}
                  placeholder="Search question bank..."
                  style={{ padding: '8px 12px 8px 32px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                />
              </div>

              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
              >
                <option value="ALL">All Categories</option>
                <option value="Medical Facilities">Medical Facilities</option>
                <option value="Laboratories">Laboratories</option>
                <option value="Dining & Food Services">Dining & Food Services</option>
                <option value="Utility & Infrastructure">Utility & Infrastructure</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {filteredTemplates.map(tmpl => (
              <div
                key={tmpl.id}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#2563EB', background: '#EFF6FF', padding: '3px 8px', borderRadius: '4px' }}>
                      {tmpl.id}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>
                      {tmpl.questions.length} Questions
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>
                    {tmpl.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.4', marginBottom: '12px' }}>
                    {tmpl.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => {
                      setSelectedTemplateId(tmpl.id);
                      setShowAssignModal(true);
                    }}
                    className="btn-primary"
                    style={{ flex: 1, padding: '8px', fontSize: '0.82rem', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Plus size={14} /> Link to New Audit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: AUDITOR DETAILS MANAGEMENT */}
      {adminTab === 'auditors' && (
        <div className="glass-panel" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={20} color="#059669" /> Registered Campus Auditors Directory ({auditors.length})
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Manage on-ground auditor details, email contacts, and roles for task assignment.
              </p>
            </div>

            <button
              onClick={() => setShowAddAuditorModal(true)}
              className="btn-primary"
              style={{ padding: '10px 18px', fontSize: '0.85rem', fontWeight: 900, background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <UserPlus size={16} /> Add Auditor Details
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
            {auditors.map(aud => {
              const assignedTasks = assignments.filter(a => a.auditorId === aud.id || a.auditorName.toLowerCase().includes(aud.name.toLowerCase()));
              return (
                <div key={aud.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img src={aud.avatar} alt={aud.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #10B981' }} />
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>{aud.name}</h4>
                          <div style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 700 }}>{aud.email}</div>
                          <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{aud.title}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartEditAuditor(aud)}
                        style={{
                          background: '#EFF6FF',
                          color: '#2563EB',
                          border: '1px solid #BFDBFE',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Active Audit Tasks: <strong style={{ color: '#2563EB' }}>{assignedTasks.filter(t => t.status !== 'Completed').length}</strong></span>
                      <span>Total Assigned: <strong style={{ color: '#0F172A' }}>{assignedTasks.length}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: COMPLETED AUDITS QUEUE (WITH RE-AUDIT ACTION) */}
      {adminTab === 'passed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {passedRecords.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#64748B', background: '#F8FAFC', borderRadius: '12px' }}>
              No completed audit reports yet.
            </div>
          ) : (
            passedRecords.map(rec => (
              <div key={rec.id} className="glass-panel" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '12px', borderLeft: '6px solid #10B981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: '#D1FAE5', color: '#065F46', fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                        PASSED (Score: {rec.authenticity.overallScore}%)
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Date: {rec.auditDate}</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', marginTop: '6px' }}>
                      {rec.venueName} ({rec.venueCode})
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#334155', marginTop: '2px' }}>
                      Auditor: <strong>{rec.auditorName}</strong> • Time Spent: {rec.timeSpentMinutes} mins
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => onViewCertificate(rec)}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.82rem', background: '#059669' }}
                    >
                      View Fitness Certificate
                    </button>

                    <button
                      onClick={() => {
                        setReAuditTargetRecord(rec);
                        setShowReAuditModal(true);
                      }}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.82rem', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <RefreshCw size={14} /> Assign Re-Audit
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ASSIGN AUDIT MODAL */}
      {showAssignModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ background: '#FFFFFF', width: '100%', maxWidth: '580px', padding: '28px', borderRadius: '16px', color: '#0F172A' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '4px' }}>
              Assign Audit Task
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '20px' }}>
              Create an audit assignment and assign to a specific certified auditor.
            </p>

            <form onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Target Campus Venue Selector Dropdown */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  📍 Select Target Campus Venue:
                </label>
                <select
                  value={selectedAssignVenueId}
                  onChange={(e) => handleVenueSelectionChange(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #2563EB', fontSize: '0.85rem', fontWeight: 800, background: '#EFF6FF', color: '#1E40AF' }}
                >
                  {venues.map(v => (
                    <option key={v.id} value={v.id}>
                      📍 {v.name} ({v.code}) — {v.category}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Audit Title:
                  </label>
                  <input
                    type="text"
                    value={auditTitle}
                    onChange={(e) => setAuditTitle(e.target.value)}
                    placeholder="E.g. Medical Center Pilot FC Audit"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Department / Site Location:
                  </label>
                  <input
                    type="text"
                    value={departmentSite}
                    onChange={(e) => setDepartmentSite(e.target.value)}
                    placeholder="E.g. Campus Health & Medical Center (MED-CTR-01)"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', background: '#F8FAFC' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Target Auditor:
                  </label>
                  <select
                    value={selectedAuditorId}
                    onChange={(e) => setSelectedAuditorId(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  >
                    {auditors.map(auditor => (
                      <option key={auditor.id} value={auditor.id}>{auditor.name} ({auditor.email})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Question Template Set:
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  >
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.title} ({t.questions.length} Qs)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Due Date:</span>
                    <span style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 700 }}>⚡ Auto-Calculated</span>
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }}
                    required
                  />
                  {/* Quick Dynamic Date Presets */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const targetVenue = venues.find(v => v.id === selectedAssignVenueId);
                        if (targetVenue?.nextAuditDueDate) setDueDate(targetVenue.nextAuditDueDate);
                      }}
                      style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid #CBD5E1', background: '#F1F5F9', cursor: 'pointer' }}
                    >
                      📍 Venue Schedule
                    </button>
                    <button
                      type="button"
                      onClick={() => setDueDate(new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0])}
                      style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid #FCA5A5', background: '#FEF2F2', color: '#991B1B', cursor: 'pointer' }}
                    >
                      ⚡ +3 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => setDueDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0])}
                      style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid #93C5FD', background: '#EFF6FF', color: '#1E40AF', cursor: 'pointer' }}
                    >
                      📅 +7 Days
                    </button>
                    <button
                      type="button"
                      onClick={() => setDueDate(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0])}
                      style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', border: '1px solid #CBD5E1', background: '#F8FAFC', color: '#334155', cursor: 'pointer' }}
                    >
                      🗓️ +14 Days
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Priority:
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => handlePrioritySelectionChange(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  >
                    <option value="HIGH">HIGH (Urgent - 3 Days)</option>
                    <option value="MEDIUM">MEDIUM (Standard - 7 Days)</option>
                    <option value="LOW">LOW (Routine - 14 Days)</option>
                  </select>

                  {/* Calendar Connectivity Widget */}
                  <div style={{ marginTop: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '8px 10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} color="#2563EB" /> Connect to Calendar:
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        title="Add event to Google Calendar"
                        onClick={() => {
                          const url = getGoogleCalendarUrl({
                            title: auditTitle,
                            description: notes,
                            location: departmentSite,
                            dueDate: dueDate,
                            priority: priority
                          });
                          window.open(url, '_blank');
                        }}
                        style={{ flex: 1, fontSize: '0.7rem', padding: '4px 6px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#2563EB', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}
                      >
                        <ExternalLink size={10} /> Google
                      </button>
                      <button
                        type="button"
                        title="Add event to Outlook Calendar"
                        onClick={() => {
                          const url = getOutlookCalendarUrl({
                            title: auditTitle,
                            description: notes,
                            location: departmentSite,
                            dueDate: dueDate,
                            priority: priority
                          });
                          window.open(url, '_blank');
                        }}
                        style={{ flex: 1, fontSize: '0.7rem', padding: '4px 6px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', color: '#0284C7', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}
                      >
                        <ExternalLink size={10} /> Outlook
                      </button>
                      <button
                        type="button"
                        title="Download .ics calendar file"
                        onClick={() => {
                          downloadIcsFile({
                            title: auditTitle,
                            description: notes,
                            location: departmentSite,
                            dueDate: dueDate,
                            priority: priority
                          });
                        }}
                        style={{ flex: 1, fontSize: '0.7rem', padding: '4px 6px', background: '#059669', border: 'none', borderRadius: '6px', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}
                      >
                        <Download size={10} /> .ICS
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Auditor Notes & Instructions:
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Specific compliance checks or equipment areas to focus on..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.85rem', background: '#2563EB' }}
                >
                  Confirm & Assign Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EMAIL NOTIFICATION TRIGGER PREVIEW MODAL */}
      {emailModalPayload && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ background: '#FFFFFF', width: '100%', maxWidth: '640px', padding: '28px', borderRadius: '16px', color: '#0F172A', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F0FDF4', border: '1px solid #86EFAC', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', color: '#065F46' }}>
              <Mail size={24} color="#059669" />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 900 }}>⚡ EMAIL NOTIFICATION TRIGGERED SUCCESSFULLY</div>
                <div style={{ fontSize: '0.78rem' }}>Automated mail sent from Admin <strong>Prof. Sibi John</strong> to Auditor <strong>{emailModalPayload.recipient}</strong>.</div>
              </div>
            </div>

            {/* Email Message Content Box */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
              <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '14px', fontSize: '0.82rem', color: '#475569' }}>
                <div><strong>From:</strong> {emailModalPayload.sender}</div>
                <div><strong>To:</strong> {emailModalPayload.recipient} &lt;{emailModalPayload.recipientEmail}&gt;</div>
                <div><strong>Date:</strong> Today at {emailModalPayload.sentTime}</div>
                <div style={{ color: '#2563EB', fontWeight: 800, marginTop: '4px' }}>
                  <strong>Subject:</strong> [ACTION REQUIRED] FC Audit Task Assignment — {emailModalPayload.assignment.title}
                </div>
              </div>

              <div style={{ fontSize: '0.88rem', color: '#1E293B', lineHeight: '1.5' }}>
                <p>Dear <strong>{emailModalPayload.recipient}</strong>,</p>
                <p style={{ margin: '10px 0' }}>
                  You have been assigned a new high-priority <strong>Fitness Certificate (FC) Audit</strong> by <strong>Prof. Sibi John</strong> for the campus facility:
                </p>
                
                <div style={{ background: '#EFF6FF', borderLeft: '4px solid #2563EB', padding: '12px', borderRadius: '6px', margin: '14px 0', fontSize: '0.82rem' }}>
                  <div>📍 <strong>Facility:</strong> {emailModalPayload.assignment.departmentSite}</div>
                  <div>📅 <strong>Target Due Date:</strong> {emailModalPayload.assignment.dueDate}</div>
                  <div>⚡ <strong>Priority:</strong> {emailModalPayload.assignment.priority}</div>
                  <div>📋 <strong>Question Set:</strong> {emailModalPayload.assignment.templateTitle}</div>
                  {emailModalPayload.assignment.notes && <div style={{ marginTop: '4px', color: '#1E40AF' }}>💡 <strong>Admin Notes:</strong> {emailModalPayload.assignment.notes}</div>}
                </div>

                <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Please log in to your Certified Auditor Portal to complete the physical checklist, verify geofence location, scan QR plaque, and submit findings.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '12px' }}>
              <button
                onClick={() => setEmailModalPayload(null)}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.88rem', fontWeight: 900, background: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Check size={18} /> Acknowledge & Reflect on Auditor's Page
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD AUDITOR DETAILS MODAL */}
      {showAddAuditorModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={20} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>Add Auditor Details</h3>
              </div>
              <button onClick={() => setShowAddAuditorModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAuditor} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Full Auditor Name *</label>
                <input
                  type="text"
                  required
                  value={newAuditorName}
                  onChange={(e) => setNewAuditorName(e.target.value)}
                  placeholder="e.g. Dr. M. Sundaram / Prof. Anand"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Official Email Address *</label>
                <input
                  type="email"
                  required
                  value={newAuditorEmail}
                  onChange={(e) => setNewAuditorEmail(e.target.value)}
                  placeholder="e.g. msundaram@bitsathy.ac.in"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Designation *</label>
                <select
                  required
                  value={newAuditorTitle}
                  onChange={(e) => setNewAuditorTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    cursor: 'pointer'
                  }}
                >
                  {AUDITOR_DESIGNATIONS.map(desig => (
                    <option key={desig} value={desig}>{desig}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddAuditorModal(false)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px', background: '#059669' }}>
                  Save Auditor Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT AUDITOR DETAILS MODAL */}
      {editingAuditor && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Edit3 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>Edit Auditor Details</h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748B' }}>Modify contact details for {editingAuditor.name}</p>
                </div>
              </div>
              <button onClick={() => setEditingAuditor(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditAuditor} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Full Auditor Name *</label>
                <input
                  type="text"
                  required
                  value={editAuditorName}
                  onChange={(e) => setEditAuditorName(e.target.value)}
                  placeholder="e.g. Dr. M. Sundaram / Prof. Anand"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Official Email Address *</label>
                <input
                  type="email"
                  required
                  value={editAuditorEmail}
                  onChange={(e) => setEditAuditorEmail(e.target.value)}
                  placeholder="e.g. msundaram@bitsathy.ac.in"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Designation *</label>
                <select
                  required
                  value={editAuditorTitle}
                  onChange={(e) => setEditAuditorTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    cursor: 'pointer'
                  }}
                >
                  {AUDITOR_DESIGNATIONS.map(desig => (
                    <option key={desig} value={desig}>{desig}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setEditingAuditor(null)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px', background: '#2563EB' }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN RE-AUDIT MODAL */}
      {showReAuditModal && reAuditTargetRecord && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '28px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RefreshCw size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>Assign Re-Audit Ticket</h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748B' }}>Target: {reAuditTargetRecord.venueName}</p>
                </div>
              </div>
              <button onClick={() => setShowReAuditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAssignReAuditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Assigned Auditor</label>
                <input
                  type="text"
                  disabled
                  value={reAuditTargetRecord.auditorName}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', background: '#F8FAFC' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Re-Audit Reason & Instructions for Auditor *</label>
                <textarea
                  required
                  rows={3}
                  value={reAuditReasonNotes}
                  onChange={(e) => setReAuditReasonNotes(e.target.value)}
                  placeholder="Explain why the submitted audit was unsatisfactory and what needs re-verification..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowReAuditModal(false)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-danger" style={{ flex: 1, padding: '10px', background: '#DC2626', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 900, cursor: 'pointer' }}>
                  🔄 Confirm & Dispatch Re-Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW VENUE MODAL */}
      {showAddVenueModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '28px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>Register New Campus Venue</h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748B' }}>Will immediately reflect under Select Target Campus Venue</p>
                </div>
              </div>
              <button onClick={() => setShowAddVenueModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateVenueInAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Venue Name *</label>
                <input
                  type="text"
                  required
                  value={newVenueName}
                  onChange={(e) => setNewVenueName(e.target.value)}
                  placeholder="e.g. Central Library Auditorium / Civil Testing Lab"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Venue Code *</label>
                  <input
                    type="text"
                    required
                    value={newVenueCode}
                    onChange={(e) => setNewVenueCode(e.target.value)}
                    placeholder="e.g. LIB-AUD-01"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Category Header</label>
                  <select
                    value={newVenueCategory}
                    onChange={(e) => setNewVenueCategory(e.target.value as CampusVenue['category'])}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    <option value="Academic Buildings">Academic Buildings</option>
                    <option value="Medical Facilities">Medical Facilities</option>
                    <option value="Media & Broadcasting">Media & Broadcasting</option>
                    <option value="Laboratories">Laboratories</option>
                    <option value="Hostels & Residential">Hostels & Residential</option>
                    <option value="Dining & Food Services">Dining & Food Services</option>
                    <option value="Sports & Gymnasium">Sports & Gymnasium</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Utility & Infrastructure">Utility & Infrastructure</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Building & Floor Location</label>
                <input
                  type="text"
                  value={newVenueBuilding}
                  onChange={(e) => setNewVenueBuilding(e.target.value)}
                  placeholder="e.g. Tagore Block, 2nd Floor"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Latitude (°N)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newVenueLat}
                    onChange={(e) => setNewVenueLat(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Longitude (°E)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={newVenueLng}
                    onChange={(e) => setNewVenueLng(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowAddVenueModal(false)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px', background: '#2563EB' }}>
                  Register Venue
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      </main>

    </div>
  );
};
