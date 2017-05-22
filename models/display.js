
/**
 * display control
 */
var abringPageShow = function (page,message) {
    abring.params.current_page = page;
    $("#abring").show();
    $("#abring .page").hide();
    if(message)
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
var showLittleTip = function(message,type,wait){
    $(".splash").hide();
    abring.params.current_page = "little_tip";
    type = type || "info";
    wait = parseInt(wait) || 1;
    var type_icon = "";
    if(type=="info") type_icon = abring.params.abring_info_url;
    if(type=="error") type_icon = abring.params.abring_error_url;
    $("#abring .little_tip img").attr("src",type_icon);
    $("#abring .little_tip .message").html(message);
    $("#abring .modal_background").hide();
    $("#abring,#abring .little_tip").show("slow");
    setTimeout(function(){
        $("#abring,#abring .little_tip").hide(
            {
                "duration":"slow",
                "complete":function(){ $("#abring .modal_background").show(); }
            }
        );
    }, wait*1000);
};
