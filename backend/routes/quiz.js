const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// POST: Upload quiz
router.post('/upload', async (req, res) => {
  try {
    const { course, semester, subject, questions } = req.body;
    const quiz = new Quiz({ course, semester, subject, questions });
    await quiz.save();
    res.status(201).json({ message: '✅ Quiz uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '❌ Failed to upload quiz' });
  }
});

// GET: Get quiz by course, semester, subject
router.get('/view', async (req, res) => {
  const { course, semester, subject } = req.query;

  try {
    const quiz = await Quiz.findOne({ course, semester, subject });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const studentView = {
      course: quiz.course,
      semester: quiz.semester,
      subject: quiz.subject,
      questions: quiz.questions.map(q => ({
        questionText: q.questionText,
        options: q.options.map(o => o.text)
      }))
    };

    res.json(studentView);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '❌ Failed to fetch quiz' });
  }
});

module.exports = router;
