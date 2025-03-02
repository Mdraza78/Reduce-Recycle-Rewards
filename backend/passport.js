const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
require('dotenv').config(); // Make sure to load environment variables

// Configure Google Strategy
passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/users/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });
          if (!user) {
            // Create a new user without a mobile number
            user = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              password: 'oauth_user', // Dummy password for OAuth users
              isOAuthUser: true, // Mark as OAuth user
            });
            await user.save();
          }
          return done(null, user);
        } catch (error) {
          console.error('Error during Google OAuth:', error);
          return done(error, null);
        }
      }
    )
  );

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.serializeUser((user, done) => {
  done(null, user.id); // Store the user's ID in the session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // Retrieve the user object from the database using the ID
  } catch (error) {
    done(error, null);
  }
});

passport.serializeUser((user, done) => {
  done(null, user.id); // Store the user's ID in the session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // Retrieve the user object from the database using the ID
  } catch (error) {
    done(error, null);
  }
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
