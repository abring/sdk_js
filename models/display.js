
/**
 * display control
 */
var abringPageShow = function (page,title,message) {
    $("#abring").show();
    $("#abring .page").hide();

    title = title || "";
    $("#abring ."+page+' .title').html(title);

    message = message || "";
    $("#abring ."+page+' .message').html(message);

    $("#abring ."+page).show();
};
var abringPageHide = function () {
    $("#abring").hide();
    $("#abring .page").hide();
};
var abringLoadingFinish = function () {

};
