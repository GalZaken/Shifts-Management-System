var express = require('express');
var router = express.Router();

var User = require('../models/user');
var bcrypt = require('bcryptjs');

// PASSPORT CONFIGURATION:
var passport = require('passport');
var passportConfiguration = require('../config/passportConfiguration');
passportConfiguration(passport);

// GET Logout:
router.get('/logout', function(req, res) {
    req.session.destroy();
    req.logout();
    res.redirect('/users/login');
});

// GET Login:
router.get('/login', function(req, res) {
    isAdminExist();
    // User.createAdminUser(); // If need to create admin User.
    res.render('login', { title: 'Login' });
});

// POST Login:
router.post('/login', passport.authenticate('local-login', {failureRedirect:'/users/login'}), function(req, res) {
    res.redirect('/');
});

router.get('/currentUser', function(req, res) {
    console.log('INSIDE USERS ROUTER - Handling GET /currentUser');

    var id = req.user._id;
    User.getUserById(id, function(err, docs) {
        if (err)
            console.log('ERROR: Get current user in users collection!');
        else
            res.status(200).json(docs);
    });
});

// GET Users List:
router.get('/usersList', function(req, res) {
    console.log('INSIDE USERS ROUTER - Handling GET /users/usersList');

    User.getUsersList(function(err, docs) {
        if (err)
            console.log('ERROR: Get UsersList from users collection!');
        else
            res.status(200).json(docs);
    });
});

// GET User by id:
router.get('/usersList/:id', function(req, res) {
    console.log('INSIDE USERS ROUTER - Handling GET /usersList/:id');

    var id = req.params.id;
    User.getUserById(id, function(err, docs) {
        if (err)
            console.log('ERROR: Get user from users collection!');
        else
            res.status(200).json(docs);
    });
});

router.post('/usersList', function(req, res) {
    console.log('INSIDE USERS ROUTER - Handling POST /users/usersList');

    var newUser = new User(req.body);
    User.createUser(newUser, function(err, docs) {
        if (err)
            console.log('ERROR: Save user in users collection!');
        else
            res.status(200).json(docs);
    });
});

router.delete('/usersList/:id', function (req, res) {
    console.log('INSIDE USERS ROUTER - Handling DELETE /users/usersList/:id');
    var id = req.params.id;
    User.removeUserById(id, function(err, docs) {
        if (err)
            console.log('ERROR: Remove user in users collection!');
        else
            res.status(200).json(docs);
    });
});

router.put('/usersList/:id', function(req, res) {
    console.log('INSIDE USERS ROUTER - Handling PUT /users/usersList/:id');
    var id = req.params.id;
    var updateUser = new User(req.body);

    User.updateUserById(id, updateUser, function(err, docs) {
        if (err)
            console.log('ERROR: Update user in users collection!');
        else
            res.status(200).json(docs);
    });
});

function isAdminExist() {
    console.log('INSIDE isAdminExist FUNCTION:');

    User.getUserByUsername('admin', function(err, docs) {
        if (err)
            console.log('ERROR: Get admin user from users collection!');
        else if (!docs) {
            console.log('Create Admin User');
            User.createAdminUser();
        }
        else {
            console.log('Admin User Is Already Exist!');
            return;
        }
    });
}

module.exports = router;