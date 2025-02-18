const router = require("express").Router();

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

module.exports = router;