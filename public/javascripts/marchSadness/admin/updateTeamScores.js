/**
 * Created by MSherry on 1/20/2015.
 */
var updateTeam = function (e) {
    "use strict";
    var x;
    if (!e) {
        e = window.event;
    }
    x = e.target || e.srcElement;
    window.location.href = "/marchsadness/admin/updateSingleTeam/" + x.value;
};

var updateUserScores = function () {
    "use strict";
    $('#UpdateUserScores').hide();
    $('#UpdateUserScoresDisabled').show();
    $.post("/marchsadness/admin/updateUserScores/", function () {
        setTimeout(function () {
            $('#UpdateUserScores').show();
            $('#UpdateUserScoresDisabled').hide();
        }, 1500);
    });

};

$(document).ready(function () {
    $('.UpdateTeam').on('click', updateTeam);
    $('#UpdateUserScores').on('click', updateUserScores);
    $('#UpdateUserScoresDisabled').hide();
});