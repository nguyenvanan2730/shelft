const authentication = require('../controllers/authentication.controller.js').methods;
const authorization = require('../middlewares/authorization.js').methods;
const router = require("express").Router();
const db = require('../services/db');
const { getDbTestResults } = require('../services/dbTest');
const { getBooks, getBookGenres } = require('../services/homepage');
const passport = require('passport');
const jsonwebtoken = require('jsonwebtoken');

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
    const user = await authorization.checkCookie(req);
    const isLoggedIn = !!user;
    res.render('page/user', { isLoggedIn, user });
    next();
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

// ========================
// API ROUTES
// ========================
router.get('/api/check-verification', authentication.checkVerificationStatus);
router.post('/api/register', authentication.register);
router.post('/api/login', authentication.login);
router.get('/verify/:token', authentication.verifyAccount);
router.post('/api/save-preferences', authorization.onlyRegistered, authentication.savePreferences);

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


module.exports = router;
