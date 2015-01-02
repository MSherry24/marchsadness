/**
 * Created by mikesherry24 on 1/1/15.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('marchsadness/marchSadnessHome', { title: 'March Sadness' });
});

module.exports = router;