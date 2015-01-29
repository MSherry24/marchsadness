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
        round1picks: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        round2picks: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        round3picks: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        round4picks: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        round5picks: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}],
        round6picks: [{type: mongoose.Schema.ObjectId, ref: 'User_MarchSadness_Team'}]
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
    eliminated: Boolean
});

var MsTeam = mongoose.model('March_Sadness_team', teamSchema);
msModel.msTeam = MsTeam;
var UserTeam = mongoose.model('User_MarchSadness_Team', userTeamSchema);
msModel.UserTeam = UserTeam;

var insertAllTeams = function (index, array) {
    "use strict";
    if (index < array.length) {
        array[index].save(function (err) {
            if (err) {
                console.log('error saving team' + index);
            }
            insertAllTeams(index + 1, array);
        });
    }
};

var createMasterBracket = function () {
    "use strict";
    var sixteenArray, regionsArray, teamArray;
    teamArray = [];
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
                eliminated: false,
                totalScore: 0
            });
            teamArray.push(team);
        });
    });
    insertAllTeams(0, teamArray);
};

msModel.initializeMasterBracket = function () {
    console.log('Get Master Bracket');
    MsTeam.find({}).exec(function (err, result) {
        if (!err && result.length === 0) {
            createMasterBracket();
        }
    });
};


module.exports = msModel;