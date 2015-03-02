/**
 * Created by Mike on 3/1/2015.
 */
$(document).ready(function() {
    $('#showCreateTeam').on('click', showCreateTeam);
    $('#newTeamForm').hide();
});

var showCreateTeam = function() {
    $('#showCreateTeam').hide();
    $('#newTeamForm').show();
};