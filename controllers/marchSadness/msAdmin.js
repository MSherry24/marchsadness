/**
 * Created by Mike on 1/22/2015.
 */
var msModel = require('../../models/marchSadnessModel');
var User = require('../../models/usermodel');

exports.updateSingleTeam = function (req, res) {
    "use strict";
    var scores, rounds, roundScore, eliminated;
    eliminated = req.body.eliminated;
    scores = req.body.scores;
    msModel.msTeam.findOne({ "_id": req.params.teamId }, function (err, team) {
        if (err) {
            res.status(500).end();
        } else {
            team.scores = scores;
            team.totalScore = 0;
            rounds = ['1', '2', '3', '4', '5', '6'].map(function (e) {
                return 'round' + e.toString();
            });
            rounds.map(function (round) {
                roundScore =
                    team.scores[round].missed3 +
                    team.scores[round].missed2 * 2 +
                    team.scores[round].missedFT * 3;
                if (round === 'round3' || round === 'round4') {
                    roundScore *= 2;
                }
                if (round === 'round5' || round === 'round6') {
                    roundScore *= 3;
                }
                team.scores[round].score = roundScore;
                team.totalScore += roundScore;
            });
            team.eliminated = eliminated;
            team.save(function (err) {
                if (err) {
                    console.log('error saving team score');
                }
                res.status(200);
            });
        }
    });
};

var updateAllNames = function (apiNames, allTeamsMap, index, callback) {
    "use strict";
    if (index < apiNames.length) {
        msModel.msTeam.findOne({apiName: apiNames[index]}, function (err, result) {
            if (!err) {
                result.teamName = allTeamsMap[apiNames[index]];
                result.save(function (err) {
                    if (err) {
                        console.log('error saving ' + result.apiName);
                    }
                });
            }
            updateAllNames(apiNames, allTeamsMap, index + 1, callback);
        });
    } else {
        callback();
    }
};

exports.updateNames = function (req, res) {
    "use strict";
    var allTeamsMap, apiNames, sixteenArray, regionsArray, mb;
    apiNames = [];
    allTeamsMap = JSON.parse(req.body.allTeams);
    sixteenArray = [1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16]
        .map(function (x) {
            return x.toString();
        });
    regionsArray = ['midwest', 'south', 'east', 'west'];
    regionsArray.map(function (region) {
        sixteenArray.map(function (e) {
            apiNames.push(region + e);
        });
    });
    updateAllNames(apiNames, allTeamsMap, 0, function () {
        res.status(200).end();
    });
};

exports.getTeamsByRegion = function (callback) {
    "use strict";
    var midwest, south, east, west, regions;
    midwest = [];
    south = [];
    east = [];
    west = [];
    msModel.msTeam.find({}, function (err, teams) {
        if (!err) {
            var comparitor = function (a, b) {
                if (a.seed > b.seed) { return 1; }
                if (a.seed < b.seed) { return -1; }
                return 0;
            };
            teams.map(function (thisTeam) {
                if (thisTeam.region === 'midwest') {
                    midwest.push(thisTeam);
                } else if (thisTeam.region === 'south') {
                    south.push(thisTeam);
                } else if (thisTeam.region === 'east') {
                    east.push(thisTeam);
                } else {
                    west.push(thisTeam);
                }
            });
            midwest.sort(comparitor);
            south.sort(comparitor);
            east.sort(comparitor);
            west.sort(comparitor);
        }
        regions = {
            midwest: midwest,
            south: south,
            east: east,
            west: west
        };
        callback(regions);
    });
};

exports.updateUserScores = function (req, res) {
    "use strict";
    msModel.UserTeam.find({}, function (err, userTeams) {
        if (err) {
            console.log(err);
            res.status(500).end();
        } else {
            msModel.msTeam.find({}, function (msTeamErr, msTeams) {
                if (msTeamErr) {
                    console.log(msTeamErr);
                    res.status(500).end();
                } else {
                    var allMsTeams;
                    allMsTeams = {};
                    msTeams.map(function (singleMsTeam) {
                        allMsTeams[singleMsTeam._id] = singleMsTeam;
                    });
                    userTeams.map(function (singleUserTeam) {
                        var roundScore, userTotalScore;
                        userTotalScore = 0;
                        [1, 2, 3, 4, 5, 6].map(function (round) {
                            roundScore = 0;
                            singleUserTeam.rounds['round' + round + 'picks'].map(function (pickId) {
                                roundScore += allMsTeams[pickId].scores['round' + round].score;
                            });
                            singleUserTeam.scores['round' + round] = roundScore;
                            userTotalScore += roundScore;
                        });
                        singleUserTeam.totalScore = userTotalScore;
                        singleUserTeam.save();
                    });
                }
                res.status(200).end();
            });
        }
    });
};

exports.markRoundsAsStarted = function (req, res) {
    "use strict";
    msModel.MsConfig.findOne({}, function (err, config) {
        if (err) {
            console.log('error = ' + err);
        } else {
            config.roundStarted.round1 = req.body.round1;
            config.roundStarted.round2 = req.body.round2;
            config.roundStarted.round3 = req.body.round3;
            config.roundStarted.round4 = req.body.round4;
            config.roundStarted.round5 = req.body.round5;
            config.roundStarted.round6 = req.body.round6;
        }
        config.save(function (err) {
            if (err) {
                console.log('error = ' + err);
                res.status(500).end();
            } else {
                res.status(200).end();
            }
        });
    });
};

exports.getOkayToEmailList = function (callback) {
    "use strict";
    User.find({okToEmail: true}, function (err, usersToEmail) {
        if (!err) {
            var emails =  usersToEmail.map(function (user) {
                return user.local.email;
            });
            callback(emails);
        }
    });
};

exports.getAllUsers = function (callback) {
    "use strict";
    User.find({}, function (err, users) {
        if (!err) {
            callback(users);
        } else {
            callback();
        }
    });
};