const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// 🔹 Register a new user
router.post('/register', async (req, res) => {
    try {
      const { name, email, password, mobile } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt); // Hash the password
      const user = new User({ name, email, password: hashedPassword, mobile });
      await user.save();
  
      res.status(201).json({ message: '✅ User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: '❌ Something went wrong', error: error.message });
    }
  });

// 🔹 Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
  
      // Debugging logs
      console.log('Provided password:', password);
      console.log('Stored password hash:', user.password);
      console.log('Password match:', isMatch);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      req.session.user = { email,name: user.name }; // Store the email in the session
      
          // Add this line to log the session data
          console.log('Session after login:', req.session.user);
      res.status(200).json({
        message: 'Login successful',
        userId: user._id,
        name: user.name,
      });
    } catch (error) {
      console.error('Error during login: ', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Store user data in the session
      req.session.user = { email: user.email, name: user.name, userId: user._id };
  
      // Add this line to log the session data
      console.log('Session after login:', req.session.user);
  
      res.status(200).json({
        message: 'Login successful',
        userId: user._id,
        name: user.name,
      });
    } catch (error) {
      console.error('Error during login: ', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  router.get("/profile", async (req, res) => {
    try {
      // Retrieve user data from the session
      const userSession = req.session.user;
      if (!userSession) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
  
      // Fetch user data from the database
      const user = await User.findOne({ email: userSession.email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Send user data to the frontend
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  //Edit profile
  router.put('/profile', async (req, res) => {
    const { name, email, mobile } = req.body;  // Add 'mobile' here
  
    try {
      const userSession = req.session.user;
      if (!userSession) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
  
      const user = await User.findOneAndUpdate(
        { email: userSession.email },
        { name, email, mobile },  // Add 'mobile' here
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update session data
      req.session.user = { email: user.email, name: user.name };
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// 🔹 Get Current User
router.get('/current-user', (req, res) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401).json({ message: 'No user logged in' });
  }
});

// 🔹 Google OAuth Login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 🔹 Google OAuth Callback
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
  (req, res) => {
    req.session.user = { email: req.user.email, name: req.user.name };
    res.redirect('http://localhost:5173/dashboard');
  }
);

module.exports = router;
