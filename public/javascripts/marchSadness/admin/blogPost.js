/**
 * Created by mikesherry24 on 9/13/14.
 */

var submitPost = function() {
    var req = {};
    req.postBody = $('#textarea').val();
    req.postTitle = $('#title').val();
    $("#SubmitButton").addClass('disabled');
    $("#SubmitButton").html('Saving');

    $.post("/marchsadness/admin/blogpost", req,
        function () {
            window.location.replace("/marchsadness/admin/manageBlog");
        });
};

$(document).ready(function() {
    // create Editor from textarea HTML element with default set of tools
    $("#textarea").jqte();
    $("#SubmitButton").on('click', submitPost);
});

