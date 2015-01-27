/**
 * Created by Mike on 1/23/2015.
 */

var msModel = require('../../models/marchSadnessModel');

/*=================================
 * Render page that shows all teams for a single user
 *=================================*/
exports.getSingleUserTeams = function (req, res) {
    "use strict";
    msModel.UserTeam.find({owner: req.user._id}, function (err, teams) {
        if (!err) {
            res.render('marchsadness/user/viewMyTeams', {
                user: req.user,
                teams: teams
            });
        }
    });
};

/*=================================
 * Create a March Sadness Team
 *=================================*/
exports.createNewTeam = function(req, res) {
    "use strict";
    var newTeam;
    newTeam = new msModel.UserTeam(
        {
            owner: req.user._id,
            name: req.body.teamname,
            totalScore: 0,
            round1: {
                score: 0,
                team1: '',
                team2: '',
                team3: '',
                team4: '',
                team5: '',
                team6: ''
            },
            round2: {
                score: 0,
                team1: '',
                team2: '',
                team3: '',
                team4: '',
                team5: '',
                team6: ''
            },
            round3: {
                score: 0,
                team1: '',
                team2: '',
                team3: ''
            },
            round4: {
                score: 0,
                team1: '',
                team2: '',
                team3: ''
            },
            round5: {
                score: 0,
                team1: ''
            },
            round6: {
                score: 0,
                team1: ''
            }
        }
    );
    newTeam.save(function (err) {
        if (err) {
            console.log('err:' + err);
        } else {
            res.status(200).redirect("/marchsadness/viewmyteams");
        }
    });
};

/*=================================
 * Delete a March Sadness Team
 *=================================*/
exports.deleteTeam = function (req, res, teamId) {
    "use strict";
    msModel.UserTeam.findOne({"_id" : teamId}, function (err, team) {
        if (err) {
            res.json({ error: err });
            console.log('error deleting team');
        } else if (team.owner[0].id !== req.user._id.id) {
            res.json({ err: 'You are not the team owner'});
        } else {
            team.remove();
            res.json({ err: ''});
        }
    });
};

/*=================================
 * View a Single March Sadness Team
 *=================================*/
exports.getViewSingleTeam = function (req, res, teamId) {
    "use strict";
    msModel.UserTeam.findOne({"_id" : teamId}, function (err, team) {
        if (err) {
            res.status(404);
            console.log('error deleting team');
        } else {
            res.render('marchsadness/user/viewSingleTeam', {
                user: req.user,
                team: team,
                owner: team.owner[0].id
            });
        }
    });
};

/*=================================
 * Make Picks for a March Sadness Team
 *=================================*/
exports.getMakeTeamSelections = function (req, res, teamId) {
    "use strict";
    msModel.msTeam.find({}, function (err, msTeams) {
        var allTourneyTeams;
        allTourneyTeams = {};
        msTeams.map(function (team) {
            allTourneyTeams[team.region + team.seed] = team;
        });
        if (err) {
            console.log('getMakeTeamSelections - error getting tournament teams');
        }

        msModel.UserTeam.findOne({"_id" : teamId}, function (err, team) {
            if (err) {
                res.status(404);
                console.log('error deleting team');
            } else {
                res.render('marchsadness/user/makeTeamSelections', {
                    msTeams: allTourneyTeams,
                    user: req.user,
                    team: team,
                    owner: team.owner[0].id
                });
            }
        });
    });
};