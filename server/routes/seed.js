import express from 'express';
import { Venue } from '../models/Venue.js';
import { Template } from '../models/Template.js';
import { Assignment } from '../models/Assignment.js';
import { AuditRecord } from '../models/AuditRecord.js';
import { Auditor } from '../models/Auditor.js';

const router = express.Router();

export const seedDatabaseIfEmpty = async (seedPayload = null) => {
  try {
    const venueCount = await Venue.countDocuments();
    if (venueCount === 0 && seedPayload) {
      console.log('[Seed] Database is empty. Seeding initial data into MongoDB...');
      if (seedPayload.venues) {
        await Venue.insertMany(seedPayload.venues);
        console.log(`[Seed] Seeded ${seedPayload.venues.length} Venues`);
      }
      if (seedPayload.templates) {
        await Template.insertMany(seedPayload.templates);
        console.log(`[Seed] Seeded ${seedPayload.templates.length} Templates`);
      }
      if (seedPayload.assignments) {
        await Assignment.insertMany(seedPayload.assignments);
        console.log(`[Seed] Seeded ${seedPayload.assignments.length} Assignments`);
      }
      if (seedPayload.records) {
        await AuditRecord.insertMany(seedPayload.records);
        console.log(`[Seed] Seeded ${seedPayload.records.length} Audit Records`);
      }
      if (seedPayload.auditors) {
        await Auditor.insertMany(seedPayload.auditors);
        console.log(`[Seed] Seeded ${seedPayload.auditors.length} Auditors`);
      }
      console.log('[Seed] MongoDB initial seeding completed successfully!');
    }
  } catch (err) {
    console.error('[Seed Error]', err.message);
  }
};

// POST /api/seed Endpoint to populate or force re-seed database from client payload
router.post('/', async (req, res) => {
  try {
    const { venues, templates, assignments, records, auditors, forceReset } = req.body;

    if (forceReset) {
      await Venue.deleteMany({});
      await Template.deleteMany({});
      await Assignment.deleteMany({});
      await AuditRecord.deleteMany({});
      await Auditor.deleteMany({});
    }

    let seededStats = {
      venues: 0,
      templates: 0,
      assignments: 0,
      records: 0,
      auditors: 0
    };

    if (venues && venues.length > 0) {
      const ops = venues.map(v => ({
        updateOne: { filter: { id: v.id }, update: { $set: v }, upsert: true }
      }));
      await Venue.bulkWrite(ops);
      seededStats.venues = venues.length;
    }

    if (templates && templates.length > 0) {
      const ops = templates.map(t => ({
        updateOne: { filter: { id: t.id }, update: { $set: t }, upsert: true }
      }));
      await Template.bulkWrite(ops);
      seededStats.templates = templates.length;
    }

    if (assignments && assignments.length > 0) {
      const ops = assignments.map(a => ({
        updateOne: { filter: { id: a.id }, update: { $set: a }, upsert: true }
      }));
      await Assignment.bulkWrite(ops);
      seededStats.assignments = assignments.length;
    }

    if (records && records.length > 0) {
      const ops = records.map(r => ({
        updateOne: { filter: { id: r.id }, update: { $set: r }, upsert: true }
      }));
      await AuditRecord.bulkWrite(ops);
      seededStats.records = records.length;
    }

    if (auditors && auditors.length > 0) {
      const ops = auditors.map(a => ({
        updateOne: { filter: { id: a.id }, update: { $set: a }, upsert: true }
      }));
      await Auditor.bulkWrite(ops);
      seededStats.auditors = auditors.length;
    }

    res.json({
      success: true,
      message: 'MongoDB populated and synced successfully!',
      stats: seededStats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
