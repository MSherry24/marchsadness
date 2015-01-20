/**
 * Created by MSherry on 1/20/2015.
 */
$(document).ready(function () {
    $('.UpdateTeam').on('click', updateTeam);
});

var updateTeam = function() {
    var targetValue, region, request, requestString;
    targetValue = event.target.value;
    region = targetValue[0];
    request = {};
    request.seed = targetValue[1];
    if (region === 'N') { request.region = 'north'; }
    else if (region === 'S') { request.region = 'south'; }
    else if (region === 'E') { request.region = 'east'; }
    else { request.region = 'west'; }
    window.location.href = "/marchsadness/admin/updateSingleTeam?region=" + request.region + "&seed=" + request.seed;
};