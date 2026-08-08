import express from 'express';
import { Assignment } from '../models/Assignment.js';

const router = express.Router();

// GET all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find({}).sort({ updatedAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET assignment by id
router.get('/:id', async (req, res) => {
  try {
    const asg = await Assignment.findOne({ id: req.params.id });
    if (!asg) return res.status(404).json({ message: 'Assignment not found' });
    res.json(asg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST bulk save assignments
router.post('/bulk', async (req, res) => {
  try {
    const assignments = req.body;
    if (!Array.isArray(assignments)) {
      return res.status(400).json({ error: 'Expected array of assignments' });
    }
    const ops = assignments.map(a => ({
      updateOne: {
        filter: { id: a.id },
        update: { $set: a },
        upsert: true
      }
    }));
    await Assignment.bulkWrite(ops);
    res.json({ message: `Successfully synced ${assignments.length} assignments` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create single assignment
router.post('/', async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { id: req.body.id },
      req.body,
      { new: true, upsert: true }
    );
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update single assignment
router.put('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE assignment
router.delete('/:id', async (req, res) => {
  try {
    const result = await Assignment.deleteOne({ id: req.params.id });
    res.json({ message: 'Assignment deleted', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
