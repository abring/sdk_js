var temp_data = {};
var temp_initCompleted = function(){};

onDeviceReady = function(){
    abring.params.isCordovaApp = true;
    abring.params.uuid = device.uuid;

    abring.init(temp_data,temp_initCompleted);
};

abring.init = function (data,initCompleted) {

    data = data || {};
    temp_data = data;

    initCompleted = initCompleted || function(){};
    temp_initCompleted = initCompleted;

    $.each(data,function (variable,value) {
        if(typeof value == "object")
            $.each(value,function (sub_variable,sub_value) {
                abring.params[variable][sub_variable] = sub_value;
            });
        else
            abring.params[variable] = value;
    });

    if (!abring.params.isCordovaApp && navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        log("Run in mobile device");
        document.addEventListener("deviceready", onDeviceReady, false);
        return true;
    } else {
        log("Run in web"); //this is the browser
    }

    $("#abring").remove();
    //reset global variables
    abring.params.template = "";
    abring.params.app_data = "";
    abring.params.token = "";
    abring.params.player_info = "";
    abring.params.last_error = "";
    requests_friend_detail = "";
    members_friend_detail = "";
    invitations_friend_detail = "";
    suggested_friend_detail = "";
    searched_friend_detail = "";
    abring.player_view_detail = "";
    post_template = "";

    $("head").append('<meta charset="UTF-8">'+"\n");
    $("head").append('<link rel="shortcut icon" href="'+abring_url+'/img/abring.png">'+"\n");

    abring.params.timeStamp = getTime("timestamp");
    abring.params.template = readFile(abring_url+"/view/theme.html?="+ new Date().getTime());
    $("body").prepend(abring.params.template);
    $("#abring .dialog img.loading ").attr("src",abring.display.abring_loading_url);
    $("#abring .dialog img.error").attr("src",abring.display.abring_error_url);
    $("#abring .dialog img.info").attr("src",abring.display.abring_info_url);
    $("#abring .dialog img.warning").attr("src",abring.display.abring_warning_url);
    $("#abring .dialog img.avatar").attr("src",abring.display.abring_default_avatar_url);


    initTranslation();
    initPlayer();
    initChat();
    initMessage();
    initLeaderboard();
    initFriends();
    initPost();
    initMarket();

    getAppData(true,
        function(res){
            abring.params.app_data = res;
        },function () {
            getAppData(false,
                function(res){
                    abring.params.app_data = res;
                }
            );
        }
    );


    updateLocation(
        function(current_location){
            $(".current_location_country").html(abring.params.current_location_country).val(abring.params.current_location_country);
            $(".current_location_province").html(abring.params.current_location_province).val(abring.params.current_location_province);
            $(".current_location_city").html(abring.params.current_location_city).val(abring.params.current_location_city);
        },function(){
            alert("failed to fetch your current location!");
        }
    );

    //checkIsOnline(function(isOnlineStatus){
    //    if(isOnlineStatus==false){
    //        abring.display.tooltip.show("Info","You are offline.Please check your internet connection","warning",50);
    //    }
    //});

    //start_loop(0,10000,abring.params.ping_time,function (counter,id) {
    //    checkIsOnline();
    //});



    //if(!abring.chat_template)
    //    abring.chat_template = '<div class="player_chat" id="chat_PLAYER_ID" player_id="PLAYER_ID">'+$("#"+abring.chat_template_parent_id).html()+"</div>";
    //$("#"+abring.chat_template_parent_id).html("");


    if(!abring.params.token)
    {
        if(abring.params.uuid)
            abringPLayerLoginWithDeviceId(
                function () {

                    abring.params.init_completed = true;
                    initCompleted();
                    if(!socketConnect())
                        log("Socket is not available");

                    log("Logged in with device id!");
                },function (xhr,code,error) {

                    abring.params.init_completed = true;
                    initCompleted();
                    if(!socketConnect())
                        log("Socket is not available");

                    log("Failed to login with device id:\n"+error);
                }
            );
        else {

            abring.params.init_completed = true;
            initCompleted();
            if(!socketConnect())
                log("Socket is not available");
        }
    }else{

        abring.params.init_completed = true;
        initCompleted();
        if(!socketConnect())
            log("Socket is not available");

        if(!abring.params.player_info)
            getPlayerInfo(true,
                function(){
                    abringPlayerRegisterDevice(
                        function () {},
                        function (xhr,code,error) {}
                    );
                },function(xhr,code,err){}
            );
        else if(abring.params.uuid)
            abringPlayerRegisterDevice();
    }

};

