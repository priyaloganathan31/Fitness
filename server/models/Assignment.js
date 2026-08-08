import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    departmentSite: { type: String, required: true },
    venueId: { type: String, default: '' },
    venueName: { type: String, default: '' },
    venueCode: { type: String, default: '' },
    templateId: { type: String, required: true },
    templateTitle: { type: String, default: '' },
    auditorId: { type: String, required: true },
    auditorName: { type: String, default: '' },
    assignedByAdmin: { type: String, default: '' },
    assignedDate: { type: String, required: true },
    dueDate: { type: String, required: true },
    status: { type: String, default: 'Assigned' },
    priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
    notes: { type: String, default: '' },
    specialInstructions: { type: String, default: '' },
    progressPercentage: { type: Number, default: 0 },
    recordId: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Assignment = mongoose.model('Assignment', AssignmentSchema);
