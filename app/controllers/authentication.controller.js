import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import e from "express";
import db from "../services/db.js";
import { sendVerificationEmail } from "../services/mail.service.js";
import { sendPasswordResetEmail } from "../services/mail.service.js";

dotenv.config();

/**
 * Register a new user in the database.
 * - Checks if the user already exists.
 * - Hashes the password before storing it.
 * - Sends a verification email with a JWT token.
 * - Stores the user in the database with `verified = false`.
 * - Stores the email in a temporary cookie to allow resending the email.
 */
async function register(req, res) {
    const { username, email, password, first_name, last_name } = req.body;

    if (!username || !email || !password || !first_name || !last_name) {
      return res.status(400).send({ status: 'error', message: 'Invalid body' });
    }

    try {
      const existingUsers = await db.query(
        "SELECT * FROM Users WHERE email = ? OR username = ?",
        [email, username]
      );
      if (existingUsers.length > 0) {
        return res.status(400).send({ status: 'error', message: 'User already exists' });
      }
  
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(password, salt);
  
      const tokenVerify = jsonwebtoken.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
  
      const mail = await sendVerificationEmail(email, tokenVerify);
      console.log("📨 Mail sent");

      if (!mail.accepted || mail.accepted.length === 0) {
        return res.status(500).send({ status: 'error', message: 'Error sending email' });
      }

      await db.query(
        `INSERT INTO Users (username, email, password_hash, first_name, last_name, verified)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [username, email, hash, first_name, last_name, false]
      );

      // ✅ Guardar email en una cookie temporal (10 min)
      res.cookie('temp_email', email, {
        httpOnly: true,
        sameSite: 'Strict',
        path: '/',
        maxAge: 10 * 60 * 1000 // 10 minutos
      });

      return res.status(201).send({ 
        status: 'ok', 
        message: `User ${username} created`, 
        redirect: '/verification-email' 
      });

    } catch (error) {
      console.error("❌ Error in register:", error);
      return res.status(500).send({ status: 'error', message: 'Error creating user' });
    }
}

async function login(req, res) {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).send({ status: 'error', message: 'Invalid body' });
    }

    try {
      const usersFound = await db.query(
        "SELECT * FROM Users WHERE (email = ? OR username = ?) AND verified = ?",
        [identifier, identifier, true]
      );
      if (usersFound.length === 0) {
        return res.status(400).send({ status: 'error', message: 'Error Logging In (User not found or not verified)' });
      }

      const userToCheck = usersFound[0];
  
      const loginCorrect = await bcryptjs.compare(password, userToCheck.password_hash);
      if (!loginCorrect) {
        return res.status(400).send({ status: 'error', message: 'Error Logging In (Wrong password)' });
      }

      const token = jsonwebtoken.sign(
        { email: userToCheck.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        path: '/'
      };
  
      res.cookie('jwt', token, cookieOptions);
      return res.status(200).send({ status: 'ok', message: 'Logged in', redirect: '/user' });
    } catch (error) {
      console.error("Error in login:", error);
      return res.status(500).send({ status: 'error', message: 'Error logging in' });
    }
}

async function verifyAccount(req, res) {
    try {
      if (!req.params.token) {
        return res.redirect("/");
      }

      const decoded = jsonwebtoken.verify(req.params.token, process.env.JWT_SECRET);
      if (!decoded || !decoded.email) {
        return res.redirect("/").send({ status: 'error', message: 'Invalid token' });
      }

      await db.query(
        "UPDATE Users SET verified = ? WHERE email = ?",
        [true, decoded.email]
      );

      const newToken = jsonwebtoken.sign(
        { email: decoded.email, verified: true },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.cookie('jwt', newToken, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path: '/',
        httpOnly: true,
        sameSite: 'Strict'
      });

      return res.redirect('/new-user-form');
    } catch (error) {
      console.error("Error in verifyAccount:", error);
      return res.status(500).redirect("/");
    }
}

async function checkVerificationStatus(req, res) {
  try {
      const token = req.cookies.jwt;
      if (!token) {
          return res.json({ verified: false });
      }

      const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.email) {
          return res.json({ verified: false });
      }

      const users = await db.query("SELECT SQL_NO_CACHE verified FROM Users WHERE email = ?", [decoded.email]);
      if (users.length === 0) {
          return res.json({ verified: false });
      }

      console.log(`Verified status: ${users[0].verified}`);

      return res.json({ verified: users[0].verified });

  } catch (error) {
      console.error("Error checking verification status:", error);
      return res.json({ verified: false });
  }
}

async function savePreferences(req, res) {
  try {
    const user = res.locals.user; 
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Not authorized' });
    }

    const { frequency, genres } = req.body;

    await db.query(
      "UPDATE Users SET discovery_frequency = ? WHERE user_id = ?",
      [frequency, user.user_id]
    );

    await db.query(
      "DELETE FROM User_Genres WHERE user_id = ?",
      [user.user_id]
    );

    for (const genreId of genres) {
      await db.query(
        "INSERT INTO User_Genres (user_id, genre_id) VALUES (?, ?)",
        [user.user_id, genreId]
      );
    }

    return res.json({ status: 'ok', message: 'Preferences saved' });

  } catch (error) {
    console.error("Error saving preferences:", error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

/**
 * Sends a password reset email with a secure token link.
 */
async function requestPasswordReset(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if the user exists
    const users = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'No account with this email' });
    }

    const user = users[0];

    // Create a token with short expiry (e.g., 15 min)
    const token = jsonwebtoken.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Send password reset email
    await sendPasswordResetEmail(user.email, token);

    return res.json({ message: 'Password reset email sent' });

  } catch (err) {
    console.error('❌ Error in requestPasswordReset:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function resetPassword(req, res) {
  try {
      const { token } = req.params;
      const { password } = req.body;

      const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.email) {
          return res.status(400).json({ message: 'Invalid token' });
      }

      const salt = await bcryptjs.genSalt(10);
      const hashed = await bcryptjs.hash(password, salt);

      await db.query("UPDATE Users SET password_hash = ? WHERE email = ?", [hashed, decoded.email]);

      return res.json({ message: 'Password updated successfully' });
  } catch (err) {
      console.error("❌ Error in resetPassword:", err);
      return res.status(500).json({ message: 'Failed to reset password' });
  }
}

export const methods = {
    login,
    register,
    verifyAccount,
    checkVerificationStatus,
    savePreferences,
    requestPasswordReset,
    resetPassword,
};
