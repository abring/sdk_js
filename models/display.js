
/**
 * display control
 */
var abringPageShow = function (page,title,message) {

    $("#abring").show();
    $("#abring>div").hide();
    $("#abring>div.modal_background").show();

    title = title || "";
    $("#abring ."+page+" .abring-dialog-title").html(title);

    message = message || "";
    $("#abring ."+page+" .abring-dialog-message").html(message);

    $("#abring ."+page).show();
};
var abringPageHide = function () {
    $("#abring").hide();
    $("#abring>div").hide();
};
