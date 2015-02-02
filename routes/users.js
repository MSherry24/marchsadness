var express = require('express');
var router = express.Router();
var passport = require('passport');
var authMain = require('../controllers/auth/authMain');
var userModel = require('../models/usermodel');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

router.get('/signup', function(req, res) {
    res.render('users/signup', { title: 'Create an Account', message: req.flash('signupMessage') });
});

router.get('/profile', authMain.isLoggedIn, function(req, res) {
    res.render('users/profile', {
        user : req.user // get the user out of session and pass to template
    });
});

router.get('/profile/edit', authMain.isLoggedIn, function(req, res) {
    res.render('users/editProfile', {
        user : req.user // get the user out of session and pass to template
    });
});

router.post('/profile/edit', authMain.isLoggedIn, function(req, res) {
    userModel.findById(req.user._id, function (err, user) {
        if (err) {
            console.log('error');
            res.status(500).end();
        } else if (user === undefined) {
            req.flash("userNotFound", "Error finding the requested user/");
            res.render('/', {
                user: req.user, // get the user out of session and pass to template
                message: req.flash("userNotFound")
            });
        } else {
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.local.email = req.body.email;
            user.okToEmail = req.body.okToEmail;
            user.save(function (err) {
                if (err) {
                    console.log('err:' + err);
                } else {
                    res.status(200).redirect("/users/profile");
                }
            });
        }
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/login', function (req, res) {
    "use strict";
    if (req.isAuthenticated()) {
        // already logged in
        res.redirect('/marchsadness');
    } else {
        // not logged in, show the login form, remember to pass the message
        // for displaying when error happens
        res.render('users/login', { title: 'Login', message: req.flash('loginMessage') });
        // and then remember to clear the message
        req.session.messages = null;
    }
});

// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/marchsadness', // redirect to the march sadness home
    failureRedirect : '/users/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// process the login form
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/marchsadness', // redirect to the secure profile section
    failureRedirect : '/users/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

module.exports = router;
