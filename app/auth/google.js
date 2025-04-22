import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import db from '../services/db.js';
import jsonwebtoken from 'jsonwebtoken';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails?.[0]?.value;
  const username = profile.displayName;
  const firstName = profile.name?.givenName || username;
  const lastName = profile.name?.familyName || 'Account';

  console.log("📥 Google login attempt:");
  console.log("🧑 Email:", email);
  console.log("🧑 Username:", username);
  console.log("🧑 First name:", firstName);
  console.log("🧑 Last name:", lastName);

  try {
    let user = await db.query("SELECT * FROM Users WHERE email = ?", [email]);

    if (user.length === 0) {
      console.log("🔍 User not found, creating new user...");

      // Make sure this matches your DB schema
      await db.query(
        `INSERT INTO Users (username, email, verified, first_name, last_name, password_hash) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [username, email, true, firstName, lastName, 'google_oauth']
      );

      user = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
      console.log("✅ New user created successfully.");
    } else {
      console.log("✅ User found in database.");
    }

    return done(null, user[0]);
  } catch (err) {
    console.error("❌ Error during Google authentication:", err);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    done(null, user[0]);
  } catch (err) {
    done(err, null);
  }
});
