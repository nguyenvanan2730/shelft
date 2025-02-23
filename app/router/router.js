const router = require("express").Router();
const db = require('../services/db');
const { getDbTestResults } = require('../services/dbTest');

router.get('/', (req, res, next) => {
    res.render('page/index');
    next();
});
router.get('/contact', (req, res, next) => {
    res.render('page/contact');
    next();
});
router.get('/login', (req, res, next) => {
    res.render('page/login');
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

module.exports = router;