const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Note = require('../models/Note');
const cloudinary = require('../utils/cloudinary');
const router = express.Router();

// ✅ Ensure temp_uploads folder exists
const tempDir = 'temp_uploads';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// ✅ Multer config to save temporarily in temp_uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.replace(/\s+/g, '_');
    cb(null, name);
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

// ✅ POST route for uploading notes
router.post('/upload', upload.single('pdf'), async (req, res) => {
  const { title, subject, category } = req.body;

  if (!title || !subject || !category || !req.file) {
    return res.status(400).json({ msg: 'All fields and a PDF file are required.' });
  }

  try {
    // ✅ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw', // for non-image files like PDFs
      folder: 'notes'
    });

    console.log("✅ Cloudinary Upload Result:", result);

    // ✅ Save metadata to MongoDB
    const note = new Note({
      title,
      subject,
      category,
      fileUrl: result.secure_url
    });

    await note.save();

    // ✅ Delete the temp file after upload
    fs.unlinkSync(req.file.path);

    res.status(201).json({ msg: '✅ Note uploaded successfully!' });
  } catch (error) {
    console.error('❌ Cloudinary Upload Error:', error);
    res.status(500).json({ msg: '❌ Upload failed on server.' });
  }
});

module.exports = router;
