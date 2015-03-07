/**
 * Created by Mike on 1/26/2015.
 */
var updateTeam = function () {
    "use strict";
    window.location.href = "/marchsadness/maketeamselections/" + event.target.value;
};

var setTabBackgrounds = function () {
    "use strict";
    var tabs = [
        '#r1tab-a',
        '#r2tab-a',
        '#r3tab-a',
        '#r4tab-a',
        '#r5tab-a',
        '#r6tab-a'
    ];
    tabs.map(function (tab) {
        if ($(tab).html().indexOf("(Locked)") !== -1) {
            $(tab).addClass("ms-background-light-gray");
            $(tab).removeClass("ms-background-white");
            $(tab).removeClass("ms-background-yellow");
        } else if ($(tab).hasClass("activeRound")) {
            $(tab).addClass("ms-background-white");
            $(tab).removeClass("ms-background-light-gray");
            $(tab).removeClass("ms-background-yellow");
        } else {
            $(tab).addClass("ms-background-yellow");
            $(tab).removeClass("ms-background-white");
            $(tab).removeClass("ms-background-light-gray");
        }
    });
};

var editBallot = function () {
    "use strict";
    var teamId = $("#editBallotButton").val();
    window.location = '/marchsadness/makeTeamSelections/' + teamId;
};

$(document).ready(function () {
    $('#UpdateTeam').on('click', updateTeam);
    $("#tabs").tabs();
    setTabBackgrounds();
    $('.ms-single-team-table-tab').on("click", setTabBackgrounds);
    $("#editBallotButton").on("click", editBallot);
});