const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  assignedSubjects: [String] // e.g., ["MCA 1st Semester Java", "MCA 2nd Semester OS"]
});

module.exports = mongoose.model('Faculty', facultySchema);
