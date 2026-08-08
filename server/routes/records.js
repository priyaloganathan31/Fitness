import express from 'express';
import { AuditRecord } from '../models/AuditRecord.js';

const router = express.Router();

// GET all records
router.get('/', async (req, res) => {
  try {
    const records = await AuditRecord.find({}).sort({ updatedAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET record by id
router.get('/:id', async (req, res) => {
  try {
    const record = await AuditRecord.findOne({ id: req.params.id });
    if (!record) return res.status(404).json({ message: 'Audit Record not found' });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST bulk save records
router.post('/bulk', async (req, res) => {
  try {
    const records = req.body;
    if (!Array.isArray(records)) {
      return res.status(400).json({ error: 'Expected array of records' });
    }
    const ops = records.map(r => ({
      updateOne: {
        filter: { id: r.id },
        update: { $set: r },
        upsert: true
      }
    }));
    await AuditRecord.bulkWrite(ops);
    res.json({ message: `Successfully synced ${records.length} audit records` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create single record
router.post('/', async (req, res) => {
  try {
    const record = await AuditRecord.findOneAndUpdate(
      { id: req.body.id },
      req.body,
      { new: true, upsert: true }
    );
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update single record
router.put('/:id', async (req, res) => {
  try {
    const record = await AuditRecord.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!record) return res.status(404).json({ message: 'Audit Record not found' });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE record
router.delete('/:id', async (req, res) => {
  try {
    const result = await AuditRecord.deleteOne({ id: req.params.id });
    res.json({ message: 'Audit record deleted', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
