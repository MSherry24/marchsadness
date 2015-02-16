/**
 * Created by Mike on 1/23/2015.
 */

var msModel = require('../../models/marchSadnessModel');
var User = require('../../models/usermodel');
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
            User.findById(team.owner[0], function (err, owner) {
                msModel.MsConfig.findOne({}, function(err, config) {
                    msModel.msTeam.find({}, function (err, msTeams) {
                        var allTourneyTeams;
                        allTourneyTeams = {};
                        msTeams.map(function (msTeam) {
                            allTourneyTeams[msTeam._id] = msTeam;
                        });
                        res.render('marchsadness/user/viewSingleTeam', {
                            config: config,
                            user: req.user,
                            team: team,
                            allTourneyTeams: allTourneyTeams,
                            owner: owner,
                            userIsOwner: req.user._id.id === owner._id.id
                        });
                    });
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
                msModel.MsConfig.findOne({}, function(err, config) {
                    if (!err && config !== null) {
                        res.render('marchsadness/user/makeTeamSelections', {
                            config: config,
                            msTeamsString: JSON.stringify(allTourneyTeams),
                            msTeams: allTourneyTeams,
                            teamString: JSON.stringify(team),
                            team: team,
                            user: req.user,
                            owner: team.owner[0].id
                        });
                    } else {
                        res.status(500).end();
                    }
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
 * View a Single March Sadness League
 *=================================*/
exports.getViewSingleLeague = function (req, res, leagueId, message) {
    "use strict";
    var inLeague, leagueManager;
    msModel.MsLeague.findOne({"_id" : leagueId}, function (err, league) {
        inLeague = league.memberTeamOwners.indexOf(req.user._id) !== -1;
        leagueManager = league.manager.indexOf(req.user._id) !== -1;
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
            msModel.UserTeam.find({leagues: leagueId}, function (err, userTeams) {
                if (err) {
                    console.log(err);
                    res.status(500).end();
                }
                if (message === 'wrongpassword') {
                    req.flash('wrongpassword', 'The league password you entered is incorrect.');
                }
                userTeams.sort(teamScoreComparitor).reverse();
                res.render('marchsadness/user/viewSingleLeague', {
                    message: req.flash('wrongpassword'),
                    user: req.user,
                    league: league,
                    inLeague: inLeague,
                    leagueManager: leagueManager,
                    teams: userTeams
                });
            });

        }
    });
};

var teamScoreComparitor = function(a,b) {
    if (a.totalScore < b.totalScore) {return -1}
    if (a.totalScore > b.totalScore) {return 1}
    return 0;
};

/*=================================
 * View the page where the user can add one of their teams to a league
 *=================================*/
exports.getAddTeamToLeague = function (req, res, leagueId) {
    msModel.UserTeam.find({owner: req.user._id}, function (err, teams) {
        if (err) {
            console.log(err);
            res.status(500).end();
        } else {
            msModel.MsLeague.findOne({_id: leagueId}, function(err, league) {
                if (err) {
                    console.log(err);
                    res.status(500).end();
                }
                res.render('marchsadness/user/addTeamToLeague', {
                    user: req.user,
                    league: league,
                    teams: teams
                });
            } )
        }
    })
};

exports.postAddTeamToLeague = function (req, res, leagueId, teamId) {
    msModel.UserTeam.findOne({_id: teamId}, function (err, userTeam) {
        if (err) {
            console.log(err);
            res.status(500).end();
        } else {
            userTeam.leagues.push(leagueId);
            userTeam.save(function(err) {
                if (err) {
                    res.status(500).end();
                } else {
                    res.status(200).end();
                }
            })
        }
    })
};

/*=================================
 * Join a league
 *=================================*/
exports.getJoinLeague = function (req, res, leagueId) {
    msModel.MsLeague.findOne({_id: leagueId}, function (err, league) {
        if (err) {
            console.log(err);
            res.status(500).end();
        }
        res.render('marchsadness/user/joinLeague', {
            user: req.user,
            league: league
        });
    })
};

exports.getJoinALeague = function (req, res, message) {
    if (message === 'wrongleagueid') {
        req.flash('wrongleagueid', 'There was an error finding the id you entered. Please ensure the id is correct and try again.');
    }
    res.render('marchsadness/user/joinLeagueGeneric', {
        user: req.user,
        message: req.flash('wrongleagueid')
    });
};

exports.postJoinLeague = function (req, res, leagueId) {
    msModel.MsLeague.findOne({_id: leagueId}, function (err, league) {
        if (err) {
            console.log(err);
            res.json({message: 'wrongleagueid'});
        } else if (league === null) {
            res.json({message: 'wrongleagueid'});
        } else if (bcrypt.compareSync(req.body.password, league.password)) {
            if (league.memberTeamOwners.indexOf(req.user._id) === -1) {
                league.memberTeamOwners.push(req.user._id);
            }
            league.save(function(err) {
                if (err) {
                    res.status(500).end();
                } else {
                    res.status(200).end();
                }
            })
        } else {
            res.json({message: 'wrongpassword'});
        }
    })
};