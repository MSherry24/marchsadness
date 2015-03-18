var addTeam = function (e) {
    "use strict";
    var url, x;
    if (!e) {
        e = window.event;
    }
    x = e.target || e.srcElement;
    url = $(x).val().split('/')[0];
    $(x).addClass('disabled');
    $(x).html('Saving');
    $.post("/marchsadness/addTeamToLeague/" + x.value, function () {
        setTimeout(function () {
            window.location.href = "/marchsadness/viewSingleLeague/" + url;
        }, 1500);
    });

};

$(document).ready(function () {
    $('.AddTeam').on('click', addTeam);
    $('#newBallotForm').hide();
    $('#showNewBallot').on('click', function () {
        $('#newBallotForm').show();
        $('#startNewBallot').hide();
    });
});