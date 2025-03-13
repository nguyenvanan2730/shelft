import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../services/db.js';

dotenv.config();

async function onlyPublic(req, res, next) {
  const user = await checkCookie(req);
  if (!user) return next();
  return res.redirect('/');
}

async function onlyRegistered(req, res, next) {
  const user = await checkCookie(req);
  if (user) return next();
  return res.redirect('/login');
}

async function checkCookie(req) {
  try {
    if (!req.headers.cookie) return null;
    const rawCookie = req.headers.cookie.split(';').find(cookie => cookie.trim().startsWith('jwt='));
    if (!rawCookie) return null;
    const token = rawCookie.slice(4); // delete "jwt="
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    // Find the user in the DB
    const usersFound = await db.query("SELECT * FROM Users WHERE email = ?", [decoded.email]);
    if (usersFound.length === 0) return null;
    return usersFound[0];
  } catch (error) {
    console.error("Error in checkCookie:", error);
    return null;
  }
}

export const methods = {
    onlyRegistered,
    onlyPublic,
    checkCookie
}