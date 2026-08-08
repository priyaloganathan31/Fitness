import express from 'express';
import { Venue } from '../models/Venue.js';

const router = express.Router();

// GET all venues
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find({}).sort({ updatedAt: -1 });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single venue by id
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findOne({ id: req.params.id });
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    res.json(venue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST / Save bulk or single venue
router.post('/bulk', async (req, res) => {
  try {
    const venues = req.body;
    if (!Array.isArray(venues)) {
      return res.status(400).json({ error: 'Expected array of venues' });
    }
    // Upsert each venue
    const ops = venues.map(v => ({
      updateOne: {
        filter: { id: v.id },
        update: { $set: v },
        upsert: true
      }
    }));
    await Venue.bulkWrite(ops);
    res.json({ message: `Successfully synced ${venues.length} venues` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create single venue
router.post('/', async (req, res) => {
  try {
    const venue = await Venue.findOneAndUpdate(
      { id: req.body.id },
      req.body,
      { new: true, upsert: true }
    );
    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update single venue
router.put('/:id', async (req, res) => {
  try {
    const venue = await Venue.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    res.json(venue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE venue
router.delete('/:id', async (req, res) => {
  try {
    const result = await Venue.deleteOne({ id: req.params.id });
    res.json({ message: 'Venue deleted', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
