var mongoose = require('mongoose');
var db = mongoose.connection;
var msModel = {};

var configSchema = new mongoose.Schema({
        roundStarted: {
            round1: Boolean,
            round2: Boolean,
            round3: Boolean,
            round4: Boolean,
            round5: Boolean,
            round6: Boolean
        }
    });

var userTeamSchema = new mongoose.Schema({
    owner: [{type: mongoose.Schema.ObjectId, ref: 'Users'}],
    leagues: [{type: mongoose.Schema.ObjectId, ref: 'March_Sadness_League'}],
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
        round1picks: [{type: mongoose.Schema.ObjectId, ref: 'March_Sadness_team'}],
        round2picks: [{type: mongoose.Schema.ObjectId, ref: 'March_Sadness_team'}],
        round3picks: [{type: mongoose.Schema.ObjectId, ref: 'March_Sadness_team'}],
        round4picks: [{type: mongoose.Schema.ObjectId, ref: 'March_Sadness_team'}],
        round5picks: [{type: mongoose.Schema.ObjectId, ref: 'March_Sadness_team'}],
        round6picks: [{type: mongoose.Schema.ObjectId, ref: 'March_Sadness_team'}]
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

var leagueSchema = new mongoose.Schema({
    manager: [{type: mongoose.Schema.ObjectId, ref: 'Users'}],
    name: String,
    password: String,
    memberTeamOwners: [{type: mongoose.Schema.ObjectId, ref: 'Users'}]
});

var MsConfig = mongoose.model('March_Sadness_Config', configSchema);
msModel.MsConfig = MsConfig;
var MsTeam = mongoose.model('March_Sadness_team', teamSchema);
msModel.msTeam = MsTeam;
var UserTeam = mongoose.model('User_MarchSadness_Team', userTeamSchema);
msModel.UserTeam = UserTeam;
var MsLeague = mongoose.model('March_Sadness_League', leagueSchema);
msModel.MsLeague = MsLeague;

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
    regionsArray = ['midwest', 'south', 'east', 'west'];
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
    MsTeam.find({}).exec(function (err, result) {
        if (!err && result.length === 0) {
            createMasterBracket();
        }
    });
};

msModel.initializeMsConfig = function () {
    "use strict";
    var newConfig;
    MsConfig.find({}).exec(function (err, result) {
        if (!err && result.length === 0) {
            newConfig = new MsConfig({
                roundStarted: {
                    round1: false,
                    round2: false,
                    round3: false,
                    round4: false,
                    round5: false,
                    round6: false
                }
            });
            newConfig.save();
        }
    });
};

module.exports = msModel;