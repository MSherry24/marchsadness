var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    "use strict";
    res.render('index', {
        user: req.user,
        title: 'Failure League'
    });
});

module.exports = router;
