var mongoose = require('mongoose');
var db = mongoose.connection;
var msModel = {};

var userTeamSchema = new mongoose.Schema({
    owner: [{type: mongoose.Schema.ObjectId, ref: 'Users'}],
    totalScore: Number,
    round1: {
        score: Number,
        team1: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team2: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team3: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team4: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team5: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team6: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'}
    },
    round2: {
        score: Number,
        team1: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team2: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team3: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team4: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team5: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team6: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'}
    },
    round3: {
        score: Number,
        team1: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team2: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team3: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    },
    round4: {
        score: Number,
        team1: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team2: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team3: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'}
    },
    round5: {
        score: Number,
        team1: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    },
    round6: {
        score: Number,
        team1: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'}
    }
});

var roundScoresObject = {
    missed3: Number,
    missed2: Number,
    missedFT: Number,
    score: Number
};

var teamSchemaObject = {
        teamName: String,
        apiName: String,
        scores: {
            round1: roundScoresObject,
            round2: roundScoresObject,
            round3: roundScoresObject,
            round4: roundScoresObject,
            round5: roundScoresObject,
            round6: roundScoresObject
        },
        totalScore: Number
    };

var masterBracketSchema = new mongoose.Schema({
    northRegion: {
        seed1: teamSchemaObject,
        seed2: teamSchemaObject,
        seed3: teamSchemaObject,
        seed4: teamSchemaObject,
        seed5: teamSchemaObject,
        seed6: teamSchemaObject,
        seed7: teamSchemaObject,
        seed8: teamSchemaObject,
        seed9: teamSchemaObject,
        seed10: teamSchemaObject,
        seed11: teamSchemaObject,
        seed12: teamSchemaObject,
        seed13: teamSchemaObject,
        seed14: teamSchemaObject,
        seed15: teamSchemaObject,
        seed16: teamSchemaObject
    },
    southRegion: {
        seed1: teamSchemaObject,
        seed2: teamSchemaObject,
        seed3: teamSchemaObject,
        seed4: teamSchemaObject,
        seed5: teamSchemaObject,
        seed6: teamSchemaObject,
        seed7: teamSchemaObject,
        seed8: teamSchemaObject,
        seed9: teamSchemaObject,
        seed10: teamSchemaObject,
        seed11: teamSchemaObject,
        seed12: teamSchemaObject,
        seed13: teamSchemaObject,
        seed14: teamSchemaObject,
        seed15: teamSchemaObject,
        seed16: teamSchemaObject
    },
    eastRegion: {
        seed1: teamSchemaObject,
        seed2: teamSchemaObject,
        seed3: teamSchemaObject,
        seed4: teamSchemaObject,
        seed5: teamSchemaObject,
        seed6: teamSchemaObject,
        seed7: teamSchemaObject,
        seed8: teamSchemaObject,
        seed9: teamSchemaObject,
        seed10: teamSchemaObject,
        seed11: teamSchemaObject,
        seed12: teamSchemaObject,
        seed13: teamSchemaObject,
        seed14: teamSchemaObject,
        seed15: teamSchemaObject,
        seed16: teamSchemaObject
    },
    westRegion: {
        seed1: teamSchemaObject,
        seed2: teamSchemaObject,
        seed3: teamSchemaObject,
        seed4: teamSchemaObject,
        seed5: teamSchemaObject,
        seed6: teamSchemaObject,
        seed7: teamSchemaObject,
        seed8: teamSchemaObject,
        seed9: teamSchemaObject,
        seed10: teamSchemaObject,
        seed11: teamSchemaObject,
        seed12: teamSchemaObject,
        seed13: teamSchemaObject,
        seed14: teamSchemaObject,
        seed15: teamSchemaObject,
        seed16: teamSchemaObject
    }
});

var MasterBracket = mongoose.model('NCAA_Master_Bracket', masterBracketSchema);
var userTeam = mongoose.model('User_MarchSadness_Team', userTeamSchema);

msModel.getMasterBracket = function() {
    MasterBracket.findOne({}).exec(function (err, result) {
        if (!err) {
            msModel.masterBracket = result;
        } else {
            // error handling
            console.log('error querying tourney teams: ' + err);
        }
    });
}

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
    })
};

msModel.updateMasterBracket = function() {
    var rounds, seedArray, regionsArray;
    seedArray = [1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16]
        .map(function (x) {
            return 'seed' + x.toString();
        });
    regionsArray = ['northRegion', 'southRegion', 'eastRegion', 'westRegion'];
    rounds = ['1','2','3','4','5','6'].map(function (e) {
        return 'round' + e.toString();
    });
    regionsArray.map(function (region) {
        seedArray.map(function (seed) {
            msModel.masterBracket[region][seed].totalScore = 0;
            rounds.map(function (round) {
                var roundScore;
                roundScore =
                    msModel.masterBracket[region][seed].scores[round].missed3 +
                    msModel.masterBracket[region][seed].scores[round].missed2 * 2 +
                    msModel.masterBracket[region][seed].scores[round].missedFT * 3;
                msModel.masterBracket[region][seed].scores[round].score = roundScore;
                msModel.masterBracket[region][seed].totalScore += roundScore;
            });
        });
    });
    msModel.masterBracket.save();
};

var createMasterBracket = function () {
    "use strict";
    var sixteenArray, regionsArray, teamMap, regionMap;
    teamMap = {};
    regionMap = {};
    sixteenArray = [1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16]
        .map(function (x) {
            return x.toString();
        });
    regionsArray = ['North', 'South', 'East', 'West'];
    sixteenArray.map(function (e) {
        regionsArray.map(function (region) {
            var roundScores = {
                missed3: 0,
                missed2: 0,
                missedFT: 0,
                score: 0
            };
            var team = {
                teamName: 'team' + region + e,
                apiName: 'team' + region + e,
                scores: {
                    round1: roundScores,
                    round2: roundScores,
                    round3: roundScores,
                    round4: roundScores,
                    round5: roundScores,
                    round6: roundScores
                },
                totalScore: 0
            };
            teamMap['team' + region + e] = team;
        });
    });
    regionsArray.map(function (region) {
        regionMap[region] = {};
        sixteenArray.map(function (e) {
            regionMap[region]['seed' + e] = teamMap['team' + region + e];
        })
    });
    var masterBracket = new MasterBracket({
        northRegion: regionMap['North'],
        southRegion: regionMap['South'],
        eastRegion: regionMap['East'],
        westRegion: regionMap['West']
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
};

module.exports = msModel;