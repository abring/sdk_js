
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

$( document ).on( "onDeviceReady", function() {
    document.addEventListener("backbutton", function(e){
        if($.mobile.activePage.is('#home')){
            e.preventDefault();

            navigator.notification.confirm(
                abring.t("Do you want to exit?"), // message
                function (button){
                    if(button=="1" || button==1)
                    {
                        navigator.app.exitApp();
                    }
                }, // callback
                abring.t("Confirm exit"), // title
                abring.t('YES')+','+abring.t('NO') // buttonName
            );

        }
        else {
            navigator.app.backHistory()
        }
    }, false);
});
