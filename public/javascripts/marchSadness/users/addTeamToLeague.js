var addTeam = function () {
    "use strict";
    var url;
    url = $(event.target).val().split('/')[0];
    $(event.target).addClass('disabled');
    $(event.target).html('Saving');
    $.post("/marchsadness/addTeamToLeague/" + event.target.value, function () {
        setTimeout(function () {
            window.location.href = "/marchsadness/viewSingleLeague/" + url;
        }, 1500);
    });

};

var createBallot = function() {
    var url= "/marchsadness/createnewteam";
    $.post(url,  { "teamname": $('#teamName').val() }, function () {
        window.location.reload(true);
    });
};

var showCreateBallot = function() {
    $('#teamName').show();
    $('#createBallot').show();
};

$(document).ready(function () {
    $('.AddTeam').on('click', addTeam);
    $('#createBallot').on('click', createBallot);
    $('#showCreateBallot').on('click', showCreateBallot);
    $('#teamName').hide();
    $('#createBallot').hide();
    $('#teamName').watermark('Ballot Name');
});