const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/auth');         // Optional: user login
const adminRoutes = require('./routes/admin');       // Upload notes
const noteRoutes = require('./routes/notes');        // Fetch notes
const facultyRoutes = require('./routes/facultyAuth'); // ✅ Faculty login/register

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Welcome route
app.get('/', (req, res) => {
  res.send('📚 Notes Hub Server is Running!');
});

// API Routes
app.use('/api/auth', authRoutes);         // User auth
app.use('/api/admin', adminRoutes);       // Admin/faculty upload
app.use('/api/notes', noteRoutes);        // Notes list
app.use('/api/faculty', facultyRoutes);   // ✅ Faculty register/login

// File download route
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

// Connect to MongoDB and start server
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
