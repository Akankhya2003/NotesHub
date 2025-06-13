// routes/notes.js
const express = require('express');
const Note = require('../models/Note');
const router = express.Router();

// GET /api/notes?category=&subject=
// Fetch notes filtered by category and/or subject, sorted by creation date (latest first)
router.get('/', async (req, res) => {
  const { category, subject } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (subject) filter.subject = subject;

  try {
    const notes = await Note.find(filter)
      .sort({ createdAt: -1 }) // Sort by createdAt timestamp descending
      .select('-__v');

    res.status(200).json(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ msg: 'Could not fetch notes. Please try again later.' });
  }
});

module.exports = router;
