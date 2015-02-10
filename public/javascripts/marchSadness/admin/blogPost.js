/**
 * Created by MSherry on 2/10/2015.
 */
$(document).ready(function () {
    var editor = $("#texteditor").kendoEditor({
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
