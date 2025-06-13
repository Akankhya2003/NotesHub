const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const noteRoutes = require('./routes/notes');

// Initialize Express App
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Default Route
app.get('/', (req, res) => {
  res.send('📚 Notes Hub Server is Running!');
});

// Use Routes
app.use('/api/auth', authRoutes);     // For login/signup (if implemented separately)
app.use('/api/admin', adminRoutes);   // Admin note upload
app.use('/api/notes', noteRoutes);    // User note access

// Error Handler Middleware (Optional but helpful)
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// Connect MongoDB and Start Server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch((error) => {
  console.error('❌ Failed to connect to MongoDB:', error);
});
