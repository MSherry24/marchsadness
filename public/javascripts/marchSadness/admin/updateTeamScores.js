/**
 * Created by MSherry on 1/20/2015.
 */
var updateTeam = function () {
    "use strict";
    window.location.href = "/marchsadness/admin/updateSingleTeam/" + event.target.value;
};

$(document).ready(function () {
    $('.UpdateTeam').on('click', updateTeam);
});