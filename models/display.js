
/**
 * display control
 */
var abringPageShow = function (page,title,message) {
    $("#abring").show();
    var default_page = abring.params.display.default_page_id;

    var content = $("."+page).outerHTML();
    $("#abring #"+default_page+"").html(content);

    title = title || "";
    $("#abring #"+default_page+" .abring-dialog-title").html(title);

    message = message || "";
    $("#abring #"+default_page+" .abring-dialog-message").html(message);

    $("#abring #"+default_page+" ."+page).show();
    $("#abring #"+default_page).show();
};
var abringPageHide = function () {
    var default_page = abring.params.display.default_page_id;
    $("#abring").hide();
    $("#abring #"+default_page+"").hide();
};
