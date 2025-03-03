require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./passport');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Debug log to check if .env is loaded correctly
console.log('MONGO_URI:', process.env.MONGO_URI);

// Ensure MONGO_URI is loaded correctly
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1); // Exit if MONGO_URI is undefined
}

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
      sameSite: 'lax',
      httpOnly: true,
    },
  }));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
