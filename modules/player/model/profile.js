
/**
 * player functions
 */

var playerView = "";

var initPlayer = function () {
    playerView = readFile("abring/modules/player/view/player.html");
    $("#"+abring.params.player_parent_id).html(playerView);
    abring.params.player_view_detail = $("#"+abring.params.player_parent_id+" .player_view_details").html();
    $("#"+abring.params.player_parent_id+" .friends_list .player_view_details *").remove();
    if(!abring.params.player_info)
    {
        if(abring.params.smsIsAllowed){
            //login using send sms directly without intent
        }else{
            //if login needed in application startup show player login page
        }
    }
};

var player_loading_start = function () {

    abringPageShow("loading","loading player data.");
    abringLoadingStart();

};
var player_loading_finish = function () {
    abringPageHide();
};
var player_show_page = function () {
    abringPageShow("player");
};


var viewProfile = function (other_player_id) {

    getOtherPlayerInfo(other_player_id,false,
        function (player_profile) {

            player_profile["name"] = player_profile["name"] || other_player_id;
            player_profile["avatar"] = player_profile["avatar"] || abring.params.abring_default_avatar_url;

            $("#"+abring.params.player_parent_id+" .player_view_details").html(
                abring.params.player_view_detail
                    .replaceAll("PLAYER_ID",other_player_id)
                    .replaceAll("PLAYER_NAME",player_profile["name"])
                    .replaceAll("PLAYER_IMG",player_profile["avatar"])
//            .replaceAll(abring.params.abring_default_avatar_url,player_profile["avatar"])
            );
            abringPageShow("player_view_details");
        },function (x,c,e) {
            abringPageShow("error",e);
        }
    );

};
var getPlayerInfo = function (resetCache,getPlayerInfoSuccess,getPlayerInfoFailed) {
    abring.params.player_info = getCookie("player_info");
    getPlayerInfoSuccess = getPlayerInfoSuccess || function(){};
    getPlayerInfoFailed = getPlayerInfoFailed || function(){};
    if( resetCache || (!abring.params.player_info && abring.params.token) )
    {
        callAbringWithFileUpload(
            "player/get",
            {},
            function(result){
                abring.params.player_info = result;
                if(abring.params.player_info["avatar"]=="undefined") abring.params.player_info["avatar"] = "";
                setCookie("player_info",abring.params.player_info,100);
                getPlayerInfoSuccess(result);
            },function(){
                getPlayerInfoFailed();
                log("read player info failed!");
            }
        );
        //abring.params.player_info = callAbring("player/get");
        //if(abring.params.player_info["avatar"]=="undefined") abring.params.player_info["avatar"] = "";
        //setCookie("player_info",abring.params.player_info,100);
        return false;
    }else{
        getPlayerInfoSuccess(abring.params.player_info);
        return abring.params.player_info;
    }
};
var getOtherPlayerInfo = function (player_id,resetCache,getOtherPlayerInfoSuccess,getOtherPlayerInfoFailed) {

    resetCache = resetCache || false;
    getOtherPlayerInfoSuccess = getOtherPlayerInfoSuccess || function () {};
    getOtherPlayerInfoFailed = getOtherPlayerInfoFailed || function () {};

    if(!abring.params.other_players[player_id])
        abring.params.other_players = getCookie("other_players") || {};
    if( resetCache || !abring.params.other_players[player_id] )
    {
        callAbringWithFileUpload(
            "player/get-multiple",
            {"player_id":player_id},
            function (other_player_info) {
                $.each(other_player_info,function (index,other_player_info) {
                    if(!other_player_info["avatar"]) other_player_info["avatar"] = "";
                    if(!other_player_info["public"]) other_player_info["public"] = [];
                    var x = other_player_info["public"];
                    if(x.constructor.name=="String")
                        other_player_info["public"] = JSON.parse(other_player_info["public"]);
                    abring.params.other_players[other_player_info["player_id"]] = other_player_info;
                });
                setCookie("other_players",abring.params.other_players,100);
                getOtherPlayerInfoSuccess(abring.params.other_players[player_id]);
            },function (x,c,e) {
                getOtherPlayerInfoFailed(x,c,e);
            }
        );
    }else
        getOtherPlayerInfoSuccess(abring.params.other_players[player_id]);
};
var abringPlayerMobileRegister = function () {
};
var abringPlayerMobileVerify = function () {
};
var abringPlayerMobileResendCode = function () {
};
var abringPlayerLogin = function (username, password) {
    abringPageShow("loading","logon to Abring\nPlease wait");
    if(abring.params.token)
        abringPlayerLogout();
    callAbringWithFileUpload("player/login",{"username":username,"password":password},
        function (res) {
            abring.params.token = res["token"];
            abring.params.player_info = res["player_info"];
            setCookie("token",abring.params.token,100);
            setCookie("player_info",abring.params.player_info,100);
            abringPageHide();
        },function (x,c,e) {
            abringPageShow("error",e);
        }
    );
};
var abringPlayerLogout = function (abringPlayerLogoutSuccess,abringPlayerLogoutFailed) {

    abringPlayerLogoutSuccess = abringPlayerLogoutSuccess || function () {};
    abringPlayerLogoutFailed = abringPlayerLogoutFailed || function () {};

    if(abring.params.player_info || abring.params.token)
    {
        if(abring.params.token)
            callAbringWithFileUpload(
                "player/logout",{},
                function(res){
                    abringPlayerLogoutSuccess(res);
                    abringPageShow("player_mobile_register","Logout successfully!");
                },
                function(x,c,e){
                    abringPlayerLogoutFailed(x,c,e);
                }
            );
        abring.params.token = false;
        setCookie("token",abring.params.token,0);
        abring.params.player_info = false;
        setCookie("player_info",abring.params.player_info,0);
        abring.params.other_players = false;
        setCookie("other_players",abring.params.other_players,0);
    }else
        abringPlayerLogoutSuccess();
};
var abringPlayerRegisterDevice = function(abringPlayerRegisterDeviceSuccess,abringPlayerRegisterDeviceFailed){

    abringPlayerRegisterDeviceSuccess = abringPlayerRegisterDeviceSuccess || function(){};
    abringPlayerRegisterDeviceFailed = abringPlayerRegisterDeviceFailed || function(){};

    if(!abring.params.token || !abring.params.player_info || !abring.params.uuid)
    {
        abringPlayerRegisterDeviceFailed();
    }else if(abring.params.player_info["device_id"] && abring.params.player_info["device_id"].indexOf(abring.params.uuid)!=-1 )
    {
        abringPlayerRegisterDeviceSuccess();
    }else if(!abring.params.player_info["device_id"] || abring.params.player_info["device_id"].indexOf(abring.params.uuid)==-1 )
    {
        callAbringWithFileUpload(
            "player/register-device-id",
            {"device_id":abring.params.uuid},
            function(res){
                abring.params.player_info["device_id"].push(abring.params.uuid);
                setCookie("player_info",abring.params.player_info);
                abringPlayerRegisterDeviceSuccess();
            },
            function(xhr,code,error){
                abringPlayerRegisterDeviceFailed();
            }
        );
    }else{
        abringPlayerRegisterDeviceFailed();
    }
};
var abringPlayerRegister = function (username, password, variables, values) {
    abringLoadingStart();
    abring.params.token = callAbringWithFileUpload("player/register",{"username":username,"password":password,"variables":variables,"values":values},
        function (res) {

        },function (x,c,e) {
            abringPageShow("error",e);
        }
    );
    if(!abring.params.token)
    {
        $("#"+abring.params.player_parent_id+" .player_register .message").html("Invalid registration!\n"+abring.params.last_error);
        abringPageShow("player_register");
    }else{
        setCookie("token",abring.params.token,100);
        callAbringWithFileUpload("player/get",{},
            function(result){
                abring.params.player_info = result;
                setCookie("player_info",abring.params.player_info,100);
                abringPageHide();
            },
            function(){
                abringPageHide();
            }
        );
    }
    abringLoadingFinish();
};
var abringPlayerInfo = function (reset_cache) {
    getPlayerInfo(reset_cache);
    if(abring.params.player_info)
    {
        var age = "20";
        if(abring.params.player_info['birth'])
            age = (new Date().getFullYear())-abring.params.player_info['birth'];
        abring.params.player_info['avatar'] = abring.params.player_info['avatar'] || abring.params.abring_default_avatar_url;

        $("#"+abring.params.player_parent_id+" .profile_form .username").html(abring.params.player_info['username']);
        $("#"+abring.params.player_parent_id+" .profile_form .name").html(abring.params.player_info['name']);
        $("#"+abring.params.player_parent_id+" .profile_form .avatar").attr("src",abring.params.player_info['avatar']);
        $("#"+abring.params.player_parent_id+" .profile-contain").css("background-image","url("+abring.params.player_info['timeline_cover']+")");
        $("#"+abring.params.player_parent_id+" .profile_form .sex").html(abring.params.player_info['sex']);
        $("#"+abring.params.player_parent_id+" .profile_form .age").html(age);
        $("#"+abring.params.player_parent_id+" .profile_form .mobile").html(abring.params.player_info['mobile']);

        $("#"+abring.params.player_parent_id+" .profile_form_update .username").val(abring.params.player_info['username']);
        $("#"+abring.params.player_parent_id+" .profile_form_update .name").val(abring.params.player_info['name']);
        $("#"+abring.params.player_parent_id+" .profile_form_update .age").val(age);
        $("#"+abring.params.player_parent_id+" .profile_form_update .sex").val(abring.params.player_info['sex']);
        $("#"+abring.params.player_parent_id+" .profile_form_update .mobile").val(abring.params.player_info['mobile']);
        $("#"+abring.params.player_parent_id+" .profile_form_update .avatar").attr("src",abring.params.player_info['avatar']);
        $("#"+abring.params.player_parent_id+" .profile_form_update .cover").attr("src",abring.params.player_info['timeline_cover']);
    }else{
        $("#"+abring.params.player_parent_id+" .profile_form .username").html("");
        $("#"+abring.params.player_parent_id+" .profile_form .name").html("");
        $("#"+abring.params.player_parent_id+" .profile_form .avatar").attr("src","");
        $("#"+abring.params.player_parent_id+" .profile_form .cover").attr("src","");
        abringPageHide();
    }
};
var abringPLayerLoginWithDeviceId = function(loginWithDeviceIdSuccess,loginWithDeviceIdFailed){

    if(!abring.params.uuid)
    {
        log("login with device id failed.\ndevice id not set",true);
        loginWithDeviceIdFailed();
        return false;
    }
    if(abring.params.token || abring.params.player_info)
    {
        log("login with device id failed.\nYou are already login",true);
        loginWithDeviceIdFailed();
        return false;
    }

    callAbringWithFileUpload( //call every 20 seconds for 10 times
        "player/login-with-device-id",
        {"device_id":abring.params.uuid},
        function(result,status,xhr){
            if(result['token']&&result['token'].length>10)
            {
                log("login with device id was successful",true);
                abring.params.token = result['token'];
                setCookie("token",abring.params.token,100, function () {
                    getPlayerInfo(true,function () {
                        log("login with device id was successful - get player info successful",true);
                        abringPlayerInfo();
                        loginWithDeviceIdSuccess();
                    },function (xhr,code,error) {
                        loginWithDeviceIdFailed(xhr,code,error+"\nlogin with device id was successful - get player info failed");
                    });
                });
            }else {
                loginWithDeviceIdFailed(xhr, "400", "login with device id was successful but result was not ok");
                log(JSON.parseString(result), true);
            }
        },
        function(xhr,code,error){
            loginWithDeviceIdFailed(xhr,code,error);
        }
    );
};
var mobileRegisterSubmit = function(mobile_number){

    if ( !mobile_number || !is_valid_mobile_number(mobile_number) )
    {
        abringPageShow("player_mobile_register","Invalid mobile number.");
        return false;
    }
    var data = {
        "mobile":mobile_number
    };

    $(".player_mobile_verify .mobile_number").val(mobile_number);
    $(".player_mobile_verify .mobile_number_label").html(mobile_number);

    callAbringWithFileUpload("player/mobile-register",data,mobileRegisterSuccess,mobileRegisterFail);
};
var mobileRegisterSuccess = function () {

    //display verify page
    abringPageShow("player_mobile_verify","Please enter verify code.\n");
    var secound = 120;
    var timerInterval = setInterval( function(){
        $(".resend_code").hide();
        $(".player_mobile_other_way_page").hide();
        secound = secound - 1;
        $(".player_mobile_retry_time").html("retry in "+ secound + "s");
        if(secound < 1 ){
            clearInterval(timerInterval);
            $(".player_mobile_retry_time").html("");
            $(".resend_code").show();
            $(".player_mobile_other_way_page").show();
        }
    }, 1000);
    return true;
};
var mobileRegisterFail = function () {
    abringPageShow("player_mobile_register","registration failed.\n"+abring.params.last_error);
    return false;
};

var mobileVerifySubmit = function (mobile,code) {
    var data = {
        "mobile":mobile,
        "code":code
    };
    callAbringWithFileUpload("player/mobile-verify",data,mobileVerifySuccess,mobileVerifyFail);
};
var mobileVerifySuccess = function (result) {
    abring.params.token = result['token'];
    setCookie("token",abring.params.token,100);
    abring.params.player_info = getPlayerInfo();
    abringPageHide();
    return true;
};
var mobileVerifyFail = function () {
    abringPageShow("player_mobile_verify","Verification failed.\n"+abring.params.last_error);
    return false;
};



//chat with just one people ???????????????
var target_player_info = {};
var chatStart = function(target_player_id)
{
    getOtherPlayerInfo(target_player_id,false,
        function (target_player_info ) {

            //init chat if needed ????????
            if(!socketConnect())
                abringPageShow("error","error connecting to socket server");

            //fill display info ????????
            abringPageShow("abring_chat",target_player_info["name"]);

        },function (x,c,e) {
            abringPageShow("error",e);
        }
    );
};
var getTargetPlayerInfoSuccess = function (result) {

    target_player_info = result;

    if(!socketConnect())
        abringPageShow("error","error connecting to socket server");

    //fill display info ????????
    abringPageShow("abring_chat",target_player_info["name"]);

    //init chat if needed ????????
};
var getTargetPlayerInfoFailed = function () {
    abringPageShow("error","error loading target player info");
};

var chatSend = function (message) {
    socketSendMessage(">unicast>"+target_player_info["player_id"]+">chat:"+message);
    $(".chat_message").val('');
    $(".chat_content").append("<div class='chat-result-contain my-chat-contain'><span class='my-chat-name chat-name'>"+abring.params.player_info["name"]+"</span><span class='my-chat-message chat-message'>"+message+"</span></div");
};
socketMessageReceived = function (message) {

    log("server message:"+message);

    //get message parts
    var message_parts = message.split(":");

    //get current action based on message (chat - force update - ...)
    var message_type = message_parts[1];
    //raise correct page if needed (if is chat will raise chat page)
    if(message_parts[0]=="0")
    {
        if(message_type==-1)
        {
            log("login to socket server failed!");
        }
        if(message_type==0)
        {
            log("socket reply success");
        }
        log("socket reply");
        return true;
    }

    //else it is not 0 it means we are in broadcast situation

    var target_player_id = message_parts[0];//get player id that message comes from
    //user defined types
    if(message_type=="chat")
    {
        log("process chat");
        getOtherPlayerInfo(target_player_id,false,
            function (target_player_info) {

                if(current_page!="abring_chat") {
                    var beepSound = $("#beep-sound")[0];
                    beepSound.play();
                    chatStart(target_player_id);
                }
                message = message.replace(message_parts[0]+":"+message_parts[1]+":","");
                $(".chat_content").append("<div class='chat-result-contain your-chat-contain'><span class='your-chat-name chat-name'>"+target_player_info["name"]+"</span><span class='your-chat-message chat-message'>"+message+"</span></div>");

            },function (x,c,e) {
                abringPageShow("error",e);
            }
        );
    }
};
var chatFinish = function()
{
    target_player_info = {};
    socketClose();
};
var updatePlayerTags = function(tags_to_add,tags_to_remove,updatePlayerTagsSuccess,updatePlayerTagsFailed)
{
    updatePlayerTagsSuccess = updatePlayerTagsSuccess || function(){};
    updatePlayerTagsFailed = updatePlayerTagsFailed || function(){};
    if(!tags_to_add && !tags_to_remove)
    {
        updatePlayerTagsFailed();
    }else if(!tags_to_add && tags_to_remove)
    {
        callAbringWithFileUpload(
            "player/del-tag",
            {"tags":tags_to_remove},
            function(res){
                updatePlayerTagsSuccess();
            },
            function(){
                updatePlayerTagsFailed();
            }
        );
    }
    if(tags_to_add)
    {
        var data = {};
        if(tags_to_remove)
            data = {"tags":tags_to_add,"_tags":tags_to_remove};
        else
            data = {"tags":tags_to_add};
        callAbringWithFileUpload(
            "player/add-tag",
            data,
            function(res){
                updatePlayerTagsSuccess();
            },
            function(){
                updatePlayerTagsFailed();
            }
        );
    }
};