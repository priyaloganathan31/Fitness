import express from 'express';
import { Auditor } from '../models/Auditor.js';

const router = express.Router();

// GET all auditors
router.get('/', async (req, res) => {
  try {
    const auditors = await Auditor.find({}).sort({ updatedAt: -1 });
    res.json(auditors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST bulk save auditors
router.post('/bulk', async (req, res) => {
  try {
    const auditors = req.body;
    if (!Array.isArray(auditors)) {
      return res.status(400).json({ error: 'Expected array of auditors' });
    }
    const ops = auditors.map(a => ({
      updateOne: {
        filter: { id: a.id },
        update: { $set: a },
        upsert: true
      }
    }));
    await Auditor.bulkWrite(ops);
    res.json({ message: `Successfully synced ${auditors.length} auditors` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create auditor
router.post('/', async (req, res) => {
  try {
    const auditor = await Auditor.findOneAndUpdate(
      { id: req.body.id },
      req.body,
      { new: true, upsert: true }
    );
    res.status(201).json(auditor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
