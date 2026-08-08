import type { CampusVenue, QuestionTemplate, AuditAssignment, CampusAuditRecord, UserRole } from '../types/audit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface ApiHealthResponse {
  connected: boolean;
  dbState: number;
  message: string;
}

export async function checkApiHealth(): Promise<ApiHealthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      connected: data.databaseConnected === true,
      dbState: data.dbState,
      message: data.databaseConnected ? 'Connected to MongoDB' : 'Server active, MongoDB connecting...'
    };
  } catch (err: any) {
    return {
      connected: false,
      dbState: 0,
      message: `Offline / Cannot connect to backend server at ${API_BASE_URL}`
    };
  }
}

// ----------------- VENUES -----------------
export async function fetchVenuesApi(): Promise<CampusVenue[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/venues`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn('[API] Failed to fetch venues from MongoDB API:', e);
    return null;
  }
}

export async function saveVenuesApi(venues: CampusVenue[]): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/venues/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venues)
    });
    return res.ok;
  } catch (e) {
    console.warn('[API] Failed to sync venues to MongoDB API:', e);
    return false;
  }
}

// ----------------- TEMPLATES -----------------
export async function fetchTemplatesApi(): Promise<QuestionTemplate[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/templates`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn('[API] Failed to fetch templates from MongoDB API:', e);
    return null;
  }
}

export async function saveTemplatesApi(templates: QuestionTemplate[]): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/templates/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(templates)
    });
    return res.ok;
  } catch (e) {
    console.warn('[API] Failed to sync templates to MongoDB API:', e);
    return false;
  }
}

// ----------------- ASSIGNMENTS -----------------
export async function fetchAssignmentsApi(): Promise<AuditAssignment[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/assignments`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn('[API] Failed to fetch assignments from MongoDB API:', e);
    return null;
  }
}

export async function saveAssignmentsApi(assignments: AuditAssignment[]): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/assignments/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignments)
    });
    return res.ok;
  } catch (e) {
    console.warn('[API] Failed to sync assignments to MongoDB API:', e);
    return false;
  }
}

// ----------------- AUDIT RECORDS -----------------
export async function fetchRecordsApi(): Promise<CampusAuditRecord[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/records`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn('[API] Failed to fetch records from MongoDB API:', e);
    return null;
  }
}

export async function saveRecordsApi(records: CampusAuditRecord[]): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/records/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(records)
    });
    return res.ok;
  } catch (e) {
    console.warn('[API] Failed to sync records to MongoDB API:', e);
    return false;
  }
}

// ----------------- AUDITORS -----------------
export async function fetchAuditorsApi(): Promise<UserRole[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/auditors`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn('[API] Failed to fetch auditors from MongoDB API:', e);
    return null;
  }
}

export async function saveAuditorsApi(auditors: UserRole[]): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/auditors/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auditors)
    });
    return res.ok;
  } catch (e) {
    console.warn('[API] Failed to sync auditors to MongoDB API:', e);
    return false;
  }
}

// ----------------- SEED DATABASE -----------------
export async function seedDatabaseApi(payload: {
  venues?: CampusVenue[];
  templates?: QuestionTemplate[];
  assignments?: AuditAssignment[];
  records?: CampusAuditRecord[];
  auditors?: UserRole[];
  forceReset?: boolean;
}): Promise<{ success: boolean; message: string; stats?: any }> {
  try {
    const res = await fetch(`${API_BASE_URL}/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (e: any) {
    return { success: false, message: `Failed to connect to seed endpoint: ${e.message}` };
  }
}
