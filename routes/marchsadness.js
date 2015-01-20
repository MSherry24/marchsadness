/**
 * Created by mikesherry24 on 1/1/15.
 */
var express = require('express');
var router = express.Router();
var msModel = require('../models/marchSadnessModel');


/* GET home page. */
router.get('/', function(req, res) {
    res.render('marchsadness/marchSadnessHome', { title: 'March Sadness' });
});

router.get('/tourneyTeams', function(req, res) {
    res.render('marchsadness/tourneyTeams', {
        teams : msModel.getAllTourneyTeams,
        title : 'Tourney Teams'
    });
});

router.get('/admin', function (req, res) {
    "use strict";
    var masterBracket;
    masterBracket = msModel.getMasterBracket();
    if (masterBracket === undefined) {
        msModel.populateMasterBracket();
    }
    masterBracket = masterBracket === undefined ? msModel.getMasterBracket() : masterBracket;
    res.render('marchsadness/admin', {
        masterBracket : masterBracket,
        title : 'Admin'
    });
});

module.exports = router;