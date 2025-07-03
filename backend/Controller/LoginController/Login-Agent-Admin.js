const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../Model/Login-Ag-Ad');
const verifyCaptcha = require('../utils/verifyCaptcha');
require('dotenv').config();

// POST: Login API
router.post('/login', async (req, res) => {
  const { username, password} = req.body;

  // Validate input fields
  if (!username || !password ) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {

    // Validate captcha
    const isCaptchaValid = await verifyCaptcha(captcha);
    if (!isCaptchaValid) {
      return res.status(400).json({ message: 'Invalid captcha.' });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Generate JWT token
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } 

  catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;