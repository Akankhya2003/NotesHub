const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Faculty = require('../models/faculty');
const router = express.Router();

// Register a new faculty (Optional, can be pre-created manually)
router.post('/register', async (req, res) => {
  const { name, email, password, assignedSubjects } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const faculty = new Faculty({ name, email, password: hashedPassword, assignedSubjects });
    await faculty.save();
    res.status(201).json({ msg: 'Faculty registered successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error registering faculty', error });
  }
});

// Faculty Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const faculty = await Faculty.findOne({ email });
    if (!faculty) return res.status(400).json({ msg: 'Faculty not found' });

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: faculty._id, subjects: faculty.assignedSubjects }, 'secretKey');
    res.json({ token, faculty });
  } catch (error) {
    res.status(500).json({ msg: 'Login error', error });
  }
});

module.exports = router;
