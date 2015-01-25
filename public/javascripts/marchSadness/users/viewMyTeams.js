/**
 * Created by Mike on 1/25/2015.
 */
$(document).ready(function () {
    $('.deleteTeam').on('click', deleteTeam);
});

var deleteTeam = function() {
    var route;
    route = '/marchsadness/deleteteam/' + event.target.value;
    $.post(route, function () {
            window.location.reload(true);
    });
};