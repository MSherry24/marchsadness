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

router.get('/admin/updateNames', function (req, res) {
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

router.post('/admin/updateNames', function (req, res) {
    "use strict";
    var allTeams, sixteenArray, regionsArray, mb;
    allTeams = JSON.parse(req.body.allTeams);
    sixteenArray = [1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16]
        .map(function (x) {
            return x.toString();
        });
    regionsArray = ['north', 'south', 'east', 'west'];
    msModel.getMasterBracket();
    mb = msModel.masterBracket;
    regionsArray.map(function (region) {
        sixteenArray.map(function (e) {
            mb[region + 'Region']['seed' + e].teamName = allTeams[region + e];
        })
    });
    console.log('saving master bracket');
    mb.save();
    res.json({message: 'success'});
});

var updateTeamScores = function (req, res) {
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
router.get('/admin/updateTeamScores', updateTeamScores);

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

module.exports = router;

