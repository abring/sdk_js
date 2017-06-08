
/**
 * display control
 */
var abringPageShow = function (page,title,message,template_page_id) {

    $("#abring").show();
    $("#abring>div").hide();
    $("#abring>div.modal_background").show();

    template_page_id = template_page_id || abring.params.display.default_page_id;

    var content = $("."+page).outerHTML();
    $("#abring #"+template_page_id+" .content-div").html(content);

    title = title || "";
    $("#abring #"+template_page_id+" .abring-dialog-title").html(title);

    message = message || "";
    $("#abring #"+template_page_id+" .abring-dialog-message").html(message);

    $("#abring #"+template_page_id+" ."+page).show();
    $("#abring #"+template_page_id).show();
};
var abringPageHide = function () {
    $("#abring").hide();
    $("#abring>div").hide();
};
