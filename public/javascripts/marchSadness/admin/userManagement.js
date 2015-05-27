/**
 * Created by Mike on 5/25/2015.
 */

var callToLowerCase = function () {
    "use strict";
    $('#toLowerCase').addClass('disabled');
    $.post("/marchsadness/admin/toLowerCase/", function () {
        setTimeout(function () {
            $('#toLowerCase').removeClass('disabled');
            location.reload();
        }, 1500);
    });
};

$(document).ready(function () {
    $('#toLowerCase').on('click', callToLowerCase);
});
