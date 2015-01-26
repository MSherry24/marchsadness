/**
 * Created by MSherry on 1/20/2015.
 */
$(document).ready(function () {
    $('#UpdateNames').on('click', updateNames);
});

var updateNames = function() {
    var sixteenArray, regionsArray, stringTeams, allTeams;
    allTeams = {};
    sixteenArray = [1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 16]
        .map(function (x) {
            return x.toString();
        });
    regionsArray = ['north', 'south', 'east', 'west'];

    regionsArray.map(function (region) {
        sixteenArray.map(function (e) {
            allTeams[region + e] = $('#' + region + 'Seed' + e).val();
        });
    });
    stringTeams = {allTeams: JSON.stringify(allTeams)};

    $.post("/marchsadness/admin/updateNames", stringTeams,
        function () {
           location.reload(true);
    });
};