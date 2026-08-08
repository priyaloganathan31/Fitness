import express from 'express';
import { Template } from '../models/Template.js';

const router = express.Router();

// GET all templates
router.get('/', async (req, res) => {
  try {
    const templates = await Template.find({}).sort({ updatedAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single template by id
router.get('/:id', async (req, res) => {
  try {
    const tmpl = await Template.findOne({ id: req.params.id });
    if (!tmpl) return res.status(404).json({ message: 'Template not found' });
    res.json(tmpl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST bulk save templates
router.post('/bulk', async (req, res) => {
  try {
    const templates = req.body;
    if (!Array.isArray(templates)) {
      return res.status(400).json({ error: 'Expected array of templates' });
    }
    const ops = templates.map(t => ({
      updateOne: {
        filter: { id: t.id },
        update: { $set: t },
        upsert: true
      }
    }));
    await Template.bulkWrite(ops);
    res.json({ message: `Successfully synced ${templates.length} templates` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create or upsert single template
router.post('/', async (req, res) => {
  try {
    const template = await Template.findOneAndUpdate(
      { id: req.body.id },
      req.body,
      { new: true, upsert: true }
    );
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update single template
router.put('/:id', async (req, res) => {
  try {
    const template = await Template.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!template) return res.status(404).json({ message: 'Template not found' });
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE template
router.delete('/:id', async (req, res) => {
  try {
    const result = await Template.deleteOne({ id: req.params.id });
    res.json({ message: 'Template deleted', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
