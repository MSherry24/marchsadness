/**
 * Created by Mike on 3/14/2015.
 */
var deleteTeam = function () {
    "use strict";
    var route;
    if (confirm("Remove this ballot from the league?")) {
        route = '/marchsadness/removeBallotFromLeague/' + event.target.getAttribute('value') + "/" + event.target.getAttribute('league');
        $.ajax({
            url: route,
            type: 'POST',
            async: false,
            cache: false,
            timeout: 30000,
            error: function () {
                window.location.reload(true);
            },
            success: function () {
                window.location.reload(true);
            }
        });
    }
};

$(document).ready(function () {
    "use strict";
    $('.deleteTeam').on('click', deleteTeam);
});
