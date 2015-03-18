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

var deleteTeam = function (e) {
    "use strict";
    var route, x;
    if (!e) {
        e = window.event;
    }
    x = e.target || e.srcElement;
    if (confirm("Delete this ballot?")) {
        route = '/marchsadness/deleteteam/' + x.getAttribute('value');
        $.post(route, function () {
            window.location.reload(true);
        });
    }
};