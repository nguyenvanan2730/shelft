const authentication = require('../controllers/authentication.controller.js').methods;
const authorization = require('../middlewares/authorization.js').methods;
const router = require("express").Router();
const db = require('../services/db');
const { getDbTestResults } = require('../services/dbTest');
const { getBooks, getBookGenres } = require('../services/homepage');
const { getBookById } = require('../services/bookIdPage.js');

/**
 * router.js
 * 
 * This file defines all the routes for the application, handling:
 * - Page rendering (e.g., homepage, login, user profile)
 * - API endpoints for authentication and user preferences
 * - Middleware protection for public and private routes
 */

/**
 * Home route - Loads the homepage.
 * - Checks if the user is logged in.
 * - Fetches book recommendations.
 * - If the user is logged in, retrieves their preferred book genres.
 */
router.get('/', async (req, res, next) => {
    const user = await authorization.checkCookie(req);
    const isLoggedIn = !!user;
    try {
        const results = await getBooks();
        let userBookGenresList = [];
        if (isLoggedIn) {
            userBookGenresList = await getBookGenres(user);
        }
        res.render('page/index', { isLoggedIn, user, data: results, userGenresBook: userBookGenresList });
    } catch (err) {
        next(err);
    }
});

/**
 * Renders the contact page.
 */
router.get('/contact', async (req, res, next) => {
    const user = await authorization.checkCookie(req);
    const isLoggedIn = !!user;
    res.render('page/contact', { isLoggedIn, user });
});

/**
 * Renders the email verification waiting page.
 */
router.get('/verification-email', async (req, res, next) => {
    const user = await authorization.checkCookie(req);
    const isLoggedIn = !!user;
    res.render('page/verification-email', { isLoggedIn, user });
});

/**
 * Renders the new user form page.
 */
router.get('/new-user-form', async (req, res, next) => {
    const user = await authorization.checkCookie(req);
    const isLoggedIn = !!user;
    res.render('page/new-user-form', { isLoggedIn, user });
});

/**
 * Renders the login page, only accessible to non-logged-in users.
 */
router.get('/login', authorization.onlyPublic, (req, res, next) => {
    res.render('page/login');
    next();
});

/**
 * Renders the registration page, only accessible to non-logged-in users.
 */
router.get('/register', authorization.onlyPublic, (req, res, next) => {
    res.render('page/register');
    next();
});

/**
 * Renders the user profile page, only accessible to logged-in users.
 */
router.get('/user', authorization.onlyRegistered, async (req, res, next) => {
    const user = await authorization.checkCookie(req);
    const isLoggedIn = !!user;
    res.render('page/user', { isLoggedIn, user });
    next();
});

/**
 * Database test route.
 */
router.get('/db_test', async (req, res, next) => {
    try {
        const results = await getDbTestResults();
        res.render('page/db_test', { results: results });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database query failed');
    }
    next();
});

/** Renders the individual book detail page */
router.get('/book/:id', async (req, res, next) => {
    //checks if the user has valid session cookie
    const user = await authorization.checkCookie(req);
    const isLoggedIn = !!user;
    const bookId = parseInt(req.params.id, 10);
    if (isNaN(bookId)) {
        console.error('Invalid book ID:', req.params.id);
        return res.status(400).send('Invalid ID');
    }

    try {
        //fetch the book details + reviews 
        const bookData = await getBookById(bookId);

        //if no book is found return a 404 not found response
        if (!bookData) {
            return res.status(404).send('Book not found');
        }

        //if the book exist render the details data 
        res.render('page/book-detail', {
            isLoggedIn,
            user,
            book: bookData.book,
            reviews: bookData.reviews
        });
    } catch (err) {
        // if an error occurs, pass to express error handler
        next(err);
    }
})

/** Renders the individual book detail page */
router.post('/rate-book', async(req, res) => {
    const user = await authorization.checkCookie(req);
    if (!user) {
        return res.status(401).json({message: 'You must be logged in to rate.'});
    }

    const { bookId, rating } = req.body;

    if (!bookId || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({message: 'Invalid book ID or rating'});
    }

    try {
        const now = new Date();

        //check if the user already rated this book
        const existing = await db.query(
            'SELECT * FROM Reviews WHERE user_id = ? AND book_id = ?',
            [user.user_id, bookId]
        );
        if (existing.length > 0) {
            //update existing rating
            await db.query(
                'UPDATE Reviews SET rating = ?, updated_at = ? WHERE user_id = ? AND book_id = ?',
                [rating, now, user.user_id, bookId]
            );
            return res.json({ message: 'Rating updated! '});
        } else{
            //insert new rating
            console.log(`Inserting new rating: user_id=${user.user_id}, book_id=${bookId}, rating=${rating}`);

            await db.query(
                `INSERT INTO Reviews (user_id, book_id, rating, created_at, updated_at)
                VALUES (?, ?, ?, NOW(), NOW())`,
                [user.user_id, bookId, rating]
            );
            return res.json({ message: 'Rating submitted!'});
        }
    } catch (err) {
        console.error('Error saving rating:', err);
        res.status(500).json({ message: 'Error saving rating. '});
    }
});

/**
 * API Routes
 */

// Checks if the user is verified
router.get('/api/check-verification', authentication.checkVerificationStatus);

// Registers a new user
router.post('/api/register', authentication.register);

// Logs in an existing user
router.post('/api/login', authentication.login);

// Verifies a user's email using a token
router.get('/verify/:token', authentication.verifyAccount);

// Saves user preferences (genres & frequency), only accessible to logged-in users
router.post('/api/save-preferences', authorization.onlyRegistered, authentication.savePreferences);

/**
 * Logs out the user by clearing the JWT cookie.
 */
router.get('/logout', (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(0), // Expire immediately
        path: '/',
        httpOnly: true,
        sameSite: 'Strict'
    });

    console.log("✅ JWT cookie cleared, user logged out.");
    return res.redirect('/');
});

module.exports = router;
