const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport'); // For Google OAuth
// 🔹 Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({ name, email, password: hashedPassword, mobile });
    await user.save();

    res.status(201).json({ message: '✅ User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: '❌ Something went wrong', error: error.message });
  }
});

// 🔹 Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: '❌ Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '❌ Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ 
      message: '✅ Login successful', 
      token, 
      name: user.name, 
      userId: user._id 
    });
  } catch (error) {
    res.status(500).json({ message: '❌ Something went wrong', error: error.message });
  }
});

router.get('/current-user', (req, res) => {
    if (req.session.user) {
      res.status(200).json(req.session.user);
    } else {
      res.status(401).json({ message: 'No user logged in' });
    }
  });

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


// Google OAuth Callback Route
router.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: 'http://localhost:5173/login',
    }),
    (req, res) => {
      // Store user data in the session
      req.session.user = {
        email: req.user.email,
        name: req.user.name,
      };
  
      // Redirect to the dashboard without query parameters
      res.redirect('http://localhost:5173/dashboard');
    }
  );

module.exports = router;
