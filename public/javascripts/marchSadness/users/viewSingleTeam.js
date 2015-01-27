/**
 * Created by Mike on 1/26/2015.
 */
var updateTeam = function () {
    "use strict";
    window.location.href = "/marchsadness/maketeamselections/" + event.target.value;
};

$(document).ready(function () {
    $('#UpdateTeam').on('click', updateTeam);
});