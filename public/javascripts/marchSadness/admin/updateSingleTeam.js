/**
 * Created by MSherry on 1/20/2015.
 */
$(document).ready(function () {
    $('#UpdateTeam').on('click', UpdateTeam);
});

var redirect = function () {
    window.location.href = "/marchsadness/admin/updateTeamScores";
};

var UpdateTeam = function (e) {
    var scores, req, rounds, shotTypes, x;
    if (!e) {
        e = window.event;
    }
    x = e.target || e.srcElement;
    req = {};
    scores = {};
    rounds = ['1', '2', '3', '4', '5', '6'];
    shotTypes = ['3', '2', 'FT'];

    rounds.map(function (round) {
        scores['round' + round] = {};
        shotTypes.map(function (shotType) {
            var pageIndex = '#R' + round + '-' + shotType;
            scores['round' + round]['missed' + shotType] = $(pageIndex).val();
        });
    });
    req.eliminated = $('#eliminated').is(':checked');
    req.scores = scores;
    $.post("/marchsadness/admin/updateSingleTeam/" + x.value, req, redirect());

};

