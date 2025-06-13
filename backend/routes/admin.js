const express = require('express');
const multer = require('multer');
const path = require('path');
const Note = require('../models/Note');
const router = express.Router();

// === Multer Configuration ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      return cb(new Error('Only PDF files are allowed'), false);
    }
    cb(null, true);
  }
});

// === POST /api/admin/upload ===
router.post('/upload', upload.single('pdf'), async (req, res) => {
  const { title, subject, category } = req.body;

  // Validate fields
  if (!title || !subject || !category || !req.file) {
    return res.status(400).json({ msg: 'All fields and a PDF file are required.' });
  }

  try {
    const fileUrl = `/uploads/${req.file.filename}`;

    const note = new Note({
      title,
      subject,
      category,
      fileUrl
    });

    await note.save();
    res.status(201).json({ msg: 'Note uploaded successfully 🎉' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ msg: 'Server error: Upload failed' });
  }
});

module.exports = router;
