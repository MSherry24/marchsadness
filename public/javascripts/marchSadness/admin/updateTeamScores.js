/**
 * Created by MSherry on 1/20/2015.
 */
var updateTeam = function () {
    "use strict";
    window.location.href = "/marchsadness/admin/updateSingleTeam/" + event.target.value;
};

var updateUserScores = function () {
    "use strict";
    $.post("/marchsadness/admin/updateUserScores/", function () {
        window.location.href = "/marchsadness/admin/updateTeamScores";
    });

};

$(document).ready(function () {
    $('.UpdateTeam').on('click', updateTeam);
    $('#UpdateUserScores').on('click', updateUserScores);
});