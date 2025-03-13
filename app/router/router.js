const authentication = require('../controllers/authentication.controller.js').methods;
const authorization = require('../middlewares/authorization.js').methods;
const router = require("express").Router();
const db = require('../services/db');
const { getDbTestResults } = require('../services/dbTest');
const { getBooks } = require('../services/homepage');

router.get('/', async (req, res, next) => {
    const user = authorization.checkCookie(req);
    const isLoggedIn = !!user;
    try {
        const results = await getBooks();
        res.render('page/index', { data: results });
    } catch (err) {
        next(err);
    }
});

router.get('/contact', (req, res, next) => {
    res.render('page/contact');
    next();
});
router.get('/login', authorization.onlyPublic, (req, res, next) => {
    res.render('page/login');
    next();
});
router.get('/register', authorization.onlyPublic, (req, res, next) => {
    res.render('page/register');
    next();
});
router.get('/user', authorization.onlyRegistered, (req, res, next) => {
    res.render('page/user');
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

router.post('/api/register', authentication.register);
router.post('/api/login', authentication.login);
router.get('/verify/:token', authentication.verifyAccount);

module.exports = router;