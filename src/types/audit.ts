export type UserRoleType = 'AUDITOR' | 'ADMIN';

export interface UserRole {
  id: string;
  roleType: UserRoleType;
  name: string;
  email: string;
  title: string;
  avatar: string;
}

export const DEMO_AUDITORS: UserRole[] = [
  {
    id: 'auditor-priya',
    roleType: 'AUDITOR',
    name: 'Priya',
    email: 'priyal@bitsathy.ac.in',
    title: 'Medical Center Lead Auditor & On-Site Inspector',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  }
];

export const ADMIN_PROFILE: UserRole = {
  id: 'admin-sibi',
  roleType: 'ADMIN',
  name: 'Prof. Sibi John',
  email: 'sibi.john@bitsathy.ac.in',
  title: 'Campus Facilities Lead Administrator (Admin)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
};

export const USER_ROLES: UserRole[] = [
  ADMIN_PROFILE,
  ...DEMO_AUDITORS
];

export type VenueCategory = 
  | 'Medical Facilities'
  | 'Laboratories'
  | 'Hostels & Residential'
  | 'Sports & Gymnasium'
  | 'Dining & Food Services'
  | 'Academic Buildings'
  | 'Administrative'
  | 'Utility & Infrastructure';

export type AuditStatus = 
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'PASSED_SELF_APPROVED'
  | 'FLAGGED_REVIEW_REQUIRED'
  | 'APPROVED_BY_ADMIN'
  | 'REJECTED_BY_ADMIN'
  | 'RE_INSPECTION_SCHEDULED'
  | 'RE_AUDIT_REQUESTED'
  | 'OVERDUE';

export type DefectIssueCategory = 
  | 'Civil Issue'
  | 'Infrastructure'
  | 'Network Maintanence'
  | 'Power House'
  | 'Transport Facilities';

export interface PredefinedQuestion {
  id: string;
  section: string;
  questionText: string;
  description?: string;
  isMandatory: boolean;
  requiresPhotoIfNo: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  
  // Contextual AI Proximity Template metadata
  aiContextKeywords?: string[];
  sampleFollowUpQuestionsIfNo?: string[];
}

export interface QuestionTemplate {
  id: string;
  title: string;
  description: string;
  venueCategory: VenueCategory;
  venueId?: string;
  venueName?: string;
  venueCode?: string;
  createdBy: string;
  createdAt: string;
  questions: PredefinedQuestion[];
}

export interface CampusVenue {
  id: string;
  code: string;
  name: string;
  category: VenueCategory;
  building: string;
  geoCoordinates: { lat: number; lng: number };
  geofenceRadiusMeters: number; // e.g. 20-30m
  qrPayload: string; // Encrypted QR token
  assignedAuditor: string;
  assignedAuditee: string;
  scheduleFrequencyDays: number; // e.g. 15 days
  lastAuditDate?: string;
  nextAuditDueDate: string;
  status: AuditStatus;
  activeTemplateId: string;
  imageUrl: string;
  totalCheckpoints: number;
}

export interface DynamicAIQuestion {
  id: string;
  relatedPredefinedQuestionId?: string; // Mapped to the YES predefined question
  predefinedQuestionText?: string;
  questionText: string; // Dynamic verification question generated at runtime
  category: string;
  responseType?: 'TEXT_PROBE' | 'MULTIPLE_CHOICE' | 'PHOTO_PROOF';
  options?: string[];
  correctOptionIndex?: number;
  expectedKeywords?: string[];
  userTextAnswer?: string;
  userAnswerIndex?: number;
  userPhotoProofUrl?: string;
  validationStatus?: 'PASS' | 'REJECTED_VAGUE' | 'MISMATCH_FLAGGED' | 'PENDING';
  validationFeedback?: string;
  rationale?: string;
  isCorrect?: boolean;
}

export interface PhotoProof {
  id: string;
  questionId: string;
  photoUrl: string;
  caption: string;
  timestamp: string;
  geoTag: { lat: number; lng: number };
  issueCategory: DefectIssueCategory;
}

export interface DynamicFollowUpQuestion {
  id: string;
  parentQuestionId: string;
  questionText: string;
  options: string[];
  userAnswer?: string;
}

export interface AuthenticityScore {
  overallScore: number; // 0 - 100
  isSelfApproved: boolean; // true if overallScore >= 85
  gpsProximityScore: number; // 0 - 100
  dwellTimeScore: number; // 0 - 100
  photoAuthenticityScore: number; // 0 - 100
  aiDynamicCheckScore: number; // 0 - 100
  discrepancyFlags: string[];
  reviewReason?: string;
}

export interface CSVQuestionItem {
  Question_ID: string;
  Category: string;
  Question_Text: string;
  Compliance_Standard: string;
  Risk_Level: 'HIGH' | 'MEDIUM' | 'LOW';
  Max_Score: number;
  Guidance_Notes: string;
}

export type AuditAssignmentStatus = 
  | 'Assigned' 
  | 'Accepted' 
  | 'Rejected' 
  | 'In Progress' 
  | 'Pending Admin Review' 
  | 'Completed (Auto-Approved)' 
  | 'Approved by Admin' 
  | 'Rejected by Admin' 
  | 'Re-Audit Requested' 
  | 'Completed' 
  | 'Under Review';

export interface AuditAssignment {
  id: string;
  title: string;
  departmentSite: string;
  venueId?: string;
  venueName?: string;
  venueCode?: string;
  templateId: string;
  templateTitle: string;
  auditorId: string;
  auditorName: string;
  assignedByAdmin: string;
  assignedDate: string;
  dueDate: string;
  status: AuditAssignmentStatus;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  notes?: string;
  specialInstructions?: string;
  progressPercentage: number;
  recordId?: string;
}

export interface CampusAuditRecord {
  id: string;
  assignmentId?: string;
  certificateNumber: string;
  venueId: string;
  venueName: string;
  venueCode: string;
  venueCategory: VenueCategory;
  auditorName: string;
  auditedByAuditeeName: string;
  auditDate: string;
  timeSpentMinutes: number;
  
  // Verification Gate Payload
  scannedQrMatched: boolean;
  scannedQrCode: string;
  liveGpsCoordinates: { lat: number; lng: number };
  targetGpsCoordinates: { lat: number; lng: number };
  gpsDistanceMeters: number;
  isGeoFenceVerified: boolean;
  
  // Audit Results
  templateId: string;
  predefinedAnswers: Record<string, {
    questionId: string;
    answer: 'YES' | 'NO';
    photoProof?: PhotoProof;
    notes?: string;
    dynamicFollowUps?: DynamicFollowUpQuestion[];
  }>;
  
  aiDynamicQuestions: DynamicAIQuestion[];
  authenticity: AuthenticityScore;
  status: AuditStatus;
  auditorReviewNotes?: string;
  auditorFeedback?: {
    overallSummary: string;
    onGroundChallenges?: string;
    correctiveActionRecommended?: string;
    ratingScore: number;
  };
  cryptoSignatureHash: string;
}

