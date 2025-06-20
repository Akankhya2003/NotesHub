const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

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
    // ✅ Updated line for Render compatibility
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
  });
