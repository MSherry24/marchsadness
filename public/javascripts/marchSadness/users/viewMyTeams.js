/**
 * Created by Mike on 1/25/2015.
 */
$(document).ready(function () {
    "use strict";
    $('.deleteTeam').on('click', deleteTeam);
    $('#newBallotForm').hide();
    $('#showNewBallot').on('click', function () {
        $('#newBallotForm').show();
        $('#startNewBallot').hide();
    });
});

var deleteTeam = function () {
    "use strict";
    var route;
    if (confirm("Delete this ballot?")) {
        route = '/marchsadness/deleteteam/' + event.target.getAttribute('value');
        $.post(route, function () {
            window.location.reload(true);
        });
    }
};