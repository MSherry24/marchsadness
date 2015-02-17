/**
 * Created by Mike on 1/25/2015.
 */
$(document).ready(function () {
    "use strict";
    $('.deleteTeam').on('click', deleteTeam);
});

var deleteTeam = function () {
    "use strict";
    var route;
    if (confirm("Delete this team?")) {
        route = '/marchsadness/deleteteam/' + event.target.value;
        $.post(route, function () {
            window.location.reload(true);
        });
    }
};