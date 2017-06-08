
/**
 * display control
 */
var abringPageShow = function (page,title,message) {
    $("#abring").show();
    var default_page = abring.params.display.default_page_id;

    title = title || "";
    $("#abring #"+default_page+" .abring-dialog-title").html(title);

    message = message || "";
    $("#abring #"+default_page+" .abring-dialog-message").html(message);

    var content = $("."+page).outerHTML();
    $("#abring #"+default_page+" .page_content").html(content);

    $("#abring #"+default_page+" ."+page).show();
    $("#abring #"+default_page).show();
};
var abringPageHide = function () {
    var default_page = abring.params.display.default_page_id;
    $("#abring").hide();
    $("#abring #"+default_page+"").hide();
};
