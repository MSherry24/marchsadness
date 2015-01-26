/**
 * Created by mikesherry24 on 1/1/15.
 */
var express = require('express');
var router = express.Router();
var msModel = require('../models/marchSadnessModel');
var msAdminControl = require('../controllers/marchSadness/msAdmin');
var msUserControl = require('../controllers/marchSadness/msUserControl');
var authMain = require('../controllers/auth/authMain');


/* GET home page. */
router.get('/', function(req, res) {
    res.render('marchsadness/marchsadnesshome',
        {
            title: 'March Sadness',
            user : req.user
        });
});

/*=================================
 * Set the names of the teams in the tournament
 *=================================*/

router.get('/admin/updateNames', authMain.isAdmin, function (req, res) {
    "use strict";
    var masterBracket, sixteenArray, north, south, east, west;
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

router.post('/admin/updateNames', authMain.isAdmin, function(req, res) {
    "use strict";
    msAdminControl.updateNames(req, res);
});


/*=================================
 * Update NCAA Team's Missed Shots
 *=================================*/
var getUpdateTeamScores = function (req, res) {
    var masterBracket, sixteenArray, north, south, east, west;
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
router.get('/admin/updateTeamScores', authMain.isAdmin, getUpdateTeamScores);

router.get('/admin/updateSingleTeam', authMain.isAdmin, function (req, res) {
    var masterBracket, teamInfo;
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

router.post('/admin/updateSingleTeam', authMain.isAdmin, function(req, res) {
    msAdminControl.updateSingleTeam(req, res);
});

/*=================================
 * View All User's Teams
 *=================================*/
router.get('/viewmyteams', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.getSingleUserTeams(req, res);
});

/*=================================
 * Create a New March Sadness Team
 *=================================*/
router.get('/createnewteam', authMain.isLoggedIn, function (req, res) {
    "use strict";
    res.render('marchsadness/createNewTeam', {
        user: req.user
    });
});

router.post('/createnewteam', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.createNewTeam(req, res);
});

/*=================================
 * Delete a March Sadness Team
 *=================================*/
router.post('/deleteteam/:team', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.deleteTeam(req, res, req.params.team);
});

/*=================================
 * View a March Sadness Team
 *=================================*/
router.get('/viewSingleTeam/:teamId', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.getViewSingleTeam(req, res, req.params.teamId);
});


module.exports = router;

