import mongoose from 'mongoose';

const PredefinedQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  section: { type: String, required: true },
  questionText: { type: String, required: true },
  description: { type: String, default: '' },
  isMandatory: { type: Boolean, default: true },
  requiresPhotoIfNo: { type: Boolean, default: true },
  priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
  aiContextKeywords: [{ type: String }],
  sampleFollowUpQuestionsIfNo: [{ type: String }]
}, { _id: false });

const TemplateSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    venueCategory: { type: String, required: true },
    venueId: { type: String, default: '' },
    venueName: { type: String, default: '' },
    venueCode: { type: String, default: '' },
    createdBy: { type: String, default: 'Admin' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    questions: [PredefinedQuestionSchema]
  },
  { timestamps: true }
);

export const Template = mongoose.model('Template', TemplateSchema);
