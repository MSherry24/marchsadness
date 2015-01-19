var express = require('express');
var router = express.Router();
var userDb = require('../models/usermodel');
var crypto = require('../custom_modules/crypto_methods');
var auth = require('../custom_modules/authorization_methods');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

router.get('/newuser', function(req, res) {
    res.render('public/newUser', { title: 'Create an Account' });
});

router.post('/newuser', function(req, res) {
    "use strict";
    console.log('req = ' + req.toString());
    console.log('req.body = ' + req.body.toString());
    console.log('req.body.password = ' + req.body.password);
    var passwordInfo, success;
    passwordInfo = crypto.createPassword(req.body.password);
    //submit to db
    success = userDb.createNewUser(req.body.username,
                          passwordInfo.hashedPassword.toString('hex'),
                          passwordInfo.salt,
                          req.body.firstname,
                          req.body.lastname);
    console.log('success = ' + success);
    if (success) {
        console.log('new user created: ' + req.body.username);
        res.location("/");
        res.redirect("/");
    } else {
        res.send("There was a problem adding this user to the database");
    }
});

router.get('/login', function (req, res) {
    "use strict";
    console.log('req = ' + Object.keys(req));
    console.log('req.user = ' + req.user);
    if (req.user) {
        // already logged in
        res.redirect('/');
    } else {
        // not logged in, show the login form, remember to pass the message
        // for displaying when error happens
        res.render('public/login', { title: 'Login' });
        // and then remember to clear the message
        req.session.messages = null;
    }
});

function loginPost(req, res, next) {
    "use strict";
    // ask passport to authenticate
    console.log('login post');
    console.log('req = ' + Object.keys(req));
    req.passport.authenticate('local', function (err, user, info) {
        if (err) {
            // if error happens
            console.log('auth err = ' + Object.keys(err));
            return next(err);
        }
        if (!user) {
            // if authentication fail, get the error message that we set
            // from previous (info.message) step, assign it into to
            // req.session and redirect to the login page again to display
            console.log('auth no user');
            //req.session.messages = info.message;
            return res.redirect('/users/login');
        }
        // if everything's OK
        req.logIn(user, function (err) {
            if (err) {
                console.log('auth login error');
                //req.session.messages = "Error";
                return next(err);
            }
            // set the message
            req.session.messages = "Login successfully";
            console.log('Login successfully');
            return res.redirect('/');
        });
    })(req, res, next);
}
router.post('/login', loginPost);


module.exports = router;
