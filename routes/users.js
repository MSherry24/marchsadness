var express = require('express');
var router = express.Router();
var userDb = require('../models/usermodel');
var crypto = require('../custom_modules/crypto_methods');

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
                          passwordInfo.hashedPassword,
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

module.exports = router;
