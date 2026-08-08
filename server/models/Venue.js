import mongoose from 'mongoose';

const VenueSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    building: { type: String, default: '' },
    geoCoordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    geofenceRadiusMeters: { type: Number, default: 30 },
    qrPayload: { type: String, default: '' },
    assignedAuditor: { type: String, default: '' },
    assignedAuditee: { type: String, default: '' },
    scheduleFrequencyDays: { type: Number, default: 15 },
    lastAuditDate: { type: String, default: '' },
    nextAuditDueDate: { type: String, default: '' },
    status: { type: String, default: 'SCHEDULED' },
    activeTemplateId: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    totalCheckpoints: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Venue = mongoose.model('Venue', VenueSchema);
