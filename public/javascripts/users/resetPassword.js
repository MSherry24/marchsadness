/**
 * Created by MSherry on 2/2/2015.
 */
var save = function () {
    var payload;
    payload = {};
    payload.userId = $('#submitButton').val();
    payload.verification = $('#submitButton').attr('verification');
    payload.password = $('#newPassword').val();
    $('#submitButton').addClass('disabled');
    $('#submitButton').html('Saving');
    $.post('/users/resetPassword', payload, function() {
        window.location.replace("/users/login");
    });
};

$(document).ready(function () {
    $('#submitButton').on('click', save);
});