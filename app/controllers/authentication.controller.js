import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import e from "express";
import db from "../services/db.js";
import { sendVerificationEmail } from "../services/mail.service.js";

dotenv.config();

/**
 * authentication.controller.js
 * 
 * This file handles user authentication, registration, email verification, 
 * and preference saving for the application.
 * 
 */

/**
 * Register a new user in the database.
 * - Checks if the user already exists.
 * - Hashes the password before storing it.
 * - Sends a verification email with a JWT token.
 * - Stores the user in the database with `verified = false`.
 */
async function register(req, res) {
    const { username, email, password, first_name, last_name } = req.body;

    // Validate input
    if (!username || !email || !password || !first_name || !last_name) {
      return res.status(400).send({ status: 'error', message: 'Invalid body' });
    }

    try {
      // Check if the user already exists in the database
      const existingUsers = await db.query(
        "SELECT * FROM Users WHERE email = ? OR username = ?",
        [email, username]
      );
      if (existingUsers.length > 0) {
        return res.status(400).send({ status: 'error', message: 'User already exists' });
      }
  
      // Hash the password for secure storage
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(password, salt);
  
      // Generate a verification JWT token
      const tokenVerify = jsonwebtoken.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
  
      // Send verification email
      const mail = await sendVerificationEmail(email, tokenVerify);
      console.log("Mail sent");
      if (!mail.accepted || mail.accepted.length === 0) {
        return res.status(500).send({ status: 'error', message: 'Error sending email' });
      }
  
      // Insert the new user into the database with `verified = false`
      await db.query(
        `INSERT INTO Users (username, email, password_hash, first_name, last_name, verified)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [username, email, hash, first_name, last_name, false]
      );
  
      return res.status(201).send({ status: 'ok', message: `User ${username} created`, redirect: '/verification-email' });
    } catch (error) {
      console.error("Error in register:", error);
      return res.status(500).send({ status: 'error', message: 'Error creating user' });
    }
}

/**
 * Log in an existing user.
 * - Allows login with either email or username.
 * - Checks if the user exists and is verified.
 * - Validates the password.
 * - Generates a JWT token and stores it in an HTTP cookie.
 */
async function login(req, res) {
    const { identifier, password } = req.body;

    // Validate input
    if (!identifier || !password) {
      return res.status(400).send({ status: 'error', message: 'Invalid body' });
    }

    try {
      // Find the user in the database by email or username
      const usersFound = await db.query(
        "SELECT * FROM Users WHERE (email = ? OR username = ?) AND verified = ?",
        [identifier, identifier, true]
      );
      if (usersFound.length === 0) {
        return res.status(400).send({ status: 'error', message: 'Error Logging In (User not found or not verified)' });
      }

      const userToCheck = usersFound[0];
  
      // Validate the password using bcryptjs
      const loginCorrect = await bcryptjs.compare(password, userToCheck.password_hash);
      if (!loginCorrect) {
        return res.status(400).send({ status: 'error', message: 'Error Logging In (Wrong password)' });
      }
  
      // Generate a JWT token for session management
      const token = jsonwebtoken.sign(
        { email: userToCheck.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
  
      // Store the JWT token in a cookie
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

/**
 * Verifies the user account when they click the verification link in their email.
 * - Extracts the token from the URL.
 * - Decodes and verifies the token.
 * - Updates the user's `verified` status in the database.
 * - Generates a new JWT token for the now-verified user.
 */
async function verifyAccount(req, res) {
    try {
      if (!req.params.token) {
        return res.redirect("/");
      }

      // Decode the verification token
      const decoded = jsonwebtoken.verify(req.params.token, process.env.JWT_SECRET);
      if (!decoded || !decoded.email) {
        return res.redirect("/").send({ status: 'error', message: 'Invalid token' });
      }

      // Update the user in the database to mark them as verified
      await db.query(
        "UPDATE Users SET verified = ? WHERE email = ?",
        [true, decoded.email]
      );

      // Generate a new JWT token for the verified user
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

/**
 * Checks whether the logged-in user is verified.
 * - Reads the JWT token from the cookies.
 * - Verifies the token and extracts the user's email.
 * - Queries the database to check if the user is verified.
 */
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

/**
 * Saves the user's preferences in the database.
 * - Updates the user's reading frequency.
 * - Deletes any previously saved genres.
 * - Inserts the new selected genres.
 */
async function savePreferences(req, res) {
  try {
    const user = res.locals.user; 
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Not authorized' });
    }

    const { frequency, genres } = req.body;

    // Update the user's frequency preference
    await db.query(
      "UPDATE Users SET discovery_frequency = ? WHERE user_id = ?",
      [frequency, user.user_id]
    );

    // Delete previously saved genres
    await db.query(
      "DELETE FROM User_Genres WHERE user_id = ?",
      [user.user_id]
    );

    // Insert new genres
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

export const methods = {
    login,
    register,
    verifyAccount,
    checkVerificationStatus,
    savePreferences
};
