var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('admin/index', { title: 'Admin Index' });
});

router.get('/viewusers', function(req, res) {
    "use strict";
    var userModel, users;
    userModel = require('../models/usermodel');
    res.render('admin/viewUsers', {
        "users" : userModel.allUsers
    });
});

module.exports = router;
