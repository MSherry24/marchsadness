var express = require('express');
var router = express.Router();
var passport = require('passport');
var authMain = require('../controllers/auth/authMain');
var userModel = require('../models/usermodel');


/* GET users listing. */
router.get('/', authMain.isLoggedIn, function(req, res) {
    res.render('users/profile', {
        user : req.user // get the user out of session and pass to template
    });
});

router.get('/profile', authMain.isLoggedIn, function(req, res) {
    res.render('users/profile', {
        user : req.user // get the user out of session and pass to template
    });
});

router.get('/signup', function(req, res) {
    res.render('users/signup', { title: 'Create an Account', message: req.flash('signupMessage') });
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
        res.redirect('/marchsadness/index');
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
    successRedirect : '/marchsadness/index', // redirect to the march sadness home
    failureRedirect : '/users/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// process the login form
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/marchsadness/index', // redirect to the secure profile section
    failureRedirect : '/users/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

/*
 * Password Reset
 */

router.get('/forgotPassword', function (req, res) {
    "use strict";
    res.render('users/forgotPassword', { message: [] });
});

router.get('/resetPassword/:userId/:verification', function (req, res) {
    "use strict";
    userModel.findById(req.params.userId, function (err, user) {
        if (err) {
            console.log(err);
            req.flash('errorReset', 'Err 003: There was an error resetting your password.  Please contact us if you are unable to reset your password');
            res.render('users/login', { title: 'Login', message: req.flash('errorReset') });
        } else if (!user) {
            console.log('user not found');
            res.status(500).redirect("/users/login");
            req.flash('errorReset', 'Err 004: There was an error resetting your password.  Please contact us if you are unable to reset your password');
            res.render('users/login', { title: 'Login', message: req.flash('errorReset') });
        } else if (req.params.verification === '') {
            console.log('incorrect validation code');
            req.flash('errorReset', 'Err 005: There was an error resetting your password.  Please contact us if you are unable to reset your password');
            res.render('users/login', { title: 'Login', message: req.flash('errorReset') });
        } else {
            req.flash();
            res.render('users/resetPassword', {
                user: user,
                verification: req.params.verification,
                message: []
            });
        }
    });
});

router.post('/forgotPassword', function (req, res) {
    "use strict";
    var emailAddress = req.body.email,
        nodemailer = require('nodemailer'),
        smtpTransport = require('nodemailer-smtp-transport'),
        transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
                user: 'failureleaguegame@gmail.com',
                pass: 'jssrxmxsxdqcrcyx'
            }
        })),
        emailBody = [],
        verificationKey = Math.random().toString(36).replace(/[^a-z]+/g, '');
    userModel.update({"local.email": emailAddress}, {"passwordReset": verificationKey}, function (err, userUpdated) {
        if (err) {
            console.log(err);
            res.status(500).redirect("/users/login");
        } else if (!userUpdated) {
            console.log('user not found');
            res.status(500).redirect("/users/login");
        } else {
            userModel.findOne({"local.email": emailAddress}, function (err, user) {
                if (err) {
                    console.log(err);
                    res.status(500).redirect("/users/login");
                } else if (!user) {
                    console.log('user not updated');
                    res.status(500).redirect("/users/login");
                } else {
                    emailBody.push('To reset your password, click this link: http://marchsadnesstournament.com/users/resetPassword/');
                    emailBody.push(user._id + '/');
                    emailBody.push(verificationKey);

                    transporter.sendMail({
                        from: 'failureleaguegame+passwordreset@gmail.com',
                        to: emailAddress,
                        subject: 'Reset Password',
                        text: emailBody.join('')
                    });
                    req.flash();
                    res.status(200).redirect('/users/login');
                }
            });
        }
    });
});


router.post('/resetPassword', function (req, res) {
    "use strict";
    if (req.body.verification === '' || !req.body.password) {
        req.flash('errorReset', 'Err 001: There was an error resetting your password.  Please contact us if you are unable to reset your password');
        res.status(500).end();
    }
    userModel.findOne({"_id" : req.body.userId}, function (err, user) {
        if (err) {
            console.log(err);
            res.status(500).end();
        } else if (!user) {
            console.log('user not updated');
            res.status(500).end();
        } else if (user.passwordReset !== req.body.verification) {
            console.log('user not updated');
            res.status(500).end();
        } else {
            userModel.update(
                {
                    "_id": req.body.userId,
                    "passwordReset" : req.body.verification
                },
                {
                    "passwordReset": '',
                    "local.password": user.generateHash(req.body.password)
                },
                {},
                function (err, updated) {
                    if (err || !updated) {
                        console.log(err);
                        req.flash('errorReset', 'Err 002: There was an error resetting your password.  Please contact us if you are unable to reset your password');
                        res.status(500).end();
                    } else {
                        req.flash();
                        res.status(200).redirect('/users/login');
                    }
                }
            );
        }
    });
});

module.exports = router;
