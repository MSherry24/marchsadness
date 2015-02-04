var joinLeague = function () {
    "use strict";
    var url, req;
    req = {};
    $(event.target).addClass('disabled');
    $(event.target).html('Saving');
    req.id = $('#leagueId').val();
    req.password = $('#leaguePassword').val();
    $.post("/marchsadness/joinLeague/" + req.id, req, function (res) {
        if (res && res.message === 'wrongpassword') {
            window.location.href = "/marchsadness/viewSingleLeague/" + req.id + '/wrongpassword';
        } else if (res && res.message === 'wrongleagueid') {
            window.location.href = "/marchsadness/joinALeague/wrongleagueid";
        } else {
            setTimeout(function () {
                window.location.href = "/marchsadness/viewSingleLeague/" + req.id;
            }, 1500);
        }
    });

};

$(document).ready(function () {
    $('#submit').on('click', joinLeague);
});