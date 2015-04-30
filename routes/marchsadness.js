/**
 * Created by mikesherry24 on 1/1/15.
 */
var express = require('express');
var router = express.Router();
var msModel = require('../models/marchSadnessModel');
var blog = require('../models/blogModel');
var blogControl = require('../controllers/blog/blogControl');
var msAdminControl = require('../controllers/marchSadness/msAdmin');
var msUserControl = require('../controllers/marchSadness/msUserControl');
var authMain = require('../controllers/auth/authMain');

router.get('/rules', function(req, res) {
    res.render('marchsadness/rules',
        {
            user : req.user
        });
});

router.get('/about', function(req, res) {
    res.render('marchsadness/about',
        {
            user : req.user
        });
});

router.get('/blog', function(req, res) {
    blog.BlogPost.find({}).limit(5).sort({unixTimeStamp: -1, timeStamp: -1}).exec(function (err, blogPosts) {
        if (err) {
            console.log(err);
        }
        res.render('marchsadness/blogview',
            {
                blogPosts: blogPosts,
                user : req.user,
                showBody: false,
                previous: 5,
                next: ""
            });
    });
});

router.get('/blog/:offset', function(req, res) {
    blog.BlogPost.find({}).skip(req.params.offset).limit(5).sort({timestamp: -1}).exec(function (err, blogPosts) {
        var next = (parseInt(req.params.offset) - 5) < 0 ? "" : parseInt(req.params.offset) - 5,
            previous = blogPosts.length < 5 ? "" : (parseInt(req.params.offset) + 5);;
        if (err) {
            console.log(err);
        }
        res.render('marchsadness/blogview',
            {
                blogPosts: blogPosts,
                user : req.user,
                showBody: false,
                previous: previous,
                next: next
            });
    });
});

router.get('/blog/post/:postId', function(req, res) {
    blog.BlogPost.find({_id : req.params.postId}).exec(function (err, blogPosts) {
        if (err) {
            console.log(err);
        }
        res.render('marchsadness/blogview',
            {
                blogPosts: blogPosts,
                user : req.user,
                showBody: true,
                previous: "",
                next: ""
            });
    });
});


/********************************************** ADMIN CODE ***************************************/
/* GET home page. */
router.get('/', function(req, res) {
    "use strict";
    res.render('marchsadness/marchsadnesshome',
    {
        title: 'March Sadness',
        user: req.user,
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
 * Get the okay to email list
 *=================================*/

router.get('/admin/oktoemail', authMain.isAdmin, function (req, res) {
    "use strict";
    msAdminControl.getOkayToEmailList(function (emails) {
        res.render('marchsadness/admin/getEmailList',
            {
                user: req.user,
                emails: emails
            });
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
    blog.BlogPost.find({}).sort({timestamp: -1}).exec(function (err, blogPosts) {
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

/*=================================
 * Edit/Create Blog Post
 *=================================*/
router.get('/admin/blogPost', authMain.isAdmin, function (req, res) {
    "use strict";
    res.render('marchsadness/admin/blogPost', {
        user: req.user
    });
});

router.get('/admin/blogPost/:postId', authMain.isAdmin, function (req, res) {
    "use strict";
    blog.BlogPost.findOne({"_id": req.params.postId}, function (err, post) {
        if (err) {
            console.log(err);
        }
        res.render('marchsadness/admin/blogPost', {
            user: req.user,
            post: post
        });
    });
});

router.post('/admin/blogPost', authMain.isAdmin, function (req, res) {
    "use strict";
    if (req.body.postId) {
        blogControl.editPost(req, res);
    } else {
        blogControl.postNewBlog(req, res);
    }
});

router.post('/admin/deletePost', authMain.isAdmin, function (req, res) {
    "use strict";
    blogControl.deletePost(req, res);
});

/********************************************** USER CODE ***************************************/
/*=================================
 * User Index
 *=================================*/
router.get('/index', authMain.isLoggedIn, msModel.getTeamsAndLeagues, function (req, res) {
    "use strict";
    var leagueMap = {};
    req.userLeagues.map( function(league) {
        leagueMap[league._id] = league.name;
    });
    msModel.UserTeam.find({}).sort({totalScore: -1}).limit(10).exec(function (err, topTeams) {
        if (err) {
            console.log(err);
        }
        res.render('marchsadness/user/index', {
            user: req.user,
            leagues: req.userLeagues,
            ballots: req.userBallots,
            topTeams: topTeams,
            leagueMap: leagueMap
        });
    });
});

/*=================================
 * Create a New March Sadness Team
 *=================================*/
router.get('/createnewteam', authMain.isLoggedIn, msModel.getTeamsAndLeagues, function (req, res) {
    "use strict";
    res.render('marchsadness/createNewTeam', {
        user: req.user,
        ballots: req.userBallots,
        leagues: req.userLeagues
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
 * Save Ballot Picks for a single March Sadness Team
 *=================================*/
router.post('/saveBallot/:team', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.saveBallot(req, res, req.params.team);
});

/*=================================
 * View a March Sadness Team
 *=================================*/
router.get('/viewSingleTeam/:teamId', authMain.isLoggedIn, msModel.getTeamsAndLeagues, function (req, res) {
    "use strict";
    msUserControl.getViewSingleTeam(req, res, req.params.teamId);
});

/*=================================
 * Select Teams for a March Sadness Team
 *=================================*/
router.get('/makeTeamSelections/:teamId', authMain.isLoggedIn, msModel.getTeamsAndLeagues, function (req, res) {
    "use strict";
    msUserControl.getMakeTeamSelections(req, res, req.params.teamId);
});

/*=================================
 * Create a new League
 *=================================*/
router.get('/createnewleague', authMain.isLoggedIn, msModel.getTeamsAndLeagues, function (req, res) {
    "use strict";
    res.render('marchsadness/createNewLeague', {
        user: req.user,
        ballots: req.userBallots,
        leagues: req.userLeagues
    });
});

router.post('/createnewleague', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.createNewLeague(req, res);
});

router.get('/newLeagueConfirm/:leagueId', authMain.isLoggedIn, msModel.getTeamsAndLeagues, function (req, res) {
    "use strict";
    res.render('marchsadness/newLeagueConfirm', {
        user: req.user,
        ballots: req.userBallots,
        leagues: req.userLeagues,
        leagueId: req.params.leagueId
    });
});

/*=================================
 * View a March Sadness League
 *=================================*/
router.get('/viewSingleleague/:leagueId/:message', authMain.isLoggedIn, msModel.getTeamsAndLeagues, function (req, res) {
    "use strict";
    msUserControl.getViewSingleLeague(req, res, req.params.leagueId, req.params.message);
});

router.get('/viewSingleleague/:leagueId', authMain.isLoggedIn, msModel.getTeamsAndLeagues, function (req, res) {
    "use strict";
    msUserControl.getViewSingleLeague(req, res, req.params.leagueId);
});

router.post('/removeBallotFromLeague/:teamId/:leagueId', authMain.isLoggedIn, function (req, res) {
    msUserControl.removeBallotFromLeague(req, res, req.params.teamId, req.params.leagueId);
});

/*=================================
 * Add User's team to a league
 *=================================*/
router.get('/addTeamToLeague/:leagueId', authMain.isLoggedIn, msModel.getTeamsAndLeagues, function (req, res) {
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
router.get('/joinLeague/:leagueId', authMain.isLoggedIn, msModel.getTeamsAndLeagues, function (req, res) {
    "use strict";
    msUserControl.getJoinLeague(req, res, req.params.leagueId);
});

router.post('/joinLeague/:leagueId', authMain.isLoggedIn, function (req, res) {
    "use strict";
    msUserControl.postJoinLeague(req, res, req.params.leagueId);
});

router.get('/joinALeague', authMain.isLoggedIn, msModel.getTeamsAndLeagues, function (req, res) {
    "use strict";
    msUserControl.getJoinALeague(req, res);
});

router.get('/joinALeague/:message', authMain.isLoggedIn, msModel.getTeamsAndLeagues, function (req, res) {
    "use strict";
    msUserControl.getJoinALeague(req, res, req.params.message);
});

router.get('/globalRankings', authMain.isLoggedIn, msModel.getTeamsAndLeagues, function (req, res) {
    "use strict";
    msUserControl.getGlobalRankings(req, res);
});

module.exports = router;

