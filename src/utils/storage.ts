import type { AuditAssignment, QuestionTemplate, CampusAuditRecord, CampusVenue, UserRole } from '../types/audit';
import { DEMO_AUDITORS } from '../types/audit';
import { MOCK_AUDIT_RECORDS } from '../data/mockData';
import { INITIAL_QUESTION_TEMPLATES, ALL_56_CAMPUS_VENUES } from '../data/locationRegistry';

const KEYS = {
  ASSIGNMENTS: 'fc_audit_assignments_v8',
  QUESTION_BANK: 'fc_audit_question_bank_v8',
  AUDIT_RECORDS: 'fc_audit_records_v8',
  ACTIVE_AUDITOR_ID: 'fc_audit_active_auditor_id_v8',
  VENUES: 'fc_audit_venues_v8',
  AUDITORS: 'fc_audit_auditors_list_v8'
};

export function loadAuditors(): UserRole[] {
  try {
    const raw = localStorage.getItem(KEYS.AUDITORS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load auditors from localStorage', e);
  }
  saveAuditors(DEMO_AUDITORS);
  return DEMO_AUDITORS;
}

export function saveAuditors(auditors: UserRole[]): void {
  try {
    localStorage.setItem(KEYS.AUDITORS, JSON.stringify(auditors));
  } catch (e) {
    console.error('Failed to save auditors to localStorage', e);
  }
}

export function loadVenues(): CampusVenue[] {
  try {
    const raw = localStorage.getItem(KEYS.VENUES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load venues from localStorage', e);
  }
  saveVenues(ALL_56_CAMPUS_VENUES);
  return ALL_56_CAMPUS_VENUES;
}

export function saveVenues(venues: CampusVenue[]): void {
  try {
    localStorage.setItem(KEYS.VENUES, JSON.stringify(venues));
  } catch (e) {
    console.error('Failed to save venues to localStorage', e);
  }
}

export function loadAssignments(): AuditAssignment[] {
  try {
    const raw = localStorage.getItem(KEYS.ASSIGNMENTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load assignments from localStorage', e);
  }
  // Default assignments featuring both Demo #1 (Medical Center) and Demo #2 (FM Radio Station 90.4 MHz)
  const defaults: AuditAssignment[] = [
    {
      id: 'ASG-2026-MED-PILOT',
      title: 'Demo 1: Campus Health & Medical Center FC Audit',
      departmentSite: 'Campus Health & Medical Center (MED-CTR-01)',
      venueId: 'FC-LOC-01',
      venueName: 'Campus Health & Medical Center',
      venueCode: 'MED-CTR-01',
      templateId: 'TMPL-BIT-MED-24',
      templateTitle: 'Fitness Certificate - Medical Center Incharge',
      auditorId: 'auditor-priya',
      auditorName: 'Mrs. Priya L (priyal@bitsathy.ac.in)',
      assignedByAdmin: 'Prof. Sibi John (sibi.john@bitsathy.ac.in)',
      assignedDate: '2026-07-29',
      dueDate: '2026-08-05',
      status: 'Assigned',
      priority: 'HIGH',
      notes: 'Verify emergency oxygen cylinder pressure gauges, cold chain vaccine temperatures, bio-medical waste liners, and AED readiness in Room 101.',
      progressPercentage: 0
    },
    {
      id: 'ASG-2026-FM-PILOT',
      title: 'Demo 2: Campus FM Radio Station (90.4 MHz) Broadcast FC Audit',
      departmentSite: 'Campus FM Radio Station (FM-RAD-01)',
      venueId: 'FC-LOC-02',
      venueName: 'Campus FM Radio Station (90.4 MHz)',
      venueCode: 'FM-RAD-01',
      templateId: 'TMPL-BIT-FM-10',
      templateTitle: 'Fitness Certificate - Campus FM Radio Station Incharge',
      auditorId: 'auditor-priya',
      auditorName: 'RJ Anand (rjanand@bitsathy.ac.in)',
      assignedByAdmin: 'Prof. Soundararajan (soundar@bitsathy.ac.in)',
      assignedDate: '2026-07-29',
      dueDate: '2026-08-04',
      status: 'Assigned',
      priority: 'HIGH',
      notes: 'Inspect all 10 FM station checkpoints: common area cleaning, fire extinguishers, UPS & batteries, ACs, lights/fans, transmitter & antenna, mics/consoles, studio equipment, speakers/receivers/recorders, and essential registers.',
      progressPercentage: 0
    },
    {
      id: 'ASG-2026-101',
      title: 'Monthly Safety & High Hazard Chemical Inspection',
      departmentSite: 'Nanotechnology Cleanroom & Materials Lab (LAB-CLEAN-02)',
      venueId: 'FC-LOC-02',
      venueName: 'Nanotechnology Cleanroom & Materials Lab',
      venueCode: 'LAB-CLEAN-02',
      templateId: 'TMPL-MED-001',
      templateTitle: 'Medical & Health Safety Compliance v2.4',
      auditorId: 'auditor-priya',
      auditorName: 'Priya (priyal@bitsathy.ac.in)',
      assignedByAdmin: 'Prof. Sibi John (sibi.john@bitsathy.ac.in)',
      assignedDate: '2026-07-28',
      dueDate: '2026-08-05',
      status: 'Assigned',
      priority: 'HIGH',
      notes: 'Verify chemical exhaust fume hood pressure differential and eye-wash flow rate.',
      progressPercentage: 0
    },
    {
      id: 'ASG-2026-102',
      title: 'Kitchen Hygiene & Exhaust Fire Risk Audit',
      departmentSite: 'Central Student Dining Hall & Kitchen (DIN-CNT-01)',
      venueId: 'FC-LOC-05',
      venueName: 'Central Student Dining Hall & Kitchen',
      venueCode: 'DIN-CNT-01',
      templateId: 'TMPL-MED-001',
      templateTitle: 'Food Safety & Hygiene Checklist',
      auditorId: 'auditor-priya',
      auditorName: 'Priya (priyal@bitsathy.ac.in)',
      assignedByAdmin: 'Prof. Sibi John (sibi.john@bitsathy.ac.in)',
      assignedDate: '2026-07-28',
      dueDate: '2026-08-02',
      status: 'In Progress',
      priority: 'HIGH',
      notes: 'Inspect exhaust fan V-belts and check grease trap filter tags.',
      progressPercentage: 45
    }
  ];
  saveAssignments(defaults);
  return defaults;
}

export function saveAssignments(assignments: AuditAssignment[]): void {
  try {
    localStorage.setItem(KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  } catch (e) {
    console.error('Failed to save assignments to localStorage', e);
  }
}

export function loadQuestionBank(): QuestionTemplate[] {
  try {
    const raw = localStorage.getItem(KEYS.QUESTION_BANK);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure all default preset templates exist in the returned set
        const existingIds = new Set(parsed.map((t: QuestionTemplate) => t.id));
        const merged = [...parsed];
        for (const initialTmpl of INITIAL_QUESTION_TEMPLATES) {
          if (!existingIds.has(initialTmpl.id)) {
            merged.push(initialTmpl);
          }
        }
        return merged;
      }
    }
  } catch (e) {
    console.warn('Failed to load question bank from localStorage', e);
  }
  saveQuestionBank(INITIAL_QUESTION_TEMPLATES);
  return INITIAL_QUESTION_TEMPLATES;
}

export function saveQuestionBank(templates: QuestionTemplate[]): void {
  try {
    localStorage.setItem(KEYS.QUESTION_BANK, JSON.stringify(templates));
  } catch (e) {
    console.error('Failed to save question bank to localStorage', e);
  }
}

export function loadAuditRecords(): CampusAuditRecord[] {
  try {
    const raw = localStorage.getItem(KEYS.AUDIT_RECORDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load audit records from localStorage', e);
  }
  saveAuditRecords(MOCK_AUDIT_RECORDS);
  return MOCK_AUDIT_RECORDS;
}

export function saveAuditRecords(records: CampusAuditRecord[]): void {
  try {
    localStorage.setItem(KEYS.AUDIT_RECORDS, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save audit records to localStorage', e);
  }
}

export function loadActiveAuditorId(): string {
  return localStorage.getItem(KEYS.ACTIVE_AUDITOR_ID) || 'auditor-priya';
}

export function saveActiveAuditorId(id: string): void {
  localStorage.setItem(KEYS.ACTIVE_AUDITOR_ID, id);
}
