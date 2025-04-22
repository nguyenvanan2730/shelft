import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../services/db.js';

dotenv.config();

/**
 * authorization.js
 * 
 * This file contains middleware functions for handling user authentication and route access control.
 * 
 * These functions help manage user session validation and control access to different parts of the application.
 */

/**
 * Middleware that allows access only to public routes.
 * - If the user is logged in (has a valid cookie), they are redirected to the homepage ('/').
 * - If not logged in, they can proceed to the requested route.
 */
async function onlyPublic(req, res, next) {
  const user = await checkCookie(req);
  if (!user) return next(); // Proceed if the user is not logged in
  return res.redirect('/'); // Redirect logged-in users to the homepage
}

/**
 * Middleware that allows access only to registered (logged-in) users.
 * - If the user is authenticated, their data is stored in `res.locals.user` for later use.
 * - If the user is not authenticated, they are redirected to the login page.
 */
async function onlyRegistered(req, res, next) {
  const user = await checkCookie(req);
  if (user) {
    res.locals.user = user; // Store user data for use in other routes
    return next(); // Allow access to the requested route
  }
  return res.redirect('/login'); // Redirect to login if the user is not authenticated
}

/**
 * Helper function to check if the user has a valid authentication cookie.
 * - Extracts and verifies the JWT token from the request cookies.
 * - Decodes the token to get the user's email.
 * - Searches for the user in the database.
 * - Returns the user data if found, or `null` if the token is invalid or the user does not exist.
 */
async function checkCookie(req) {
  try {
    const token = req.cookies?.jwt;
    if (!token) return null;

    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

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
};
