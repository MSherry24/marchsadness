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

$(document).ready(function () {
    $('.AddTeam').on('click', addTeam);
});