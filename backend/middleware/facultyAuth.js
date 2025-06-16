const jwt = require('jsonwebtoken');
const Faculty = require('../models/faculty');

const facultyAuth = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ msg: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.faculty = await Faculty.findById(decoded.id).select('-password');
    if (!req.faculty) throw new Error();
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token, access denied' });
  }
};

module.exports = facultyAuth;
