const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/auth');           // Student login/signup
const adminRoutes = require('./routes/admin');         // Admin/faculty uploads notes
const noteRoutes = require('./routes/notes');          // Get notes
const facultyRoutes = require('./routes/facultyAuth'); // Faculty login/signup
const quizRoutes = require('./routes/quiz');           // Quiz upload/view

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static uploaded files with original filename support
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Welcome route
app.get('/', (req, res) => {
  res.send('📚 Notes Hub Server is Running!');
});

// API Routes
app.use('/api/auth', authRoutes);         // User auth
app.use('/api/admin', adminRoutes);       // Admin/faculty uploads notes
app.use('/api/notes', noteRoutes);        // Notes access
app.use('/api/faculty', facultyRoutes);   // Faculty login/register
app.use('/api/quiz', quizRoutes);         // Quiz upload and student view

// Download file by filename
app.get('/notes/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error("Download error:", err.message);
      res.status(404).send('❌ File not found');
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❗ Server Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
  });
