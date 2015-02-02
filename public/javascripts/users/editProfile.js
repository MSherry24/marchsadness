/**
 * Created by MSherry on 2/2/2015.
 */
var save = function () {
    var payload;
    payload = {};
    payload.firstName = $('#firstName').val();
    payload.lastName = $('#lastName').val();
    payload.email = $('#email').val();
    payload.okToEmail = $('#oktoemail').is(':checked');
    $('#saveChanges').hide();
    $('#saveChangesDisabled').show();
    $.post('/users/profile/edit', payload, function () {
        setTimeout(function(){
            $('#saveChanges').show();
            $('#saveChangesDisabled').hide();
        }, 1500);
    });
};

$(document).ready(function () {
    $('#saveChanges').on('click', save);
    $('#saveChangesDisabled').hide();

});