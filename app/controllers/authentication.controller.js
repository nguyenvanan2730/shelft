import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import e from "express";
import db from "../services/db.js";
import { sendVerificationEmail } from "../services/mail.service.js";

dotenv.config();

/*
export const users = [{
    username: 'peremb',
    email: 'perette93@gmail.com',
    password: '$2b$05$XpQcALerFlQdbTMJopoJu..DVYX04lKunGRHVzi72iWnMLCBTCSye',
    verified: true
}]
*/

async function register(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send({ status: 'error', message: 'Invalid body' });
    }
    try {
      // Verify if the user already exists
      const existingUsers = await db.query(
        "SELECT * FROM Users WHERE email = ? OR username = ?",
        [email, username]
      );
      if (existingUsers.length > 0) {
        return res.status(400).send({ status: 'error', message: 'User already exists' });
      }
  
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(password, salt);
  
      // Generate the JWT
      const tokenVerify = jsonwebtoken.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
  
      const mail = await sendVerificationEmail(email, tokenVerify);
      console.log("Mail sent");
      if (!mail.accepted || mail.accepted.length === 0) {
        return res.status(500).send({ status: 'error', message: 'Error sending email' });
      }
  
      // Insert the user in the DB
      await db.query(
        `INSERT INTO Users (username, email, password_hash, verified)
         VALUES (?, ?, ?, ?)`,
        [username, email, hash, false]
      );
  
      return res.status(201).send({ status: 'ok', message: `User ${username} created`, redirect: '/' });
    } catch (error) {
      console.error("Error in register:", error);
      return res.status(500).send({ status: 'error', message: 'Error creating user' });
    }
  }
  
  async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ status: 'error', message: 'Invalid body' });
    }
    try {
      // Find the user in the DB
      const usersFound = await db.query(
        "SELECT * FROM Users WHERE email = ? AND verified = ?",
        [email, true]
      );
      if (usersFound.length === 0) {
        return res.status(400).send({ status: 'error', message: 'Error Logging In (User not found or not verified)' });
      }
      const userToCheck = usersFound[0];
  
      const loginCorrect = await bcryptjs.compare(password, userToCheck.password_hash);
      if (!loginCorrect) {
        return res.status(400).send({ status: 'error', message: 'Error Logging In (Wrong password)' });
      }
  
      // Generate the JWT
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
      // Update the user in the DB
      await db.query(
        "UPDATE Users SET verified = ? WHERE email = ?",
        [true, decoded.email]
      );
      return res.redirect('/login');
    } catch (error) {
      console.error("Error in verifyAccount:", error);
      return res.status(500).redirect("/");
    }
  }
  
  export const methods = {
    login,
    register,
    verifyAccount
}