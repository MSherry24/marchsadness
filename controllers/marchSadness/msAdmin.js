/**
 * Created by Mike on 1/22/2015.
 */
msModel = require('../../models/marchSadnessModel');

exports.updateSingleTeam = function (req, res) {
    var scores, region, seed, mb;
    scores = req.body.scores;
    region = req.body.region + 'Region';
    seed = 'seed' + req.body.seed;
    mb = msModel.masterBracket;
    mb[region][seed].scores = scores;
    updateMasterBracket(req, res, mb);
};

exports.updateNames = function (req, res) {
    "use strict";
    var allTeams, sixteenArray, regionsArray, mb;
    allTeams = JSON.parse(req.body.allTeams);
    sixteenArray = [1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16]
        .map(function (x) {
            return x.toString();
        });
    regionsArray = ['north', 'south', 'east', 'west'];
    mb = msModel.masterBracket;
    regionsArray.map(function (region) {
        sixteenArray.map(function (e) {
            mb[region + 'Region']['seed' + e].teamName = allTeams[region + e];
        });
    });
    console.log('saving master bracket');
    mb.save(function (err) {
        if (err) {
            console.log(err);
            res.status(500).end();
        } else {
            res.status(200).end();
        }
    });
};

var updateMasterBracket = function (req, res, mb) {
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
            mb[region][seed].totalScore = 0;
            rounds.map(function (round) {
                var roundScore;
                roundScore =
                    mb[region][seed].scores[round].missed3 +
                    mb[region][seed].scores[round].missed2 * 2 +
                    mb[region][seed].scores[round].missedFT * 3;
                mb[region][seed].scores[round].score = roundScore;
                mb[region][seed].totalScore += roundScore;
            });
        });
    });
    mb.save(function (err) {
        if (err) {
            console.log(err);
            res.status(500).end();
        } else {
            res.status(200).end();
        }
    });
};