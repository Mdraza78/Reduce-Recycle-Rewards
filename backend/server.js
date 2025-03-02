require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./passport');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true,
}));
app.use(express.json());


// Session setup
app.use(session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // 1 hour
      sameSite: 'lax', // Helps with cross-origin requests
      httpOnly: true,  // Prevents JavaScript from accessing the cookie
    }, // Use `secure: true` only in production
  }));

  // Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Failed to connect to MongoDB', err));

// Routes
app.use('/api/users', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});