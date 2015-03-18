/**
 * Created by mikesherry24 on 9/13/14.
 */

var submitPost = function () {
    var url, req = {};
    req.postBody = $('#textarea').val();
    req.postTitle = $('#title').val();
    req.postPreview = $('#inputPreview').val();
    req.postId = $("#SubmitButton").val();
    req.postBody = req.postBody.replace(/background-color:#ffffff/g, "background-color:transparent");

    $("#SubmitButton").addClass('disabled');
    $("#SubmitButton").html('Saving');
    $.post("/marchsadness/admin/blogPost", req,
        function () {
            window.location.replace("/marchsadness/admin/manageBlog");
        });
};

$(document).ready(function () {
    // create Editor from textarea HTML element with default set of tools
    //$("#textarea").jqte();
    $("#SubmitButton").on('click', submitPost);
    // create Editor from textarea HTML element with default set of tools
    var editor = $("#textarea").kendoEditor({
        encoded: false,
        tools: [
            "bold", "italic", "underline", "strikethrough",
            "fontSize", "foreColor", "backColor",
            "justifyLeft", "justifyCenter", "justifyRight", "justifyFull",
            "createLink", "unlink", "insertImage",
            "formatting", "cleanFormatting",
            "viewHtml"
        ]
    });
});

