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
            scores: {
                round1: 0,
                round2: 0,
                round3: 0,
                round4: 0,
                round5: 0,
                round6: 0
            },
            rounds: {
                round1picks: [],
                round2picks: [],
                round3picks: [],
                round4picks: [],
                round5picks: [],
                round6picks: []
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
 * Add a Selected Team to a March Sadness Team
 *=================================*/
exports.addPick = function (req, res, teamId) {
    "use strict";
    msModel.UserTeam.findOne({"_id" : teamId}, function (err, team) {
        if (err) {
            res.json({ error: err });
            console.log('error');
        } else if (team.owner[0].id !== req.user._id.id) {
            res.json({ err: 'You are not the team owner'});
        } else {
            msModel.msTeam.find({}, function (err, msTeam) {
                team.rounds.round1picks = [];
                team.rounds.round1picks.push(msTeam[0]);
                team.rounds.round1picks.push(msTeam[1]);
                team.rounds.round1picks.push(msTeam[2]);
                team.rounds.round1picks.push(msTeam[3]);
                team.rounds.round1picks.push(msTeam[4]);
                team.rounds.round1picks.push(msTeam[5]);
                team.save(function(err) {
                    if (err) {
                        console.log('error appending to team' + err);
                    }
                    res.status(200).end();
                })
            })
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
                    msTeamsString: JSON.stringify(allTourneyTeams),
                    msTeams: allTourneyTeams,
                    teamString: JSON.stringify(team),
                    team: team,
                    user: req.user,
                    owner: team.owner[0].id
                });
            }
        });
    });
};