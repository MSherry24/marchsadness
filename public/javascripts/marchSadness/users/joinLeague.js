var joinLeague = function (e) {
    "use strict";
    var url, req, x;
    if (!e) {
        e = window.event;
    }
    x = e.target || e.srcElement;
    req = {};
    url = $(x).val();
    $(x).addClass('disabled');
    $(x).html('Saving');
    req.password = $('#leaguePassword').val();
    $.post("/marchsadness/joinLeague/" + x.value, req, function (res) {
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