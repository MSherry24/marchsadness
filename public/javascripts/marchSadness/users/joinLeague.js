var joinLeague = function () {
    "use strict";
    var url, req;
    req = {};
    url = $(event.target).val();
    $(event.target).addClass('disabled');
    $(event.target).html('Saving');
    req.password = $('#leaguePassword').val();
    $.post("/marchsadness/joinLeague/" + event.target.value, req, function (res) {
        if (res && res.message === 'wrongpassword') {
            window.location.href = "/marchsadness/viewSingleLeague/" + url + '/wrongpassword';
        }
        setTimeout(function () {
            window.location.href = "/marchsadness/viewSingleLeague/" + url;
        }, 1500);
    });

};

$(document).ready(function () {
    $('#submit').on('click', joinLeague);
});