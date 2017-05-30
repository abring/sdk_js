
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
var showLittleTip = function(title,message,type,wait){

    title = title || "";
    message = message || "";
    type = type || "info";
    wait = wait || abring.params.display.tooltip_default_time;

    abringPageHide();
    abring.params.display[type].show(title,message);
    setTimeout(function(){
        abring.params.display.hidePageFunction();
    }, wait*1000);

};
