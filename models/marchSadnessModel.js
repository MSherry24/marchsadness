var mongoose = require('mongoose');
var db = mongoose.connection;
var msModel = {};

var userTeamSchema = new mongoose.Schema({
    owner: [{type: mongoose.Schema.ObjectId, ref: 'Users'}],
    name: String,
    totalScore: Number,
    scores: {
        round1: Number,
        round2: Number,
        round3: Number,
        round4: Number,
        round5: Number,
        round6: Number
    },
    rounds: {
        round1: {
            team1: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
            team2: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
            team3: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
            team4: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
            team5: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
            team6: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}]
        },
        round2: {
            team1: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
            team2: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
            team3: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
            team4: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
            team5: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
            team6: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}]
        },
        round3: {
            team1: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
            team2: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
            team3: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}]
        },
        round4: {
            team1: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
            team2: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
            team3: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}]
        },
        round5: {
            team1: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}]
        },
        round6: {
            team1: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}]
        }
    }
});

var roundScoresObject = {
    missed3: Number,
    missed2: Number,
    missedFT: Number,
    score: Number
};

var teamSchema = new mongoose.Schema({
    teamName: String,
    region: String,
    seed: Number,
    apiName: String,
    scores: {
        round1: roundScoresObject,
        round2: roundScoresObject,
        round3: roundScoresObject,
        round4: roundScoresObject,
        round5: roundScoresObject,
        round6: roundScoresObject
    },
    totalScore: Number,
    wonRound: {
        round1: Boolean,
        round2: Boolean,
        round3: Boolean,
        round4: Boolean,
        round5: Boolean,
        round6: Boolean
    },
    eliminated: Boolean
});

var masterBracketSchema = new mongoose.Schema({
    northRegion: {
        seed1: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed2: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed3: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed4: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed5: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed6: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed7: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed8: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed9: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed10: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed11: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed12: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed13: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed14: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed15: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed16: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}]
    },
    southRegion: {
        seed1: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed2: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed3: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed4: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed5: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed6: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed7: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed8: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed9: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed10: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed11: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed12: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed13: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed14: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed15: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed16: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}]
    },
    eastRegion: {
        seed1: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed2: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed3: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed4: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed5: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed6: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed7: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed8: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed9: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed10: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed11: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed12: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed13: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed14: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed15: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed16: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}]
    },
    westRegion: {
        seed1: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed2: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed3: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed4: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed5: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed6: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed7: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed8: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed9: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed10: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed11: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed12: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed13: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed14: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed15: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        seed16: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}]
    }
});

var MasterBracket = mongoose.model('NCAA_Master_Bracket', masterBracketSchema);
var MsTeam = mongoose.model('March_Sadness_team', teamSchema);
msModel.msTeam = MsTeam;
var UserTeam = mongoose.model('User_MarchSadness_Team', userTeamSchema);
msModel.UserTeam = UserTeam;

msModel.initializeMasterBracket = function () {
    console.log('Get Master Bracket');
    MasterBracket.find({}).exec(function(err, result) {
        if (!err) {
            if (result.length === 0) {
                createMasterBracket();
            } else {
                msModel.masterBracket = result[0];
            }
        } else {
            console.log('Error creating dummy Master Bracket');
        }
    });
};

var insertAllTeams = function (index, array, callback) {
    "use strict";
    if (index < array.length) {
        array[index].save(function (err) {
            if (err) {
                console.log('error saving team' + index);
            }
            insertAllTeams(index + 1, array, callback);
        });
    } else {
        callback();
    }
};

var createMasterBracket = function () {
    "use strict";
    var sixteenArray, regionsArray, teamMap, regionMap, masterBracket, teamArray;
    teamMap = {};
    teamArray = [];
    regionMap = {};
    sixteenArray = [1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16]
        .map(function (x) {
            return x.toString();
        });
    regionsArray = ['north', 'south', 'east', 'west'];
    sixteenArray.map(function (e) {
        regionsArray.map(function (region) {
            var roundScores = {
                missed3: 0,
                missed2: 0,
                missedFT: 0,
                score: 0
            };
            var team = new MsTeam({
                teamName: 'team' + region + e,
                apiName: region + e,
                region: region,
                seed: e,
                scores: {
                    round1: roundScores,
                    round2: roundScores,
                    round3: roundScores,
                    round4: roundScores,
                    round5: roundScores,
                    round6: roundScores
                },
                wonRound: {
                    round1: false,
                    round2: false,
                    round3: false,
                    round4: false,
                    round5: false,
                    round6: false
                },
                eliminated: false,
                totalScore: 0
            });
            teamMap[region + e] = team;
            teamArray.push(team);
        });
    });
    insertAllTeams(0, teamArray, function () {
        regionsArray.map(function (region) {
            regionMap[region] = {};
            sixteenArray.map(function (e) {
                regionMap[region]['seed' + e] = teamMap[region + e];
            });
        });
        masterBracket = new MasterBracket({
            northRegion: regionMap['north'],
            southRegion: regionMap['south'],
            eastRegion: regionMap['east'],
            westRegion: regionMap['west']
        });
        console.log('saving masterBracket');
        masterBracket.save(function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log('Saved : ', data);
                msModel.masterBracket = data;
            }
        });
    });
};



module.exports = msModel;