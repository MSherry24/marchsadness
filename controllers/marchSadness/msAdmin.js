/**
 * Created by Mike on 1/22/2015.
 */
msModel = require('../../models/marchSadnessModel');

exports.updateSingleTeam = function (req, res) {
    var scores, region, seed, mb;
    scores = req.body.scores;
    region = req.body.region + 'Region';
    seed = 'seed' + req.body.seed;
    msModel.getMasterBracket();
    mb = msModel.masterBracket;
    mb[region][seed].scores = scores;

    console.log('saving master bracket');
    mb.save(function (err) {
        if (err) {
            console.log('err:' + err);
        } else {
            msModel.updateMasterBracket();
            res.json({message: 'success'});
        }
    });
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
    msModel.getMasterBracket();
    mb = msModel.masterBracket;
    regionsArray.map(function (region) {
        sixteenArray.map(function (e) {
            mb[region + 'Region']['seed' + e].teamName = allTeams[region + e];
        });
    });
    console.log('saving master bracket');
    mb.save();
    res.json({message: 'success'});
};