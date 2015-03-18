/**
 * Created by Mike on 3/14/2015.
 */
var deleteTeam = function (e) {
    "use strict";
    var route, x;
    if (!e) {
        e = window.event;
    }
    x = e.target || e.srcElement;
    if (confirm("Remove this ballot from the league?")) {
        route = '/marchsadness/removeBallotFromLeague/' + x.getAttribute('value') + "/" + x.getAttribute('league');
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
