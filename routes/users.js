var express = require('express');
var router = express.Router();
var userDb = require('../models/usermodel');
var crypto = require('../custom_modules/crypto_methods');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

router.post('/newuser', function(req, res) {
    "use strict";
    var passwordInfo = crypto.createPassword(req.body.password);
    //submit to db
    userDb.createNewUser(req.body.userName,
                          passwordInfo.hashedPassword,
                          passwordInfo.salt,
                          req.body.firstName,
                          req.body.lastName);
});

module.exports = router;
