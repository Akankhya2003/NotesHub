const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean,
});

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [optionSchema],
});

const quizSchema = new mongoose.Schema({
  course: String,
  semester: String,
  subject: String,
  questions: [questionSchema],
});

module.exports = mongoose.model('Quiz', quizSchema);
