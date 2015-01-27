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
    msAdminControl.getTeamsByRegion(function (regions) {
        res.render('marchsadness/admin/updateNames', {
            north: regions.north,
            south: regions.south,
            east: regions.east,
            west: regions.west,
            title: 'Admin - Update Team Scores'
        });
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
    msAdminControl.getTeamsByRegion(function (regions) {
        res.render('marchsadness/admin/updateTeamScores', {
            north: regions.north,
            south: regions.south,
            east: regions.east,
            west: regions.west,
            title: 'Admin - Update Team Scores'
        });
    });
};
router.get('/admin/updateTeamScores', authMain.isAdmin, getUpdateTeamScores);

router.get('/admin/updateSingleTeam/:teamId', authMain.isAdmin, function (req, res) {
    "use strict";
    msModel.msTeam.findOne({"_id": req.params.teamId}, function (err, team) {
        if (err) {
            res.status(404).end();
        } else {
            res.render('marchsadness/admin/updateSingleTeam', {
                teamInfo: team,
                title: 'Admin - Update Team Scores'
            });
        }
    });
});

router.post('/admin/updateSingleTeam/:teamId', authMain.isAdmin, function (req, res) {
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
 * Add a March Sadness Team
 *=================================*/
router.post('/addPick/:team', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.addPick(req, res, req.params.team);
});

/*=================================
 * View a March Sadness Team
 *=================================*/
router.get('/viewSingleTeam/:teamId', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.getViewSingleTeam(req, res, req.params.teamId);
});

/*=================================
 * Select Teams for a March Sadness Team
 *=================================*/
router.get('/makeTeamSelections/:teamId', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.getMakeTeamSelections(req, res, req.params.teamId);
});



module.exports = router;

