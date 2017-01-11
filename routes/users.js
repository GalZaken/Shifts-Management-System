var express = require('express');
var router = express.Router();

// PASSPORT CONFIGURATION:
var passport = require('passport');
var passportConfiguration = require('../config/passportConfiguration');
passportConfiguration(passport);

// GET Logout:
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/users/login');
});

// GET Login:
router.get('/login', function(req, res) {
    res.render('login', { title: 'Login' });
});

// POST Login:
router.post('/login', passport.authenticate('local-login', {failureRedirect:'/users/login'}), function(req, res) {
    res.redirect('/');
});

module.exports = router;