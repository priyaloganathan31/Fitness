import mongoose from 'mongoose';

const PhotoProofSchema = new mongoose.Schema({
  id: { type: String, required: true },
  questionId: { type: String, required: true },
  photoUrl: { type: String, required: true },
  caption: { type: String, default: '' },
  timestamp: { type: String, required: true },
  geoTag: {
    lat: { type: Number },
    lng: { type: Number }
  },
  issueCategory: { type: String }
}, { _id: false });

const DynamicFollowUpSchema = new mongoose.Schema({
  id: { type: String, required: true },
  parentQuestionId: { type: String, required: true },
  questionText: { type: String, required: true },
  options: [{ type: String }],
  userAnswer: { type: String }
}, { _id: false });

const DynamicAIQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  relatedPredefinedQuestionId: { type: String },
  predefinedQuestionText: { type: String },
  questionText: { type: String, required: true },
  category: { type: String },
  responseType: { type: String },
  options: [{ type: String }],
  correctOptionIndex: { type: Number },
  expectedKeywords: [{ type: String }],
  userTextAnswer: { type: String },
  userAnswerIndex: { type: Number },
  userPhotoProofUrl: { type: String },
  validationStatus: { type: String },
  validationFeedback: { type: String },
  rationale: { type: String },
  isCorrect: { type: Boolean }
}, { _id: false });

const AuthenticityScoreSchema = new mongoose.Schema({
  overallScore: { type: Number, required: true, default: 0 },
  isSelfApproved: { type: Boolean, default: false },
  gpsProximityScore: { type: Number, default: 0 },
  dwellTimeScore: { type: Number, default: 0 },
  photoAuthenticityScore: { type: Number, default: 0 },
  aiDynamicCheckScore: { type: Number, default: 0 },
  discrepancyFlags: [{ type: String }],
  reviewReason: { type: String }
}, { _id: false });

const AuditRecordSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    assignmentId: { type: String, default: '' },
    certificateNumber: { type: String, required: true },
    venueId: { type: String, required: true },
    venueName: { type: String, required: true },
    venueCode: { type: String, required: true },
    venueCategory: { type: String, required: true },
    auditorName: { type: String, required: true },
    auditedByAuditeeName: { type: String, default: '' },
    auditDate: { type: String, required: true },
    timeSpentMinutes: { type: Number, default: 0 },

    scannedQrMatched: { type: Boolean, default: true },
    scannedQrCode: { type: String, default: '' },
    liveGpsCoordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 }
    },
    targetGpsCoordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 }
    },
    gpsDistanceMeters: { type: Number, default: 0 },
    isGeoFenceVerified: { type: Boolean, default: true },

    templateId: { type: String, required: true },
    predefinedAnswers: { type: mongoose.Schema.Types.Mixed, default: {} },
    aiDynamicQuestions: [DynamicAIQuestionSchema],
    authenticity: { type: AuthenticityScoreSchema, required: true },
    status: { type: String, required: true },
    auditorReviewNotes: { type: String, default: '' },
    auditorFeedback: {
      overallSummary: { type: String, default: '' },
      onGroundChallenges: { type: String, default: '' },
      correctiveActionRecommended: { type: String, default: '' },
      ratingScore: { type: Number, default: 5 }
    },
    cryptoSignatureHash: { type: String, default: '' }
  },
  { timestamps: true }
);

export const AuditRecord = mongoose.model('AuditRecord', AuditRecordSchema);
