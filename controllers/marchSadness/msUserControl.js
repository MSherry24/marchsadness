/**
 * Created by Mike on 1/23/2015.
 */

var msModel = require('../../models/marchSadnessModel');
var User = require('../../models/usermodel');
var bcrypt = require('bcrypt-nodejs');

/*=================================
 * Create a March Sadness Team
 *=================================*/
exports.createNewTeam = function(req, res) {
    "use strict";
    var newTeam;
    newTeam = new msModel.UserTeam(
        {
            owner: req.user._id,
            name: req.body.teamname || req.params.teamname,
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
            res.redirect('back');
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
                res.render('marchsadness/index', {
                    message: req.flash('cantdelete'),
                    user: req.user,
                    ballots: req.userBallots,
                    leagues: req.userLeagues
                });
        } else {
            team.remove(function(err) {
                res.status(200).end();
            });
        }
    });
};

/*=================================
 * Save Changes to a March Sadness Ballot
 *=================================*/
exports.saveBallot = function (req, res, teamId) {
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
                msTeam.map(function (x) {
                   allMsTeams[x._id] = x;
                });
                msModel.MsConfig.findOne({}, function (err, config) {
                    ['1', '2', '3', '4', '5', '6'].map(function (i) {
                        if (!config.roundStarted["round" + i]) {
                            if (req.body['round' + i + 'picks']) {
                                team.rounds['round' + i + 'picks'] = [];
                                req.body['round' + i + 'picks'].map(function (x) {
                                    if (x && x !== '') {
                                        team.rounds['round' + i + 'picks'].push(allMsTeams[x]);
                                    }
                                });
                            }
                        }
                    });
                    team.save(function (err) {
                        if (err) {
                            console.log('error appending to team' + err);
                        }
                        res.status(200).end();
                    });
                });
            });
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
            //console.log('that team does not exist');
            req.flash('Error', 'There has been an error with your request');
            res.render('marchsadness/index', {
                message: req.flash('Error'),
                user: req.user,
                ballots: req.userBallots,
                leagues: req.userLeagues
            });
        } else if (team === null) {
            console.log('that team does not exist');
            req.flash('TeamDoesNotExist', 'The team you requested does not exist.');
            res.render('marchsadness/index', {
                message: req.flash('TeamDoesNotExist'),
                user: req.user,
                ballots: req.userBallots,
                leagues: req.userLeagues
                });
        } else {
            User.findById(team.owner[0], function (err, owner) {
                msModel.MsConfig.findOne({}, function (err, config) {
                    msModel.msTeam.find({}, function (err, msTeams) {
                        var allTourneyTeams = {};
                        msTeams.sort(teamSort);
                        msTeams.map(function (msTeam) {
                            allTourneyTeams[msTeam._id] = msTeam;
                        });
                        res.render('marchsadness/user/viewSingleTeam', {
                            config: config,
                            user: req.user,
                            team: team,
                            teamString: JSON.stringify(team),
                            allTourneyTeams: allTourneyTeams,
                            msTeamsString: JSON.stringify(allTourneyTeams),
                            msTeams: msTeams,
                            owner: owner,
                            userIsOwner: req.user._id.id === owner._id.id,
                            ballots: req.userBallots,
                            leagues: req.userLeagues
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
    msModel.UserTeam.findOne({"_id": teamId}, function (err, team) {
        if (err) {
            req.flash('Error', 'There has been an error with your request');
            res.render('marchsadness/index', {
                message: req.flash('Error'),
                user: req.user,
                ballots: req.userBallots,
                leagues: req.userLeagues
            });
        }
        msModel.UserTeam.findOne({"_id": teamId}, function (err, team) {
            if (err) {
                req.flash('Error', 'There has been an error with your request');
                res.render('marchsadness/index', {
                    message: req.flash('Error'),
                    user: req.user,
                    ballots: req.userBallots,
                    leagues: req.userLeagues
                });
            } else if (team === null) {
                console.log('that team does not exist');
                req.flash('TeamDoesNotExist', 'The team you requested does not exist.');
                res.render('marchsadness/index', {
                    message: req.flash('TeamDoesNotExist'),
                    user: req.user,
                    ballots: req.userBallots,
                    leagues: req.userLeagues
                });
            } else {
                User.findById(team.owner[0], function (err, owner) {
                    msModel.MsConfig.findOne({}, function (err, config) {
                        msModel.msTeam.find({}, function (err, msTeams) {
                            var allTourneyTeams;
                            allTourneyTeams = {};
                            msTeams.map(function (msTeam) {
                                allTourneyTeams[msTeam._id] = msTeam;
                            });
                            if (!err && config !== null) {
                                res.render('marchsadness/user/makeTeamSelections', {
                                    config: config,
                                    msTeamsString: JSON.stringify(allTourneyTeams),
                                    msTeams: allTourneyTeams,
                                    teamString: JSON.stringify(team),
                                    team: team,
                                    user: req.user,
                                    owner: team.owner[0].id,
                                    userIsOwner: req.user._id.id === owner._id.id,
                                    ballots: req.userBallots,
                                    leagues: req.userLeagues
                                });
                            } else {

                                res.status(500).end();
                            }
                        });
                    });
                })
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
        memberTeamOwners: [req.user._id],
        ballots: req.userBallots,
        leagues: req.userLeagues
    });
    newLeague.save(function() {
        res.status(200).redirect('/marchsadness/newLeagueConfirm/' + newLeague._id);
    })
};

// generating a hash
 var generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/*=================================
 * View a Single March Sadness League
 *=================================*/
exports.getViewSingleLeague = function (req, res, leagueId, message) {
    "use strict";
    var inLeague, leagueManager, leagueOwnerIdToFirstName;
    msModel.MsLeague.findOne({"_id": leagueId}, function (err, league) {
        inLeague = league.memberTeamOwners.indexOf(req.user._id) !== -1;
        leagueManager = league.manager.indexOf(req.user._id) !== -1;

        if (err) {
            console.log('that league does not exist');
            req.flash('Error', 'There has been an error with your request');
            res.render('marchsadness/index', {
                message: req.flash('Error'),
                user: req.user,
                ballots: req.userBallots,
                leagues: req.userLeagues
            });
        } else if (league === null) {
            console.log('that league does not exist');
            req.flash('LeagueDoesNotExist', 'The league you requested does not exist.');
            res.render('marchsadness/index', {
                message: req.flash('TeamDoesNotExist'),
                user: req.user,
                ballots: req.userBallots,
                leagues: req.userLeagues
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
                User.find({"_id": { $in: league.memberTeamOwners } }, function (err, teamOwners) {
                    if (!err && teamOwners) {
                        leagueOwnerIdToFirstName = {};
                        teamOwners.map(function (owner) {
                            leagueOwnerIdToFirstName[owner._id] = owner.firstName;
                        });
                        res.render('marchsadness/user/viewSingleLeague', {
                            message: req.flash('wrongpassword'),
                            user: req.user,
                            league: league,
                            inLeague: inLeague,
                            leagueManager: leagueManager,
                            teams: userTeams,
                            ballots: req.userBallots,
                            leagues: req.userLeagues,
                            leagueOwnerIdToFirstName: leagueOwnerIdToFirstName
                        });
                    }
                });
            });
        }
    });
}

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
                    teams: teams,
                    ballots: req.userBallots,
                    leagues: req.userLeagues
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
            league: league,
            ballots: req.userBallots,
            leagues: req.userLeagues
        });
    })
};

exports.getJoinALeague = function (req, res, message) {
    if (message === 'wrongleagueid') {
        req.flash('wrongleagueid', 'There was an error finding the id you entered. Please ensure the id is correct and try again.');
    }
    res.render('marchsadness/user/joinLeagueGeneric', {
        user: req.user,
        message: req.flash('wrongleagueid'),
        ballots: req.userBallots,
        leagues: req.userLeagues
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

var teamSort = function (a, b) {
    if (a.teamName < b.teamName) {
        return -1;
    }
    if (a.teamName > b.teamName) {
        return 1;
    }
    return 0;
};

exports.removeBallotFromLeague = function(req, res, teamId, leagueId) {
    "use strict";
    var leagueIndex;
    msModel.UserTeam.findOne({_id : teamId}, function(err, team) {
        if (err) {
            res.status(500).end();
        }
        if (req.user._id.id !== team._id) {
            res.status(500).end();
        }
        leagueIndex = team.leagues.indexOf(leagueId);
        team.leagues.splice(leagueIndex, 1);
        team.save(function(err) {
            if (err) {
                res.status(500).end();
            }
            res.status(200).end();
        });
    });
};