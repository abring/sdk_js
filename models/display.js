
/**
 * display control
 */
var abringPageShow = function (page,title,message) {
    $("#abring").show();
    $("#abring .page").hide();

    title = title || "";
    $("#abring ."+page+'.dialog .abring-dialog-title').html(title);

    message = message || "";
    $("#abring ."+page+'.dialog .abring-dialog-message').html(message);

    $("#abring ."+page).show();
};
var abringPageHide = function () {
    $("#abring").hide();
    $("#abring .page").hide();
};
var abringLoadingFinish = function () {

};
