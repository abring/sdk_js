
/**
 * player functions
 */

var playerView = "";

var initPlayer = function (initPlayerSuccess,initPlayerFailed) {

    initPlayerSuccess = initPlayerSuccess || function () {};
    initPlayerFailed = initPlayerFailed || function () {};

    playerView = readFile(abring_url+"/modules/player/view/player.html");
    $("#abring").append(playerView);

    $.each(abring.player.pages,function (page_id,page) {
        page.getTheme(true);
    });


    abring.params.token = getCookie("token");

    if(abring.params.uuid){
        $(".device_id").html(abring.params.uuid).val(abring.params.uuid);
        $(".abring_sms_number").html(abring.params.abring_sms_number).val(abring.params.abring_sms_number);
    }else{
        $(".other_ways").hide();
    }

    if(abring.params.token) {
        getPlayerInfo(
            false,
            function (player_info) {
                abring.params.player_info = player_info;
                initPlayerSuccess();
            },function (x,c,e) {
                initPlayerFailed(x,c,e);
                if(abring.params.smsIsAllowed){
                    //login using send sms directly without intent
                    return false;
                }else{
                    //if login needed in application startup show player login page
                    return false;
                }
            }
        );
    }else{
        if(abring.params.smsIsAllowed){
            //login using send sms directly without intent
            return false;
        }else{
            //if login needed in application startup show player login page
            return false;
        }
    }
};

var playerIsLogin = function(){
    if(abring.params.player_info)
        return true;
    else
        return false;
};
var showMyProfile = function(subPageID){
    subPageID = subPageID || "login";
    abringPageHide();
    //$("#"+abring.player.parent_id+" .page").hide();
    //$("#"+abring.player.parent_id+" ."+subPageID).show();
    abring.display.showPageFunction(subPageID);
};
var viewProfile = function (other_player_id) {

    getOtherPlayerInfo(other_player_id,false,
        function (player_profile) {

            player_profile["name"] = player_profile["name"] || other_player_id;
            player_profile["avatar"] = player_profile["avatar"] || abring.params.abring_default_avatar_url;

            $("#"+abring.player.parent_id+" .player_view_details").html(
                abring.player_view_detail
                    .replaceAll("PLAYER_ID",other_player_id)
                    .replaceAll("PLAYER_NAME",player_profile["name"])
                    .replaceAll("PLAYER_IMG",player_profile["avatar"])
//            .replaceAll(abring.params.abring_default_avatar_url,player_profile["avatar"])
            );
            showMyProfile("player_view_details");
        },function (x,c,e) {
            abring.display.error.show(e);
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
                result["device_id"] = [];
                abring.params.player_info = result;
                if(abring.params.player_info["avatar"]=="undefined")
                    abring.params.player_info["avatar"] = "";

                setCookie("player_info",abring.params.player_info,100);

                getPlayerInfoSuccess(result);

                abring.player.onDataLoaded(abring.params.player_info);
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
        abring.player.onDataLoaded(abring.params.player_info);
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
            function (other_players_info) {
                $.each(other_players_info,function (index,other_player_info) {
                    if(!other_player_info["avatar"]) other_player_info["avatar"] = abring.display.default_avatar_url;
                    if(!other_player_info["name"]) other_player_info["name"] = other_player_info["player_id"];
                    if(!other_player_info["public"]) other_player_info["public"] = [];
                    var x = other_player_info["public"];
                    if(x.constructor.name=="String")
                        other_player_info["public"] = JSON.parse(other_player_info["public"]);
                    abring.params.other_players[other_player_info["player_id"]] = other_player_info;
                });
                setCookie("other_players",abring.params.other_players,100);
                if(other_players_info.length==1)
                    getOtherPlayerInfoSuccess(abring.params.other_players[player_id]);
                else
                    getOtherPlayerInfoSuccess(abring.params.other_players);
            },function (x,c,e) {
                getOtherPlayerInfoFailed(x,c,e);
            }
        );
    }else
        getOtherPlayerInfoSuccess(abring.params.other_players[player_id]);
};

var abringPlayerLogin = function (username, password , abringPlayerLoginSuccess) {
    abringPlayerLoginSuccess = abringPlayerLoginSuccess || function(){};
    abring.display.loading.show("logon to Abring\nPlease wait");
    if(abring.params.token)
        abring.player.onLogoutFunction();
    callAbringWithFileUpload("player/login",{"username":username,"password":password},
        function (res) {
            abring.params.token = res["token"];
            abring.params.player_info = res["player_info"];
            setCookie("token",abring.params.token,100);
            setCookie("player_info",abring.params.player_info,100);
            abring.display.hidePageFunction();
            abringPlayerLoginSuccess(res);
        },function (x,c,e) {
            abring.display.error.show(e);
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
                    abring.player.onLogoutFunction();
                    abring.display.hidePageFunction();
                    updateNewMessageTip(0);
                    abringPlayerLogoutSuccess(res);
                },
                function(x,c,e){
                    abring.display.hidePageFunction();
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
    {
        abring.player.onLogoutFunction();
        showMyProfile("player_mobile_register","Logout successfully!");
        updateNewMessageTip(0);
        abringPlayerLogoutSuccess();
    }
};
var abringPlayerRegister = function (username, password, variables, values) {
    abring.display.showPageFunction("loading");
    abring.params.token = callAbringWithFileUpload("player/register",{"username":username,"password":password,"variables":variables,"values":values},
        function (res) {

        },function (x,c,e) {
            abring.display.error.show(e);
        }
    );
    if(!abring.params.token)
    {
        $("#"+abring.player.parent_id+" .player_register .message").html("Invalid registration!\n"+abring.params.last_error);
        showMyProfile("player_register");
    }else{
        setCookie("token",abring.params.token,100);
        callAbringWithFileUpload("player/get",{},
            function(result){
                abring.params.player_info = result;
                setCookie("player_info",abring.params.player_info,100);
                abring.display.hidePageFunction();
            },
            function(){
                abring.display.hidePageFunction();
            }
        );
    }
    abringLoadingFinish();
};

var fillMyPlayerInfo = function (reset_cache,fillMyPlayerInfoSuccess) {
    fillMyPlayerInfoSuccess = fillMyPlayerInfoSuccess || function(){};
    abring.display.loading.show("loading profile","Please wait");
    var parent_id = abring.player.pages.my_profile.parent_id;
    var parent_id_update = abring.player.pages.my_profile_update.parent_id;
    $("."+parent_id).html(abring.player.pages.my_profile.getTheme());


    getPlayerInfo(reset_cache,
        function(){

            var age = "20";
            if(abring.params.player_info['birth'])
                age = (new Date().getFullYear())-abring.params.player_info['birth'];
            abring.params.player_info['avatar'] = abring.params.player_info['avatar'] || abring.params.abring_default_avatar_url;

            $("."+parent_id+" .username").html(abring.params.player_info['username']);
            $("."+parent_id+" .name").html(abring.params.player_info['name']);
            $("."+parent_id+" .avatar").attr("src",abring.params.player_info['avatar']);
            $("."+parent_id+" .profile-contain").css("background-image","url("+abring.params.player_info['timeline_cover']+")");
            $("."+parent_id+" .sex").html(abring.params.player_info['sex']);
            $("."+parent_id+" .age").html(age);
            $("."+parent_id+" .mobile").html(abring.params.player_info['mobile']);

            $("."+parent_id_update+" .username").val(abring.params.player_info['username']);
            $("."+parent_id_update+" .name").val(abring.params.player_info['name']);
            $("."+parent_id_update+" .age").val(age);
            $("."+parent_id_update+" .sex").val(abring.params.player_info['sex']);
            $("."+parent_id_update+" .mobile").val(abring.params.player_info['mobile']);
            $("."+parent_id_update+" .avatar").attr("src",abring.params.player_info['avatar']);
            $("."+parent_id_update+" .cover").attr("src",abring.params.player_info['timeline_cover']);
            abring.display.hidePageFunction();
            fillMyPlayerInfoSuccess();
        },
        function(){

            $("."+parent_id+" .username").html("");
            $("."+parent_id+" .name").html("");
            $("."+parent_id+" .avatar").attr("src","");
            $("."+parent_id+" .cover").attr("src","");
            abring.display.hidePageFunction();
        }
    );
};
var fillOtherPlayerInfo = function(other_player_id,fillOtherPlayerInfoSuccess,fillOtherPlayerInfoFailed){
    fillOtherPlayerInfoSuccess = fillOtherPlayerInfoSuccess || function(){};
    fillOtherPlayerInfoFailed = fillOtherPlayerInfoFailed || function(){};
    abring.display.loading.show("loading profile","Please wait");
    var parent_id = abring.player.pages.other_player_profile.parent_id;
    $("."+parent_id).html(abring.player.pages.other_player_profile.getTheme());
    getOtherPlayerInfo(
        other_player_id,false,
        function(other_player_info){
            other_player_info["avatar"] = other_player_info["avatar"] || abring.display.default_avatar_url;
            other_player_info["name"] = other_player_info["name"] || other_player_info["player_id"];
            $("."+parent_id+" .player_id")
                .attr("player_id",other_player_id)
                .attr("name",other_player_id);
            $("."+parent_id+" img.avatar").attr("src",other_player_info["avatar"]);
            $("."+parent_id+" span.player_name").html(other_player_info["name"]);

            abring.display.hidePageFunction();
            fillOtherPlayerInfoSuccess(other_player_info);
        },
        function(x,c,e){
            fillOtherPlayerInfoFailed(x,c,e);
        }
    );
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
                        fillMyPlayerInfo();
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

var abringPlayerMobileRegister = function(mobile_number,abringPlayerMobileRegisterSuccess,abringPlayerMobileRegisterFailed){
    abringPlayerMobileRegisterSuccess = abringPlayerMobileRegisterSuccess || function () {};
    abringPlayerMobileRegisterFailed = abringPlayerMobileRegisterFailed || function () {};

    if ( !mobile_number || !is_valid_mobile_number(mobile_number) )
    {
        abringPlayerMobileRegisterFailed("",400,"Invalid mobile number.");
        return false;
    }
    var data = {
        "mobile":mobile_number
    };

    $(".player_mobile_verify_mobile_number").val(mobile_number);
    $(".player_mobile_verify_mobile_number_label").html(mobile_number);

    callAbringWithFileUpload(
        "player/mobile-register",data,
        function () {
            abringPlayerMobileRegisterSuccess();
            //display verify page
            var second = 120;
            var timerInterval = setInterval( function(){
                $(".player_mobile_verify_resend_code").hide();
                $(".player_mobile_other_way_page").hide();
                second = second - 1;
                $(".player_mobile_retry_time").html("retry in "+ second + "s");
                if(second < 1 ){
                    clearInterval(timerInterval);
                    $(".player_mobile_retry_time").html("");
                    $(".player_mobile_verify_resend_code").show();
                    $(".player_mobile_other_way_page").show();
                }
            }, 1000);
            return true;
        },
        function (x,c,e) {
            abringPlayerMobileRegisterFailed(x,c,e);
            return false;
        }
    );
};
var abringPlayerMobileVerify = function (mobile,code,abringPlayerMobileVerifySuccess,abringPlayerMobileVerifyFailed) {
    abringPlayerMobileVerifySuccess = abringPlayerMobileVerifySuccess || function () {};
    abringPlayerMobileVerifyFailed = abringPlayerMobileVerifyFailed || function () {};
    var data = {
        "mobile":mobile,
        "code":code
    };
    callAbringWithFileUpload(
        "player/mobile-verify",data,
        function (result) {
            abring.player.onLoginFunction(result);
            abring.params.token = result['token'];
            setCookie("token",abring.params.token,100);
            abring.params.player_info = getPlayerInfo();
            socketConnect();
            abringPlayerMobileVerifySuccess(result);
            return true;
        },
        function (x,c,e) {
            abringPlayerMobileVerifyFailed(x,c,e);
            return false;
        }
    );
};
var abringPlayerMobileResendCode = function (abringPlayerMobileResendCodeSuccess,abringPlayerMobileResendCodeFailed) {
    abringPlayerMobileResendCodeSuccess = abringPlayerMobileResendCodeSuccess || function () {};
    abringPlayerMobileResendCodeFailed = abringPlayerMobileResendCodeFailed || function () {};
    var data = {
        "mobile":mobile,
        "code":code
    };
    callAbringWithFileUpload("player/mobile-verify",data,abringPlayerMobileResendCodeSuccess,abringPlayerMobileResendCodeFailed);
};

var abringPlayerUpdateTags = function(tags_to_add,tags_to_remove,updatePlayerTagsSuccess,updatePlayerTagsFailed){
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
