var deletePost = function (e) {
    "use strict";
    var x;
    if (!e) {
        e = window.event;
    }
    x = e.target || e.srcElement;
    if (confirm("Delete this post?")) {
        $(x).addClass('disabled');
        $(x).html('Deleting');
        $.post("/marchsadness/admin/deletePost/", {postId: $(x).val()},
            function () {
                window.location.replace("/marchsadness/admin/manageBlog");
            });
    }
};

$(document).ready(function () {
    $(".btn").on('click', deletePost);
});

