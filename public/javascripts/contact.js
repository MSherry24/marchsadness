/**
 * Created by MSherry on 2/2/2015.
 */
var save = function () {
    "use strict";
    var messageTypeSelected = $('#dropdownMenu1').val($(event.target).attr('value')),
        payload = {};
    if (messageTypeSelected === '1') {
        payload.messageType = 'Bug';
    } else if (messageTypeSelected === '2') {
        payload.messageType = 'Support';
    } else if (messageTypeSelected === '3') {
        payload.messageType = 'Suggestion';
    } else {
        payload.messageType = 'Hello';
    }
    payload.message = $('#message').val();
    payload.userEmail = $('#email').val();
    $('#submitButton').addClass('disabled');
    $('#submitButton').html('Sending');
    $.post('/contact', payload, function () {
        window.location.replace("/");
    });
};

$(document).ready(function () {
    $('#submitButton').on('click', save);
    $('a.dropdown-select').on('click', function() {
        $('#dropdownMenu1').html(event.target.innerText + '  <span class="caret"</span>');
        $('#dropdownMenu1').val($(event.target).attr('value'));
    });
});