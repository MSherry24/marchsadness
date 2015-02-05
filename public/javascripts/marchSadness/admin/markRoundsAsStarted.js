$(document).ready(function () {
    $('#UpdateRounds').on('click', updateRounds);
});

var updateRounds = function() {
    "use strict";
    var roundSettings;
    $('#UpdateRounds').addClass('disabled');
    $('#UpdateRounds').html('Saving');
    roundSettings = {};
    [1, 2, 3, 4, 5, 6].map(function(x) {
        roundSettings['round' + x] = $('#round' + x).is(':checked');
    });

    $.post("/marchsadness/admin/markRoundsAsStarted", roundSettings,
        function () {
            window.location.replace("/marchsadness/admin");
        });
};