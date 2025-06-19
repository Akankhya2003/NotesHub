const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Note = require('../models/Note');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// 🔐 Supabase credentials from .env
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

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
    const name = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
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
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `${category}/${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;


    // ✅ Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('notes-pdf')
      .upload(fileName, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('❌ Supabase Upload Error:', uploadError);
      return res.status(500).json({ msg: '❌ Upload to Supabase failed.' });
    }

    // ✅ Get public URL
    const { data: publicUrlData } = supabase.storage.from('notes-pdf').getPublicUrl(fileName);
    const publicUrl = publicUrlData.publicUrl;

    // ✅ Save metadata to MongoDB
    const note = new Note({
      title,
      subject,
      category,
      fileUrl: publicUrl,
    });

    await note.save();

    // ✅ Delete the temp file after upload
    fs.unlinkSync(filePath);

    res.status(201).json({ msg: '✅ Note uploaded successfully!' });
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({ msg: '❌ Upload failed on server.' });
  }
});

module.exports = router;
