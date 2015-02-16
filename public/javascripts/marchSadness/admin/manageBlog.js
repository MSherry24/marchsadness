var deletePost = function () {
    "use strict";
    if (confirm("Delete this post?")) {
        $(event.target).addClass('disabled');
        $(event.target).html('Deleting');
        $.post("/marchsadness/admin/deletePost/", {postId: $(event.target).val()},
            function () {
                window.location.replace("/marchsadness/admin/manageBlog");
            });
    }
};

$(document).ready(function () {
    $(".btn").on('click', deletePost);
});

