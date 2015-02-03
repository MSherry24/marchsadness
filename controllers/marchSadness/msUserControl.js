/**
 * Created by Mike on 1/23/2015.
 */

var msModel = require('../../models/marchSadnessModel');
var bcrypt = require('bcrypt-nodejs');

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
            res.status(500).json({ error: err }).end();
            console.log('error deleting team');
        } else if (team.owner[0].id !== req.user._id.id) {
                req.flash('cantdelete', 'You are not authorized to delete that team.');
                res.render('marchsadness/marchsadnesshome', {
                    message: req.flash('cantdelete'),
                    user: req.user
                });
        } else {
            team.remove(function(err) {
                res.status(200).end();
            });
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
                var allMsTeams = {};
                msTeam.map(function(x) {
                   allMsTeams[x._id] = x;
                });
                ['1','2','3','4','5','6'].map(function(i) {
                    team.rounds['round' + i + 'picks'] = [];
                    req.body['round' + i + 'picks'].map(function(x) {
                        if(x.id !== '') {
                            team.rounds['round' + i + 'picks'].push(allMsTeams[x.id]);
                        }
                    });
                });
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
            console.log('that team does not exist');
            req.flash('Error', 'There has been an error with your request');
            res.render('marchsadness/marchsadnesshome', {
                message: req.flash('Error'),
                user: req.user
            });
        } else if (team === null) {
            console.log('that team does not exist');
            req.flash('TeamDoesNotExist', 'The team you requested does not exist.');
            res.render('marchsadness/marchsadnesshome', {
                message: req.flash('TeamDoesNotExist'),
                user: req.user
                });
        } else {
            msModel.msTeam.find({}, function (err, msTeams) {
                var allTourneyTeams;
                allTourneyTeams = {};
                msTeams.map(function (msTeam) {
                    allTourneyTeams[msTeam._id] = msTeam;
                });
                res.render('marchsadness/user/viewSingleTeam', {
                    user: req.user,
                    team: team,
                    allTourneyTeams: allTourneyTeams,
                    owner: team.owner[0].id
                });
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
            req.flash('Error', 'There has been an error with your request');
            res.render('marchsadness/marchsadnesshome', {
                message: req.flash('Error'),
                user: req.user
            });
        }

        msModel.UserTeam.findOne({"_id" : teamId}, function (err, team) {
            if (err) {
                req.flash('Error', 'There has been an error with your request');
                res.render('marchsadness/marchsadnesshome', {
                    message: req.flash('Error'),
                    user: req.user
                });
            } else if (team === null) {
                console.log('that team does not exist');
                req.flash('TeamDoesNotExist', 'The team you requested does not exist.');
                res.render('marchsadness/marchsadnesshome', {
                    message: req.flash('TeamDoesNotExist'),
                    user: req.user
                });
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

/*=================================
 * Create New League
 *=================================*/
exports.createNewLeague = function (req, res) {
    "use strict";
    var newLeague;
    newLeague = new msModel.MsLeague({
        manager: req.user._id,
        name: req.body.leaguename,
        password: generateHash(req.body.password),
        memberTeamOwners: [req.user._id]
    });
    newLeague.save(function() {
        res.status(200).redirect('/marchsadness');
    })
};

// generating a hash
 var generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
var validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

/*=================================
 * Render page that shows all teams for a single user
 *=================================*/
exports.getSingleUserLeagues = function (req, res) {
    "use strict";
    msModel.MsLeague.find({memberTeamOwners: req.user._id}, function (err, leagues) {
        if (!err) {
            res.render('marchsadness/user/viewMyLeagues', {
                user: req.user,
                leagues: leagues
            });
        }
    });
};

/*=================================
 * View a Single March Sadness Team
 *=================================*/
exports.getViewSingleLeague = function (req, res, leagueId) {
    "use strict";
    msModel.MsLeague.findOne({"_id" : leagueId}, function (err, league) {
        if (err) {
            console.log('that league does not exist');
            req.flash('Error', 'There has been an error with your request');
            res.render('marchsadness/marchsadnesshome', {
                message: req.flash('Error'),
                user: req.user
            });
        } else if (league === null) {
            console.log('that league does not exist');
            req.flash('LeagueDoesNotExist', 'The league you requested does not exist.');
            res.render('marchsadness/marchsadnesshome', {
                message: req.flash('TeamDoesNotExist'),
                user: req.user
            });
        } else {
            msModel.UserTeam.find({league: leagueId}, function (err, userTeams) {
                if (err) {
                    console.log(err);
                    res.status(500).end();
                }
                res.render('marchsadness/user/viewSingleLeague', {
                    user: req.user,
                    league: league,
                    teams: userTeams
                });
            });

        }
    });
};