/**
 * Created by mikesherry24 on 1/2/15.
 */
$(document).ready(function () {
    $('#password').on('change', function () {
        if ($('#password').val() === $('#password2').val()) {
            $('#submitButton').enable();
        } else {
            $('#submitButton').disable();
        }
    });

    $('#password2').on('change', function () {
        if ($('#password').val() === $('#password2').val()) {
            $('#submitButton').enable();
        } else {
            $('#submitButton').disable();
        }
    });
});
