
/**
 * players event listener
 */
$(document).on("click",".player_mobile_register_by_send_sms_submit",function () {

    if(abring.params.token)
    {
        abring.params.display.warning.show("Your are already a member and login.");
        return false;
    }

    abring.params.display.loading.show("login with device id");

    abringPLayerLoginWithDeviceId(
        function () {
            log("Logged in with device id was successful");
            abring.params.display.hidePageFunction();
        },function (xhr,code,error) {
            log("first in with device id was failed:\n"+error);
            if(abring.params.isCordovaApp)
            {
                abring.params.display.loading.show("sending SMS");

                smsSend(
                    abring.params.abring_sms_number,
                    abring.params.uuid,
                    function () {
                        abring.params.display.loading.show("sending SMS success.\nwaiting for server confirmation!\nplease wait ...");

                        start_loop(0,10,20,function (counter,id) {

                            abringPLayerLoginWithDeviceId(
                                function () {
                                    exit_loop(id);
                                    log("Logged in with device id was successful");
                                    abring.params.display.hidePageFunction();
                                },function (xhr,code,error) {
                                    log(counter+"th in with device id was failed:\n"+error);
                                }
                            );

                        });

                    },function (message) {
                        abring.params.player.showPageFunction("player_mobile_register","sending SMS failed\n"+message);
                    },
                    ''
                );
            }
            else
            {
                abring.params.player.pages.player_mobile_register.show();
                abring.params.display.error.show("error","ارسال پیامک از طرف شما ممکن نیست");
            }
        }
    );

});
$(document).on("click",".player_mobile_other_way_page",function () {

    if(abring.params.token)
    {
        abring.params.display.warning.show("Your are already a member and login.");
        return false;
    }

    abring.params.player.pages.player_mobile_other_way.show();

});
$(document).on("click",".abring_buttons_player_mobile_register",function () {

    if(abring.params.token)
    {
        abring.params.display.warning.show("Your are already a member and login.");
        return false;
    }

    abring.params.player.pages.player_mobile_register.getTheme();
    abring.params.player.pages.player_mobile_register.show();
});
$(document).on("click",".player_mobile_register_submit",function () {
    if(abring.params.token)
    {
        abring.params.display.warning.show("Your are already a member and login.");
        return false;
    }
    abring.params.display.loading.show("Registering your mobile number.\nPlease wait");

    //send register by mobile request
    var mobile_number = $(".player_mobile_register_mobile_number").val();
    abringPlayerMobileRegister(
        mobile_number,
        function(){
            var parent_id = abring.params.player.pages.player_mobile_verify.parent_id;
            abring.params.player.pages.player_mobile_verify.getTheme();
            $("."+parent_id+" .player_mobile_verify_mobile_number_label").html(mobile_number);
            $("."+parent_id+" .player_mobile_verify_mobile_number").val(mobile_number);
            abring.params.display.hidePageFunction();
            abring.params.player.pages.player_mobile_verify.show();
        },
        function(x,c,e){
            abring.params.display.showPageFunction("error",e);
            //showMyProfile("player_mobile_register",e);
        }
    );

});
$(document).on("click",".player_mobile_verify_submit",function () {

    abring.params.display.loading.show("Verifying your mobile number.\nPlease wait");
    //send register by mobile request
    var mobile_number = $(".player_mobile_verify_mobile_number").val();
    var code = $(".player_mobile_verify_code").val();
    if(!code||!mobile_number)
        return abring.params.display.error.show("error","invalid params");
    abringPlayerMobileVerify(mobile_number,code,
        function(){
            abring.params.display.hidePageFunction();
            abring.params.display.home.show("info","login Successfully");
        },function(x,c,e){
            abring.params.display.error.show("error",e);
        }

    );
});
$(document).on("click",".player_mobile_verify .resend_code ",function () {

    abring.params.display.loading.show("Resending code.\nPlease wait");

    if(abring.params.token)
    {
        abring.params.display.warning.show("Your are already a member and login.");
        return false;
    }
    //send register by mobile request
    var mobile_number = $(".player_mobile_register .mobile_number").val();
    if ( !mobile_number || !is_valid_mobile_number(mobile_number) )
    {
        abring.params.player.showPageFunction("player_mobile_register","Invalid mobile number.");
        return false;
    }
    var data = {
        "mobile":mobile_number
    };
    callAbringWithFileUpload("player/mobile-register",data,
        function (res) {

            //display verify page
            $(".player_mobile_verify .mobile_number").val(mobile_number);
            $(".player_mobile_verify .mobile_number_label").html(mobile_number);

            abring.params.player.showPageFunction("player_mobile_verify","Please enter verify code.\n");

        },function (x,c,e) {
            abring.params.player.showPageFunction("player_mobile_verify","resend failed.\n"+e);
        }
    );
});
$(document).on("click",".register_using_abring",function () {

    if(abring.params.token)
    {
        abring.params.display.warning.show("Your are already a member and login.");
        return false;
    }

    abring.params.player.showPageFunction("player_register");

});
$(document).on("click",".login_using_abring",function () {

    if(abring.params.token)
    {
        abring.params.display.warning.show("Your are already a member and login.");
        return false;
    }

    abring.params.player.showPageFunction("player_login","Please login!");

});
$(document).on("click",".abring_buttons_my_profile",function () {
    if(!abring.params.token)
    {
        abring.params.player.pages.player_mobile_register.show();
        return false;
    }

    abring.params.player.pages.my_profile.getTheme();
    fillMyPlayerInfo(true,
        function(){
            abring.params.player.pages.my_profile.show();
        }
    );

});
$(document).on("click",".my_profile_update_profile",function () {

    if(!abring.params.player_info)
    {
        abring.params.display.error.show("Your are not login!");
        return false;
    }

    fillMyPlayerInfo();
    abring.params.player.pages.my_profile_update.show();
});
$(document).on("click",".my_profile_update_submit",function () {
    abring.params.display.loading.show("submitting your profile!");

    var parent_id_update = abring.params.player.pages.my_profile_update.parent_id;

    var data = {
        "name":$("."+parent_id_update+" .name").val(),
        "sex":$("."+parent_id_update+" select.sex").val(),
        "birth":(new Date().getFullYear())-parseInt($("."+parent_id_update+" .age").val()),
        "mobile":$("."+parent_id_update+" .mobile").val()
    };
    if($("#abring_profile_avatar_upload")[0].files[0])
        data['avatar'] = $("#abring_profile_avatar_upload")[0].files[0];
    if($("#abring_profile_cover_upload")[0].files[0])
        data['timeline_cover'] = $("#abring_profile_cover_upload")[0].files[0];

    callAbringWithFileUpload( "player/set", data,
        function (data) {
            abring.params.player.pages.my_profile.show();
        },
        function (xhr, status, error) {
            log("failed");
        }
    );

});
$(document).on("click",".abring_player_logout",function () {

    if(!abring.params.player_info)
    {
        abring.params.display.error.show("Your are not login!");
        return false;
    }

    abringPlayerLogout(
        function(){
            abring.params.display.home.show();
        },
        function(){
            abring.params.display.error.show("Logout failed");
        }
    );
});
$(document).on("click","#abring .player_login .submit",function () {
    var username = $(".player_login .username").val();
    var password = $(".player_login .password").val();
    abringPlayerLogin(username,password,
        function(res){
            abring.params.display.home.show();
        }
    );
});
$(document).on("click","#abring .player_register .submit",function () {
    var username = $(".player_register .username").val();
    var password = $(".player_register .password").val();
    var name = $(".player_register .name").val();
    var avatar = $(".player_register .password").val();
    var variables = "name,avatar";
    var values = name+","+avatar;
    abringPlayerRegister(username,password,variables,values);
});

$(document).on("click",".view_profile",function () {
    
    if(!abring.params.player_info)
    {
        abring.params.player.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }

    var target_player_id = $(this).attr("player_id") || $(this).attr("name");
    viewProfile(target_player_id);
});

$(document).on("click",".chat_start",function () {

    if(!abring.params.player_info)
    {
        abring.params.display.error.show("Your are not login!");
        return false;
    }
    var target_player_id = $(this).attr("player_id");

    if(target_player_id == abring.params.player_info["player_id"])
    {
        abring.params.display.error.show("You cannot chat with yourself!");
        return false;
    }
    abring.params.player.pages.abring_chat.show(target_player_id);
});

$(document).on("click",".chat_send",function () {
    if(!abring.params.player_info)
    {
        abring.params.display.error.show("Your are not login!");
        return false;
    }
    var target_player_id = $(this).attr("player_id");
    if(!target_player_id)
    {
        abring.params.display.error.show("cannot detect target player id to send message!");
        return false;
    }
    var parent_id = abring.params.player.pages.abring_chat.parent_id;
    //var message = $("."+parent_id+" #chat_"+target_player_id+" .chat_message").val();
    var message = $("."+parent_id+" #chat_"+target_player_id+" .chat_message").val();

    abring.params.player.pages.abring_chat.i_say(target_player_id,message);
    chatSend(target_player_id,message);
});
