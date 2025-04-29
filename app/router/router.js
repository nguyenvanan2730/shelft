const authentication = require('../controllers/authentication.controller.js').methods;
const authorization = require('../middlewares/authorization.js').methods;
const router = require("express").Router();
const db = require('../services/db');
const { getDbTestResults } = require('../services/dbTest');
const { getBooks, getBookGenres } = require('../services/homepage');
const { getUserLibraryBooks, getUserReviews, getUserRatings, getUserBookCount, getUserGenres } = require('../services/user');
const passport = require('passport');
const jsonwebtoken = require('jsonwebtoken');
const { sendVerificationEmail } = require('../services/mail.service');
const { getBookById } = require('../services/bookIdPage.js');
const { submitReview } = require('../services/detail.js');
const { addToLibrary, removeFromLibrary } = require('../services/bookmark.js');

// ========================
// PAGE ROUTES
// ========================
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

router.get('/contact', async (req, res, next) => {
    const user = await authorization.checkCookie(req);
    const isLoggedIn = !!user;
    res.render('page/contact', { isLoggedIn, user });
});

router.get('/verification-email', async (req, res, next) => {
    const user = await authorization.checkCookie(req);
    const isLoggedIn = !!user;
    res.render('page/verification-email', { isLoggedIn, user });
});

router.get('/new-user-form', async (req, res, next) => {
    const user = await authorization.checkCookie(req);
    const isLoggedIn = !!user;
    res.render('page/new-user-form', { isLoggedIn, user });
});

router.get('/login', authorization.onlyPublic, (req, res, next) => {
    res.render('page/login');
    next();
});

router.get('/register', authorization.onlyPublic, (req, res, next) => {
    res.render('page/register');
    next();
});

router.get('/user', authorization.onlyRegistered, async (req, res, next) => {
    try {
        const user = await authorization.checkCookie(req);
        const isLoggedIn = !!user;
        
        console.log("User logged in:", isLoggedIn);
        console.log("User info:", user);
        
        if (!isLoggedIn) {
            return res.redirect('/login');
        }
        
        // Fetch user's library books, reviews, ratings, and book count
        const libraryBooks = await getUserLibraryBooks(user.user_id);
        const reviews = await getUserReviews(user.user_id);
        const ratings = await getUserRatings(user.user_id);
        const bookCount = await getUserBookCount(user.user_id);
        const userGenres = await getUserGenres(user.user_id);
        
        // Debug: Check image paths
        console.log("Images directory structure check:");
        console.log("First book cover path:", libraryBooks.length > 0 ? `/images/${libraryBooks[0].cover_image}` : "No books found");
        
        // Update user object with book count and genres
        user.bookCount = bookCount;
        user.genres = userGenres;
        
        // Format dates for display
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
        };
        
        // Format dates for library books, reviews, and ratings
        libraryBooks.forEach(book => {
            book.formattedDate = formatDate(book.added_at);
        });
        
        reviews.forEach(review => {
            review.formattedDate = formatDate(review.created_at);
        });
        
        ratings.forEach(rating => {
            rating.formattedDate = formatDate(rating.created_at);
        });
        
        // Debug: Log template variables
        console.log("Rendering user page with data:");
        console.log("Number of library books:", libraryBooks.length);
        console.log("Number of reviews:", reviews.length);
        console.log("Number of ratings:", ratings.length);
        console.log("User genres:", userGenres);
        
        res.render('page/user', { 
            isLoggedIn, 
            user,
            libraryBooks,
            reviews,
            ratings
        });
    } catch (err) {
        console.error("Error loading user profile:", err);
        res.status(500).render('page/error', { 
            message: "An error occurred while loading your profile",
            error: err
        });
    }
});

router.get('/privacy', async (req, res, next) => {
    const user = await authorization.checkCookie(req);
    const isLoggedIn = !!user;
    res.render('page/privacy', { isLoggedIn, user });
});

router.get('/terms', async (req, res, next) => {
    const user = await authorization.checkCookie(req);
    const isLoggedIn = !!user;
    res.render('page/terms', { isLoggedIn, user });
});

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

/** Post submit save book to libraries table */
router.post('/add-to-library', addToLibrary);

/** Post remove the book from user library */
router.post('/remove-from-library', removeFromLibrary);

/** Post submit review + rating from book detail page */
router.post('/submit-review', submitReview);

/**
 * API Routes
 */

// Checks if the user is verified
router.get('/api/check-verification', authentication.checkVerificationStatus);
router.post('/api/register', authentication.register);
router.post('/api/login', authentication.login);
router.get('/verify/:token', authentication.verifyAccount);
router.post('/api/save-preferences', authorization.onlyRegistered, authentication.savePreferences);
router.post('/api/request-password-reset', authentication.requestPasswordReset);
router.post('/api/reset-password/:token', authentication.resetPassword);

// Remove book from library
router.delete('/api/library/:bookId', authorization.onlyRegistered, async (req, res) => {
    try {
        const user = await authorization.checkCookie(req);
        const bookId = req.params.bookId;
        
        if (!user || !user.user_id) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        
        const query = 'DELETE FROM Libraries WHERE user_id = ? AND book_id = ?';
        await db.query(query, [user.user_id, bookId]);
        
        return res.json({ success: true, message: 'Book removed from library' });
    } catch (err) {
        console.error('Error removing book from library:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// ========================
// LOGOUT
// ========================
router.get('/logout', (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        sameSite: 'Strict'
    });

    console.log("✅ JWT cookie cleared, user logged out.");
    return res.redirect('/');
});

// ========================
// RESEND VERIFICATION EMAIL
// ========================
router.post('/api/resend-verification', async (req, res) => {
    try {
        const tempEmail = req.cookies.temp_email;

        if (!tempEmail) {
            return res.status(401).json({ message: 'Unauthorized: No temp email found' });
        }

        // Buscar el usuario no verificado
        const users = await db.query(
            "SELECT * FROM Users WHERE email = ? AND verified = ?",
            [tempEmail, false]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found or already verified' });
        }

        // Generar un nuevo token de verificación
        const token = jsonwebtoken.sign(
            { email: tempEmail },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Reenviar el email
        const mail = await sendVerificationEmail(tempEmail, token);
        console.log("📨 Re-sent email to:", tempEmail);

        if (!mail.accepted || mail.accepted.length === 0) {
            return res.status(500).json({ message: 'Failed to send email' });
        }

        return res.json({ message: 'Verification email resent successfully' });
    } catch (error) {
        console.error("❌ Error resending verification email:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/api/update-profile', authorization.onlyRegistered, async (req, res) => {
    try {
        const user = res.locals.user;
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Not authorized' });
        }

        const { first_name, last_name, genres, discovery_frequency } = req.body;

        // Update user's name
        await db.query(
            "UPDATE Users SET first_name = ?, last_name = ?, discovery_frequency = ? WHERE user_id = ?",
            [first_name, last_name, discovery_frequency, user.user_id]
        );

        // Update user's genres
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

        return res.json({ status: 'ok', message: 'Profile updated successfully' });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// ========================
// GOOGLE AUTH
// ========================
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/auth/google/callback', 
    (req, res, next) => {
        console.log("🔁 Google callback hit");
        next();
    },
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        console.log("✅ Authenticated. Redirecting to /set-session...");
        res.redirect('/set-session');
    }
);

// Intermediate route to set JWT and redirect safely
router.get('/set-session', async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            console.log("❌ No user in req.user");
            return res.redirect('/login');
        }

        const token = jsonwebtoken.sign(
            { email: user.email, verified: true },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.cookie('jwt', token, {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            path: '/',
            httpOnly: true,
            sameSite: 'Lax', // Lax mejora compatibilidad con redirecciones
            secure: process.env.NODE_ENV === 'production'
        });

        console.log("🍪 JWT cookie set. Delaying redirect to /user...");

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="refresh" content="1;url=/user" />
                <title>Redirecting...</title>
                <script>
                    // Refuerzo en caso de que el meta-refresh no funcione
                    setTimeout(() => {
                        window.location.href = '/user';
                    }, 1000);
                </script>
            </head>
            <body>
                <p style="text-align:center; font-family:sans-serif; margin-top: 20vh;">
                    Logging in... Redirecting to your profile ⏳
                </p>
            </body>
            </html>
        `);

    } catch (err) {
        console.error("❌ Error setting JWT in /set-session:", err);
        return res.status(500).send("Something went wrong while setting session.");
    }
});


// ========================
// RESET PASSWORD
// ========================
router.get('/reset-password/:token', async (req, res) => {
    try {
        const decoded = jsonwebtoken.verify(req.params.token, process.env.JWT_SECRET);
        if (!decoded || !decoded.email) {
            return res.status(400).send('Invalid token');
        }

        return res.render('page/reset-password', { email: decoded.email });
    } catch (error) {
        console.error("Error in GET /reset-password:", error);
        return res.status(400).send('Invalid or expired token');
    }
});

module.exports = router;
