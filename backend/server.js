// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const noteRoutes = require('./routes/notes');

// Express App
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve uploaded files statically (for direct PDF access if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Welcome Route
app.get('/', (req, res) => {
  res.send('📚 Notes Hub Server is Running!');
});

// Use API Routes
app.use('/api/auth', authRoutes);     // Auth routes (optional)
app.use('/api/admin', adminRoutes);   // Admin uploads
app.use('/api/notes', noteRoutes);    // Notes access

// Serve downloadable note files (e.g., /notes/filename.pdf)
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

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❗ Server Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// MongoDB Connection + Start Server
const PORT = process.env.PORT || 5000;
console.log("Trying to connect to:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch((error) => {
  console.error('❌ MongoDB connection failed:', error.message);
});
