import React, { useState } from 'react';
import type { CampusVenue, UserRole } from '../types/audit';
import { Mail, Send, ExternalLink, Inbox, Sparkles, RefreshCw } from 'lucide-react';

interface AssignedTask {
  id: string;
  venueId: string;
  venueName: string;
  venueCode: string;
  assignedAuditor: string;
  assignedAuditee: string;
  auditeeEmail: string;
  auditorEmail: string;
  dueDate: string;
  priority: 'URGENT' | 'HIGH' | 'ROUTINE';
  instructions: string;
  assignedAt: string;
  status: 'ASSIGNED_EMAIL_SENT' | 'IN_PROGRESS' | 'COMPLETED_PASSED' | 'FLAGGED_REVIEW';
  qrPayload: string;
  geofenceRadiusMeters: number;
  isReadByAuditee?: boolean;
}

interface TaskAssignmentEmailDemoProps {
  venues: CampusVenue[];
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  onLaunchAuditForVenue: (venue: CampusVenue) => void;
}

export const TaskAssignmentEmailDemo: React.FC<TaskAssignmentEmailDemoProps> = ({
  venues,
  setActiveRole,
  onLaunchAuditForVenue
}) => {
  // View Tab Mode inside Email Manager: 'DISPATCHER' | 'AUDITEE_INBOX'
  const [emailTab, setEmailTab] = useState<'DISPATCHER' | 'AUDITEE_INBOX'>('DISPATCHER');

  // Mock assigned tasks state
  const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>([
    {
      id: 'TASK-2026-MED-001',
      venueId: 'FC-LOC-01',
      venueName: 'Campus Health & Medical Center',
      venueCode: 'MED-CTR-01',
      assignedAuditor: 'Prof. Sibi John',
      assignedAuditee: 'Mrs. Priya L, AP-III, Dept of IT',
      auditeeEmail: 'priyal@bitsathy.ac.in',
      auditorEmail: 'sibi.john@bitsathy.ac.in',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'URGENT',
      instructions: 'Conduct 24-point FC audit inspection. Verify bio-hazard waste liners, fire extinguisher tags, and oxygen cylinder pressure.',
      assignedAt: '2026-07-28 09:30 AM',
      status: 'ASSIGNED_EMAIL_SENT',
      qrPayload: 'QR-FC-MEDCTR01-SECURE-11493954-77274503',
      geofenceRadiusMeters: 20,
      isReadByAuditee: true
    },
    {
      id: 'TASK-2026-FM-002',
      venueId: 'FC-LOC-02',
      venueName: 'Campus FM Radio Station (90.4 MHz)',
      venueCode: 'FM-RAD-01',
      assignedAuditor: 'Prof. Soundararajan (FM Incharge)',
      assignedAuditee: 'RJ Anand, Station Coordinator',
      auditeeEmail: 'rjanand@bitsathy.ac.in',
      auditorEmail: 'soundar@bitsathy.ac.in',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'HIGH',
      instructions: 'Conduct official broadcast FC audit across all 10 checkpoints: common area cleaning, fire extinguishers, UPS & batteries, ACs, lights/fans, transmitter & antenna, mics/consoles, studio equipment, speakers/receivers/recorders, and essential registers.',
      assignedAt: '2026-07-28 10:15 AM',
      status: 'ASSIGNED_EMAIL_SENT',
      qrPayload: 'QR-FC-FMRAD01-SECURE-11494120-77274890',
      geofenceRadiusMeters: 20,
      isReadByAuditee: false
    }
  ]);

  // Form State for New Assignment
  const [selectedVenueId, setSelectedVenueId] = useState<string>(venues[0]?.id || 'FC-LOC-01');
  const [priority, setPriority] = useState<'URGENT' | 'HIGH' | 'ROUTINE'>('URGENT');
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [instructions, setInstructions] = useState<string>('Inspect all 24 FC checkpoints carefully. Ensure live photo capture for any NO responses.');

  // Email Preview Modal State
  const [activeEmailModalTask, setActiveEmailModalTask] = useState<AssignedTask | null>(null);
  const [dispatchToast, setDispatchToast] = useState<string | null>(null);

  const selectedVenue = venues.find(v => v.id === selectedVenueId) || venues[0];

  // Open Device Native Email Client (Outlook, Gmail, Apple Mail) via mailto:
  const handleOpenNativeMailClient = (task: AssignedTask) => {
    const subject = encodeURIComponent(`[${task.priority}] FC Audit Task Assignment - ${task.venueName} (${task.venueCode})`);
    const body = encodeURIComponent(
      `Respected ${task.assignedAuditee},\n\n` +
      `You have been assigned as the On-Site Facility Inspector (Auditee) to conduct the official 24-point Infrastructure Fitness Certificate (FC) audit for:\n\n` +
      `📍 Venue: ${task.venueName} (${task.venueCode})\n` +
      `📅 Due Date: ${task.dueDate}\n` +
      `🎯 Geofence Requirement: Must be within ${task.geofenceRadiusMeters}m radius\n` +
      `🔐 Secure QR Payload: ${task.qrPayload}\n` +
      `📝 Checklist Standard: Bannari Amman Official 24-Checkpoint FC Template\n\n` +
      `Lead Auditor Directives:\n` +
      `"${task.instructions}"\n\n` +
      `Click here to open the FC Smart Audit System portal:\n` +
      `http://localhost:5173/\n\n` +
      `Sincerely,\n` +
      `Prof. Sibi John\n` +
      `Fitness Certificate Incharge (Lead Auditor)\n` +
      `Bannari Amman Institute of Technology, Sathyamangalam`
    );

    window.location.href = `mailto:${task.auditeeEmail}?subject=${subject}&body=${body}`;
  };

  // Dispatch New Task & Send Email Notification
  const handleAssignTaskAndSendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: AssignedTask = {
      id: `TASK-2026-${selectedVenue.code}-${Date.now().toString().slice(-4)}`,
      venueId: selectedVenue.id,
      venueName: selectedVenue.name,
      venueCode: selectedVenue.code,
      assignedAuditor: 'Prof. Sibi John',
      assignedAuditee: 'Mrs. Priya L, AP-III, Dept of IT',
      auditeeEmail: 'priyal@bitsathy.ac.in',
      auditorEmail: 'sibi.john@bitsathy.ac.in',
      dueDate: dueDate,
      priority: priority,
      instructions: instructions,
      assignedAt: new Date().toLocaleString(),
      status: 'ASSIGNED_EMAIL_SENT',
      qrPayload: selectedVenue.qrPayload,
      geofenceRadiusMeters: selectedVenue.geofenceRadiusMeters,
      isReadByAuditee: false
    };

    setAssignedTasks(prev => [newTask, ...prev]);

    // Open email preview modal immediately
    setActiveEmailModalTask(newTask);

    // Trigger toast notification
    setDispatchToast(`📧 Task Assignment Email generated for priyal@bitsathy.ac.in! Opening mail client...`);
    setTimeout(() => setDispatchToast(null), 5000);
  };

  // Launch audit as Auditee
  const handleAuditeeStartTask = (task: AssignedTask) => {
    // Mark task as read and IN_PROGRESS
    setAssignedTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'IN_PROGRESS', isReadByAuditee: true } : t));

    setActiveEmailModalTask(null);

    // Switch role to AUDITEE if not already
    const auditeeRole: UserRole = {
      id: 'auditor-priya',
      roleType: 'AUDITOR',
      name: 'Priya',
      email: 'priyal@bitsathy.ac.in',
      title: 'Medical Center Lead Auditor & On-Site Inspector',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    };
    setActiveRole(auditeeRole);

    // Launch active audit for that venue
    onLaunchAuditForVenue(selectedVenue);
  };

  const unreadInboxCount = assignedTasks.filter(t => !t.isReadByAuditee).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Header */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: '#2563EB', color: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                PRODUCTION-READY EMAIL DISPATCH ENGINE
              </span>
              <span style={{ background: '#059669', color: '#FFFFFF', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                priyal@bitsathy.ac.in
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#F8FAFC', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={24} color="#60A5FA" /> Auditor Task Assignment & Live Email Dispatch
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#CBD5E1', marginTop: '4px' }}>
              Lead Auditor (<strong>Prof. Sibi John</strong>) dispatches official email notifications directly to On-Site Inspector <strong>priyal@bitsathy.ac.in</strong> (Mrs. Priya L).
            </p>
          </div>

          {/* View Tab Switcher: Auditor Dispatcher vs Auditee Webmail Inbox */}
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.1)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <button
              onClick={() => setEmailTab('DISPATCHER')}
              style={{
                padding: '8px 16px',
                fontSize: '0.82rem',
                fontWeight: 900,
                borderRadius: '8px',
                border: 'none',
                background: emailTab === 'DISPATCHER' ? '#2563EB' : 'transparent',
                color: emailTab === 'DISPATCHER' ? '#FFFFFF' : '#CBD5E1',
                cursor: 'pointer'
              }}
            >
              👨‍🏫 Auditor Dispatcher
            </button>

            <button
              onClick={() => {
                setEmailTab('AUDITEE_INBOX');
                // Auto switch role to Auditee
                setActiveRole({
                  id: 'auditor-priya',
                  roleType: 'AUDITOR',
                  name: 'Priya',
                  email: 'priyal@bitsathy.ac.in',
                  title: 'Medical Center Lead Auditor & On-Site Inspector',
                  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
                });
              }}
              style={{
                padding: '8px 16px',
                fontSize: '0.82rem',
                fontWeight: 900,
                borderRadius: '8px',
                border: 'none',
                background: emailTab === 'AUDITEE_INBOX' ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'transparent',
                color: emailTab === 'AUDITEE_INBOX' ? '#FFFFFF' : '#34D399',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              📬 Auditee Inbox (priyal@bitsathy.ac.in)
              {unreadInboxCount > 0 && (
                <span style={{ background: '#EF4444', color: '#FFFFFF', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900 }}>
                  {unreadInboxCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Real-time Dispatch Toast */}
      {dispatchToast && (
        <div style={{ background: '#D1FAE5', border: '2px solid #34D399', color: '#065F46', padding: '14px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)' }}>
          <Sparkles size={20} color="#059669" />
          <span>{dispatchToast}</span>
        </div>
      )}

      {/* VIEW 1: AUDITOR TASK DISPATCHER & SYSTEM STATUS TRACKER */}
      {emailTab === 'DISPATCHER' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          
          {/* PANEL 1: AUDITOR TASK ASSIGNMENT FORM */}
          <div className="glass-panel" style={{ padding: '24px', background: '#FFFFFF' }}>
            <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={20} color="#2563EB" /> 1. Assign New Audit Task (Lead Auditor)
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Select campus venue and dispatch official email assignment notification to <strong>priyal@bitsathy.ac.in</strong>.
              </p>
            </div>

            <form onSubmit={handleAssignTaskAndSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Select Target Venue */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: 800 }}>
                  Select Target Campus Venue:
                </label>
                <select
                  value={selectedVenueId}
                  onChange={(e) => setSelectedVenueId(e.target.value)}
                  style={{ width: '100%', background: '#F8FAFC', color: '#0F172A', border: '1px solid #CBD5E1', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  {venues.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.code}) • {v.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Auditee (Fixed to priyal@bitsathy.ac.in) */}
              <div style={{ background: '#EFF6FF', padding: '12px', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: '0.75rem', color: '#1E40AF', fontWeight: 800 }}>Assigned On-Site Auditee Inspector:</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1E293B', marginTop: '2px' }}>
                  Mrs. Priya L, AP-III, Dept of IT
                </div>
                <div style={{ fontSize: '0.76rem', color: '#2563EB', fontWeight: 800, marginTop: '2px' }}>
                  📧 Email ID: <strong>priyal@bitsathy.ac.in</strong>
                </div>
              </div>

              {/* Priority & Due Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 800 }}>Audit Priority:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    style={{ width: '100%', background: '#F8FAFC', color: '#0F172A', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700 }}
                  >
                    <option value="URGENT">🔴 URGENT</option>
                    <option value="HIGH">🟠 HIGH</option>
                    <option value="ROUTINE">🟢 ROUTINE</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 800 }}>Inspection Due Date:</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{ width: '100%', background: '#F8FAFC', color: '#0F172A', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700 }}
                  />
                </div>
              </div>

              {/* Custom Auditor Instructions */}
              <div>
                <label style={{ fontSize: '0.78rem', color: '#475569', display: 'block', marginBottom: '4px', fontWeight: 800 }}>Lead Auditor Specific Instructions:</label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Enter specific audit instructions..."
                  style={{ width: '100%', background: '#F8FAFC', color: '#0F172A', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, resize: 'none' }}
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                }}
              >
                <Mail size={18} /> Assign Task & Dispatch Email to priyal@bitsathy.ac.in
              </button>

            </form>
          </div>

          {/* PANEL 2: AUDITEE ASSIGNED TASKS & STATUS SYNC TRACKER */}
          <div className="glass-panel" style={{ padding: '24px', background: '#FFFFFF' }}>
            <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Inbox size={20} color="#059669" /> 2. Live Task Status Tracker (Auditor & Auditee)
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Real-time synchronized status updates between Lead Auditor & On-Site Inspector.
                </p>
              </div>
              <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 10px', borderRadius: '20px', fontSize: '0.74rem', fontWeight: 900 }}>
                {assignedTasks.length} Active Task{assignedTasks.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {assignedTasks.map((t) => {
                const isAssigned = t.status === 'ASSIGNED_EMAIL_SENT';
                const isInProgress = t.status === 'IN_PROGRESS';

                return (
                  <div
                    key={t.id}
                    style={{
                      background: isInProgress ? '#F0FDF4' : isAssigned ? '#EFF6FF' : '#F8FAFC',
                      border: isInProgress ? '2px solid #34D399' : isAssigned ? '2px solid #60A5FA' : '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '16px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#2563EB', background: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #BFDBFE' }}>
                        {t.id}
                      </span>

                      {/* Status Badge */}
                      {isAssigned && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#1E40AF', background: '#DBEAFE', padding: '3px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={12} /> Dispatched to priyal@bitsathy.ac.in
                        </span>
                      )}

                      {isInProgress && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#065F46', background: '#D1FAE5', padding: '3px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <RefreshCw size={12} className="spin-animation" /> Inspection In-Progress
                        </span>
                      )}
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A', marginBottom: '4px' }}>
                      {t.venueName} ({t.venueCode})
                    </h4>

                    <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '12px' }}>
                      <div>👨‍🏫 Auditor: <strong>{t.assignedAuditor}</strong> • 👩‍🏫 Auditee: <strong>{t.assignedAuditee} ({t.auditeeEmail})</strong></div>
                      <div>📅 Due Date: <strong>{t.dueDate}</strong> • 🕒 Assigned At: {t.assignedAt}</div>
                      <div style={{ marginTop: '4px', fontStyle: 'italic', color: '#1E293B', background: '#FFFFFF', padding: '6px 10px', borderRadius: '6px', border: '1px dashed #CBD5E1' }}>
                        " {t.instructions} "
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleOpenNativeMailClient(t)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px', background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}
                        title="Send actual email using Outlook, Gmail, or Apple Mail"
                      >
                        <ExternalLink size={14} /> Send via Native Mail App (Outlook/Gmail)
                      </button>

                      <button
                        onClick={() => setActiveEmailModalTask(t)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Mail size={14} /> View Dispatched Email
                      </button>

                      <button
                        onClick={() => handleAuditeeStartTask(t)}
                        className="btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.76rem', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', border: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <ExternalLink size={14} /> Launch On-Site Inspection (Auditee)
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: AUDITEE WEBMAIL INBOX (priyal@bitsathy.ac.in) */}
      {emailTab === 'AUDITEE_INBOX' && (
        <div className="glass-panel" style={{ padding: '24px', background: '#FFFFFF' }}>
          
          {/* Inbox Header Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <Mail size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>
                  Auditee Webmail Inbox — <span style={{ color: '#059669' }}>priyal@bitsathy.ac.in</span>
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                  Mrs. Priya L, AP-III, Dept of IT • On-Site Facility Inspector
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', background: '#D1FAE5', color: '#065F46', padding: '4px 12px', borderRadius: '20px', fontWeight: 800 }}>
                {assignedTasks.length} Message{assignedTasks.length !== 1 ? 's' : ''} Received
              </span>
            </div>
          </div>

          {/* Inbox Email Message List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {assignedTasks.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setAssignedTasks(prev => prev.map(t => t.id === msg.id ? { ...t, isReadByAuditee: true } : t));
                  setActiveEmailModalTask(msg);
                }}
                style={{
                  background: msg.isReadByAuditee ? '#F8FAFC' : '#EFF6FF',
                  border: msg.isReadByAuditee ? '1px solid #E2E8F0' : '2px solid #3B82F6',
                  borderRadius: '12px',
                  padding: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: msg.isReadByAuditee ? 'none' : '0 4px 15px rgba(59, 130, 246, 0.15)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!msg.isReadByAuditee && (
                      <span style={{ background: '#3B82F6', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: '10px' }}>
                        UNREAD NEW
                      </span>
                    )}
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1E293B' }}>
                      From: Prof. Sibi John &lt;{msg.auditorEmail}&gt;
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{msg.assignedAt}</span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A', marginBottom: '6px' }}>
                  [{msg.priority}] FC Audit Assignment — {msg.venueName} ({msg.venueCode})
                </h4>

                <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  "Respected Mrs. Priya L, You have been assigned as the On-Site Facility Inspector to conduct the 24-point Infrastructure Fitness Certificate audit for {msg.venueName}. Directives: {msg.instructions}"
                </p>

                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 800, textDecoration: 'underline' }}>
                    Click to Open Full Official Email & Launch Inspection Task →
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAuditeeStartTask(msg);
                    }}
                    className="btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.78rem', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', border: 'none' }}
                  >
                    <ExternalLink size={14} /> Launch Inspection Task Now
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* OFFICIAL DISPATCHED EMAIL PREVIEW MODAL */}
      {activeEmailModalTask && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', padding: '0' }}>
            
            {/* Email Client Top Bar */}
            <div style={{ background: '#1E293B', color: '#FFFFFF', padding: '14px 20px', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 800 }}>
                <Mail size={18} color="#60A5FA" /> Bannari Amman Webmail • Official Audit Notification
              </div>
              <button onClick={() => setActiveEmailModalTask(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 800 }}>✕</button>
            </div>

            {/* Email Metadata */}
            <div style={{ padding: '16px 24px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
              <div><strong>From:</strong> {activeEmailModalTask.assignedAuditor} &lt;{activeEmailModalTask.auditorEmail}&gt;</div>
              <div><strong>To:</strong> {activeEmailModalTask.assignedAuditee} &lt;<strong style={{ color: '#059669' }}>{activeEmailModalTask.auditeeEmail}</strong>&gt;</div>
              <div><strong>Subject:</strong> <span style={{ color: '#DC2626', fontWeight: 800 }}>[{activeEmailModalTask.priority}]</span> FC Audit Task Assignment - {activeEmailModalTask.venueName}</div>
              <div style={{ color: '#64748B', fontSize: '0.75rem' }}>Date: {activeEmailModalTask.assignedAt}</div>
            </div>

            {/* Official Email HTML Body */}
            <div style={{ padding: '28px', color: '#0F172A', lineHeight: '1.6' }}>
              
              {/* Institution Header Logo */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #2563EB', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1E293B', letterSpacing: '-0.3px' }}>
                  BANNARI AMMAN INSTITUTE OF TECHNOLOGY
                </div>
                <div style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
                  Internal Quality Assurance Cell • Infrastructure Fitness Certificate System
                </div>
              </div>

              <p style={{ fontSize: '0.9rem' }}>
                Respected <strong>{activeEmailModalTask.assignedAuditee}</strong> (<code>{activeEmailModalTask.auditeeEmail}</code>),
              </p>

              <p style={{ fontSize: '0.88rem', color: '#334155' }}>
                You have been assigned as the <strong>On-Site Facility Inspector (Auditee)</strong> to conduct the official 24-point Infrastructure Fitness Certificate (FC) audit for the venue specified below:
              </p>

              {/* Venue Audit Spec Box */}
              <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '16px', borderRadius: '10px', margin: '16px 0', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 900, color: '#0369A1', fontSize: '1rem', marginBottom: '6px' }}>
                  📍 {activeEmailModalTask.venueName} ({activeEmailModalTask.venueCode})
                </div>
                <div>📅 <strong>Inspection Due Date:</strong> {activeEmailModalTask.dueDate}</div>
                <div>🎯 <strong>Geofence Requirement:</strong> Must be physically on-site within {activeEmailModalTask.geofenceRadiusMeters}m radius</div>
                <div>🔐 <strong>Secure QR Payload:</strong> <code style={{ background: '#E0F2FE', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>{activeEmailModalTask.qrPayload}</code></div>
                <div>📝 <strong>Checklist Standard:</strong> Bannari Amman Official 24-Checkpoint FC Template</div>
              </div>

              {/* Instructions */}
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '12px 16px', borderRadius: '8px', margin: '16px 0', fontSize: '0.82rem', color: '#991B1B' }}>
                <strong>Lead Auditor Special Directives:</strong>
                <p style={{ marginTop: '4px', margin: 0 }}>"{activeEmailModalTask.instructions}"</p>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#475569' }}>
                Please click the button below on your mobile device or web portal to open the GPS/QR validation gate and begin the 4-layer inspection session.
              </p>

              {/* Direct Launch Action Button inside Email */}
              <div style={{ textAlign: 'center', margin: '28px 0', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={() => handleAuditeeStartTask(activeEmailModalTask)}
                  style={{
                    padding: '14px 28px',
                    fontSize: '0.95rem',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(5, 150, 105, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <ExternalLink size={18} /> LAUNCH ON-SITE INSPECTION TASK NOW
                </button>

                <button
                  onClick={() => handleOpenNativeMailClient(activeEmailModalTask)}
                  style={{
                    background: 'none',
                    border: '1px solid #BFDBFE',
                    color: '#1D4ED8',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Mail size={14} /> Send Actual Email via Outlook / Gmail App
                </button>
              </div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', fontSize: '0.78rem', color: '#64748B' }}>
                <div>Sincerely,</div>
                <div style={{ fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>Prof. Sibi John</div>
                <div>Fitness Certificate Incharge (Lead Auditor)</div>
                <div>Bannari Amman Institute of Technology, Sathyamangalam</div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
