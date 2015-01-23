/**
 * Created by mikesherry24 on 1/1/15.
 */
var express = require('express');
var router = express.Router();
var msModel = require('../models/marchSadnessModel');
var msController = require('../controllers/marchSadness/admin/msAdmin');
var authMain = require('../controllers/auth/authMain');


/* GET home page. */
router.get('/', function(req, res) {
    res.render('marchsadness/marchsadnesshome', { title: 'March Sadness' });
});

router.get('/admin/updateNames', authMain.isAdmin, function (req, res) {
    "use strict";
    var masterBracket, sixteenArray, north, south, east, west;
    msModel.getMasterBracket();
    masterBracket = msModel.masterBracket;
    sixteenArray = [1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16]
        .map(function (x) {
            return x.toString();
        });
    north = sixteenArray.map(function (e) {
        return masterBracket.northRegion['seed' + e];
    });
    south = sixteenArray.map(function (e) {
        return masterBracket.southRegion['seed' + e];
    });
    east = sixteenArray.map(function (e) {
        return masterBracket.eastRegion['seed' + e];
    });
    west = sixteenArray.map(function (e) {
        return masterBracket.westRegion['seed' + e];
    });
    res.render('marchsadness/admin/updateNames', {
        north: north,
        south: south,
        east: east,
        west: west,
        masterBracket : masterBracket,
        title : 'Admin - Update Names'
    });
});

router.post('/admin/updateNames', function(req, res) {
    "use strict";
    msController.updateNames(req, res);
});

var getUpdateTeamScores = function (req, res) {
    var masterBracket, sixteenArray, north, south, east, west;
    msModel.getMasterBracket();
    masterBracket = msModel.masterBracket;
    sixteenArray = [1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16]
        .map(function (x) {
            return x.toString();
        });
    north = sixteenArray.map(function (e) {
        return masterBracket.northRegion['seed' + e];
    });
    south = sixteenArray.map(function (e) {
        return masterBracket.southRegion['seed' + e];
    });
    east = sixteenArray.map(function (e) {
        return masterBracket.eastRegion['seed' + e];
    });
    west = sixteenArray.map(function (e) {
        return masterBracket.westRegion['seed' + e];
    });
    res.render('marchsadness/admin/updateTeamScores', {
        north: north,
        south: south,
        east: east,
        west: west,
        masterBracket : masterBracket,
        title : 'Admin - Update Team Scores'
    });
};
router.get('/admin/updateTeamScores', getUpdateTeamScores);

router.get('/admin/updateSingleTeam', function (req, res) {
    var masterBracket, request, teamInfo;
    msModel.getMasterBracket();
    masterBracket = msModel.masterBracket;
    teamInfo = masterBracket[req.param('region') + 'Region']['seed' + req.param('seed')];
    res.render('marchsadness/admin/updateSingleTeam', {
        region: req.param('region'),
        seed: req.param('seed'),
        teamInfo: teamInfo,
        masterBracket: masterBracket,
        title: 'Admin - Update Team Scores'
    });
});

router.post('/admin/updateSingleTeam', function(req, res) {
    msController.updateSingleTeam(req, res);
});

module.exports = router;

