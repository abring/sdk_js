
/**
 * display control
 */
var abringPageShow = function (page,title,message) {
    abring.params.current_page = page;
    $("#abring").show();
    $("#abring .page").hide();

    title = title || "";
    $("#abring ."+page+' .title').html(title);

    message = message || "";
    $("#abring ."+page+' .message').html(message);

    $("#abring ."+page).show();
};
var abringPageHide = function () {
    abring.params.current_page = "";
    $("#abring").hide();
    $("#abring .page").hide();
};
var abringLoadingStart = function () {
    abring.params.current_page = "loading";
    $("#abring .loading").show();
};
var abringLoadingFinish = function () {
    abring.params.current_page = "";
    $("#abring .loading").hide();
};
var showLittleTip = function(title,message,type,wait){

    title = title || "";
    message = message || "";
    type = type || "info";
    wait = wait || abring.params.display.tooltip_default_time;

    abringPageHide();
    abring.params.display.showPageFunction(type,title,message);
    setTimeout(function(){
        abringPageHide();
    }, wait*1000);

};
