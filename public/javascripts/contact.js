/**
 * Created by MSherry on 2/2/2015.
 */
var save = function () {
    "use strict";
    var messageTypeSelected = $('#dropdownMenu1').val(),
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
    $('a.dropdown-select').on('click', function(e) {
        if (!e) {
            e = window.event;
        }
        x = e.target || e.srcElement;
        $('#dropdownMenu1').html(x.innerHTML + '  <span class="caret"</span>');
        $('#dropdownMenu1').val($(x).attr('value'));
    });
    $('#email').watermark('Your Email Address');
    $('#message').watermark('Your Message');
});