import mongoose from 'mongoose';

const AuditorSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    roleType: { type: String, enum: ['AUDITOR', 'ADMIN'], default: 'AUDITOR' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, default: '' },
    avatar: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Auditor = mongoose.model('Auditor', AuditorSchema);
