/**
 * Created by mikesherry24 on 1/1/15.
 */
var express = require('express');
var router = express.Router();
var msModel = require('../models/marchSadnessModel');
var blog = require('../models/blogModel');
var msAdminControl = require('../controllers/marchSadness/msAdmin');
var msUserControl = require('../controllers/marchSadness/msUserControl');
var authMain = require('../controllers/auth/authMain');


/********************************************** ADMIN CODE ***************************************/
/* GET home page. */
router.get('/', function(req, res) {
    res.render('marchsadness/marchsadnesshome',
        {
            title: 'March Sadness',
            user : req.user,
            message: req.flash('TeamDoesNotExist')
        });
});

/*=================================
 * Render the March Sadness Admin Page
 *=================================*/
router.get('/admin', authMain.isAdmin, function (req, res) {
    "use strict";
    res.render('marchsadness/admin/adminHome',
        {
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
            midwest: regions.midwest,
            south: regions.south,
            east: regions.east,
            west: regions.west,
            title: 'Admin - Update Team Names',
            user: req.user
        });
    });
});

router.post('/admin/updateNames', authMain.isAdmin, function(req, res) {
    "use strict";
    msAdminControl.updateNames(req, res);
});


/*=================================
 * View Update NCAA Team's Missed Shots Page
 *=================================*/
var getUpdateTeamScores = function (req, res) {
    "use strict";
    msAdminControl.getTeamsByRegion(function (regions) {
        res.render('marchsadness/admin/updateTeamScores', {
            midwest: regions.midwest,
            south: regions.south,
            east: regions.east,
            west: regions.west,
            title: 'Admin - Update Team Scores',
            user: req.user
        });
    });
};
router.get('/admin/updateTeamScores', authMain.isAdmin, getUpdateTeamScores);

/*=================================
 * Update scores for all users
 *=================================*/
router.post('/admin/updateUserScores', authMain.isAdmin, function (req, res) {
    "use strict";
    msAdminControl.updateUserScores(req, res);
});


/*=================================
 * View Single Team Score Update Page
 *=================================*/
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
 * Mark Rounds as Started
 *=================================*/
router.get('/admin/markRoundsAsStarted', authMain.isAdmin, function (req, res) {
    "use strict";
    var rounds;
    msModel.MsConfig.findOne({}, function (err, config) {
        rounds = [
            config.roundStarted.round1,
            config.roundStarted.round2,
            config.roundStarted.round3,
            config.roundStarted.round4,
            config.roundStarted.round5,
            config.roundStarted.round6
        ];
        if (err) {
            res.status(404).end();
        } else {
            res.render('marchsadness/admin/markRoundsAsStarted', {
                config: rounds,
                user: req.user
            });
        }
    });
});

router.post('/admin/markRoundsAsStarted', authMain.isAdmin, function (req, res) {
    msAdminControl.markRoundsAsStarted(req, res);
});

/*=================================
 * Manage Blog
 *=================================*/

router.get('/admin/manageBlog', authMain.isAdmin, function (req, res) {
    "use strict";
    var rounds;
    blog.BlogPost.find({}, function (err, blogPosts) {
        if (err) {
            res.status(404).end();
        } else {
            res.render('marchsadness/admin/manageBlog', {
                blogPosts: blogPosts,
                user: req.user
            });
        }
    });
});


/********************************************** USER CODE ***************************************/
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
router.post("/deleteteam/:team", authMain.isLoggedIn, function (req, res) {
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

/*=================================
 * Create a new League
 *=================================*/
router.get('/createnewleague', authMain.isLoggedIn, function (req, res) {
    "use strict";
    res.render('marchsadness/createNewLeague', {
        user: req.user
    });
});

router.post('/createnewleague', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.createNewLeague(req, res);
});

/*=================================
 * View a list of all of one user's leagues
 *=================================*/

router.get('/viewmyleagues', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.getSingleUserLeagues(req, res);
});

/*=================================
 * View a March Sadness League
 *=================================*/
router.get('/viewSingleleague/:leagueId/:message', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.getViewSingleLeague(req, res, req.params.leagueId, req.params.message);
});

router.get('/viewSingleleague/:leagueId', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.getViewSingleLeague(req, res, req.params.leagueId);
});

/*=================================
 * Add User's team to a league
 *=================================*/
router.get('/addTeamToLeague/:leagueId', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.getAddTeamToLeague(req, res, req.params.leagueId);
});

router.post('/addTeamToLeague/:leagueId/:teamId', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.postAddTeamToLeague(req, res, req.params.leagueId, req.params.teamId);
});

/*=================================
 * Add User's team to a league
 *=================================*/
router.get('/joinLeague/:leagueId', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.getJoinLeague(req, res, req.params.leagueId);
});

router.post('/joinLeague/:leagueId', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.postJoinLeague(req, res, req.params.leagueId);
});

router.get('/joinALeague', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.getJoinALeague(req, res);
});

router.get('/joinALeague/:message', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.getJoinALeague(req, res, req.params.message);
});

module.exports = router;

