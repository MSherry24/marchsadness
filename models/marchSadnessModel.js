var mongoose = require('mongoose');
var db = mongoose.connection;
var msModel = {};

var ncaaTeamSchema = new mongoose.Schema({
    teamName: String,
    scores: {
        round1: Number,
        round2: Number,
        round3: Number,
        round4: Number,
        round5: Number,
        round6: Number
    },
    totalScore: Number
});

var userTeamSchema = new mongoose.Schema({
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
        team5: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'}
    },
    round3: {
        score: Number,
        team1: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team2: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team3: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
        team4: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'}
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
        team2: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'}
    },
    round6: {
        score: Number,
        team1: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'}
    }
});

var regionSchema = new mongoose.Schema({
    name: String,
    seed1: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    seed2: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    seed3: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    seed4: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    seed5: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    seed6: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    seed7: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    seed8: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    seed9: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    seed10: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    seed11: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    seed12: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    seed13: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    seed14: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    seed15: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'},
    seed16: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Team'}
});

var masterBracketSchema = new mongoose.Schema({
    northRegion: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Region'},
    southRegion: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Region'},
    eastRegion: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Region'},
    westRegion: {type: mongoose.Schema.Types.ObjectId, ref: 'NCAA_Basketball_Region'}
});

var NcaaBBTeam = mongoose.model('NCAA_Basketball_Team', ncaaTeamSchema);
var NcaaBBRegion = mongoose.model('NCAA_Basketball_Region', regionSchema);
var MasterBracket = mongoose.model('NCAA_Master_Bracket', masterBracketSchema);
var userTeam = mongoose.model('User_MarchSadness_Team', userTeamSchema);

msModel.getAllTourneyTeams = function () {
    console.log('Get all Tourney Teams');
    NcaaBBTeam.find({}).exec(function (err, result) {
        if (!err) {
            return result;
        } else {
            // error handling
            console.log('error querying tourney teams: ' + err);
        }
    });
};

msModel.getMasterBracket = function () {
    console.log('Get Master Bracket');
    MasterBracket.find({}).exec(function (err, result) {
        if (!err) {
            return result;
        } else {
            // error handling
            console.log('error querying tourney teams: ' + err);
        }
    });
};

var createMasterBracket = function () {
    "use strict";
    var masterBracket, regions;
    MasterBracket.count({}, function (err, c) {
        console.log('Master Bracket count = ' + c);
        if (!err && c === 0) {
            regions = ['North', 'South', 'East', 'West'];
            masterBracket = new MasterBracket();
            regions.map(function (region) {
                NcaaBBRegion.find({name: region}).exec(
                    function (err, result) {
                        if (!err) {
                            masterBracket[region] = result;
                        }
                        else {
                            console.log('Error finding team');
                        }
                    }
                );
            });
            masterBracket.save(function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Saved Master Bracket: ', data);
                }
            });
        }
    });
};

var createDummyRegions = function () {
    "use strict";
    var regionsArray, sixteenArray;
    NcaaBBRegion.count({}, function (err, c) {
        console.log('region count = ' + c);
        if (!err && c === 0) {
            regionsArray = ['North', 'South', 'East', 'West'];
            sixteenArray = [1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16]
                .map(function (x) { return x.toString(); });
            regionsArray.map(function (region) {
                var newRegion;
                newRegion = new NcaaBBRegion({ name: region });
                sixteenArray.map(function (e) {
                    NcaaBBTeam.find({name: 'Team' + region + e}).exec(
                        function (err, result) {
                            console.log('team name = ' + result.teamName + ' id = ' + result._id);
                            if (!err) {
                                newRegion['seed' + e] = result._id;
                            } else {
                                console.log('Error finding team');
                            }
                        }
                    );
                });
                newRegion.save(function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Saved : ', data);
                    }
                });
            });
        }
    });
};

function createDummyTeams() {
    "use strict";
    var sixteenArray, regionsArray;
    NcaaBBTeam.count({}, function (err, c) {
        console.log('count = ' + c);
        if (!err && c === 0) {
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
                    var team = new NcaaBBTeam({
                        teamName: 'team' + region + e,
                        scores: {
                            round1: 0,
                            round2: 0,
                            round3: 0,
                            round4: 0,
                            round5: 0,
                            round6: 0
                        },
                        totalScore: 0
                    });
                    team.save(function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Saved : ', data);
                        }
                    });
                });
            });
        } else {
            console.log('Error finding team');
        }
    });
}

msModel.populateMasterBracket = function () {
    "use strict";
    if (msModel.getMasterBracket() === undefined) {
        // If master bracket doesn't exist, populate fields with dummy values.
        createDummyTeams();
        createDummyRegions();
        createMasterBracket();
    }
};

module.exports = msModel;

function createDummyTeams() {
    "use strict";
    var sixteenArray, regionsArray, teamMap, regionMap, masterBracketMap;
    teamMap = {};
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
            var team = new NcaaBBTeam({
                teamName: 'team' + region + e,
                scores: {
                    round1: 0,
                    round2: 0,
                    round3: 0,
                    round4: 0,
                    round5: 0,
                    round6: 0
                },
                totalScore: 0
            });
            teamMap['team' + region + e] = team;
        });
    });
    regionsArray.map(function (region) {
        var region = new NcaaBBRegion({
            name: region
        });
        sixteenArray.map(function (e) {
            region['seed' + e] = teamMap['team' + region + e];
        })
    });
    var masterBracket = new masterBracket({
        northRegion: regionMap['North'],
        southRegion: regionMap['South'],
        eastRegion: regionMap['East'],
        westRegion: regionMap['West']
    });
    masterBracket.save(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('Saved : ', data);
        }
    });
}