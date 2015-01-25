/**
 * Created by MSherry on 1/20/2015.
 */
$(document).ready(function () {
    $('#UpdateTeam').on('click', UpdateTeam);
});

var redirect = function () {
    window.location.href = "/marchsadness/admin/updateTeamScores";
};

var UpdateTeam = function() {
    var targetValue, seed, region, scores, req, rounds, shotTypes;
    targetValue = event.target.value;
    region = targetValue.split('/')[0];
    seed = targetValue.split('/')[1];
    req = { seed: seed,
            region: region };
    scores = {};
    rounds = ['1','2','3','4','5','6'];
    shotTypes = ['3','2','FT'];

    rounds.map(function (round) {
        scores['round' + round] = {};
        shotTypes.map(function (shotType) {
            var pageIndex = '#R' + round + '-' + shotType;
            scores['round' + round]['missed' + shotType] = $(pageIndex).val();
        });
    });
    req.scores = scores;
    $.post("/marchsadness/admin/updateSingleTeam", req, redirect());

};

