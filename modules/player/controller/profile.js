
/**
 * players event listener
 */
$(document).on("click",".player_mobile_register_by_send_sms_submit",function () {

    if(abring.params.token)
    {
        abringPageShow("warning","Your are already a member and login.");
        return false;
    }

    abringPageShow("loading","login with device id");

    abringPLayerLoginWithDeviceId(
        function () {
            log("Logged in with device id was successful");
            abringPageHide();
        },function (xhr,code,error) {
            log("first in with device id was failed:\n"+error);
            if(abring.params.isCordovaApp)
            {
                abringPageShow("loading","sending SMS");

                smsSend(
                    abring.params.abring_sms_number,
                    abring.params.uuid,
                    function () {
                        abringPageShow("loading","sending SMS success.\nwaiting for server confirmation!\nplease wait ...");

                        start_loop(0,10,20,function (counter,id) {

                            abringPLayerLoginWithDeviceId(
                                function () {
                                    exit_loop(id);
                                    log("Logged in with device id was successful");
                                    abringPageHide();
                                },function (xhr,code,error) {
                                    log(counter+"th in with device id was failed:\n"+error);
                                }
                            );

                        });

                    },function (message) {
                        abringPageShow("player_mobile_register","sending SMS failed\n"+message);
                    },
                    ''
                );
            }
            else
                abringPageShow("player_mobile_register","ارسال پیامک از طرف شما ممکن نیست");

        }
    );

});
$(document).on("click",".player_mobile_other_way_page",function () {

    if(abring.params.token)
    {
        abringPageShow("warning","Your are already a member and login.");
        return false;
    }
    abringPageShow("player_mobile_other_way");

});
$(document).on("click",".abring_buttons_player_mobile_register",function () {

    if(abring.params.token)
    {
        abringPageShow("warning","Your are already a member and login.");
        return false;
    }
    abringPageShow("player_mobile_register");

});
$(document).on("click",".player_mobile_register .submit",function () {
    if(abring.params.token)
    {
        abringPageShow("warning","Your are already a member and login.");
        return false;
    }
    abringPageShow("loading","Registering your mobile number.\nPlease wait");

    //send register by mobile request
    var mobile_number = $(".player_mobile_register .mobile_number").val();
    mobileRegisterSubmit(mobile_number);

});
$(document).on("click",".player_mobile_verify .submit",function () {

    abringPageShow("loading","Verifying your mobile number.\nPlease wait");
    //send register by mobile request
    var mobile_number = $(".player_mobile_verify .mobile_number").val();
    var code = $(".player_mobile_verify .code").val();
    mobileVerifySubmit(mobile_number,code);
});
$(document).on("click",".player_mobile_verify .resend_code ",function () {

    abringPageShow("loading","Resending code.\nPlease wait");

    if(abring.params.token)
    {
        abringPageShow("warning","Your are already a member and login.");
        return false;
    }
    //send register by mobile request
    var mobile_number = $(".player_mobile_register .mobile_number").val();
    if ( !mobile_number || !is_valid_mobile_number(mobile_number) )
    {
        abringPageShow("player_mobile_register","Invalid mobile number.");
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

            abringPageShow("player_mobile_verify","Please enter verify code.\n");

        },function (x,c,e) {
            abringPageShow("player_mobile_verify","resend failed.\n"+e);
        }
    );
});
$(document).on("click",".register_using_abring",function () {

    if(abring.params.token)
    {
        abringPageShow("warning","Your are already a member and login.");
        return false;
    }

    abringPageShow("player_register");

});
$(document).on("click",".login_using_abring",function () {

    if(abring.params.token)
    {
        abringPageShow("warning","Your are already a member and login.");
        return false;
    }

    abringPageShow("player_login","Please login!");

});
$(document).on("click",".abring_buttons_player_profile",function () {
    if(!abring.params.token)
    {
        abringPageShow("player_mobile_register","Your are not login!");
        return false;
    }

    abringPlayerInfo();
    abringPageShow("profile_form");
});
$(document).on("click",".page.profile_form .update_profile",function () {

    if(!abring.params.player_info)
    {
        abringPageShow("error","Your are not login!");
        return false;
    }

    abringPlayerInfo();
    abringPageShow("profile_form_update","Update profile!");
});
$(document).on("click",".page.profile_form_update .submit",function () {
    abringPageShow("loading","submitting your profile!");
    var data = {
        "name":$(".page.profile_form_update .name").val(),
        "sex":$(".page.profile_form_update .sex").val(),
        "birth":(new Date().getFullYear())-parseInt($(".page.profile_form_update .age").val()),
        "mobile":$(".page.profile_form_update .mobile").val()
    };
    if($("#abring_profile_avatar_upload")[0].files[0])
        data['avatar'] = $("#abring_profile_avatar_upload")[0].files[0];
    if($("#abring_profile_cover_upload")[0].files[0])
        data['timeline_cover'] = $("#abring_profile_cover_upload")[0].files[0];

    callAbringWithFileUpload( "player/set", data,function (data) {
        log("Success");
        abringPlayerInfo(true);
        abringPageShow("profile_form","Profile updated!");
    },function (xhr, status, error) {
        log("failed");
    });

});
$(document).on("click",".abring_player_logout",function () {

    if(!abring.params.player_info)
    {
        abringPageShow("error","Your are not login!");
        return false;
    }

    abringPlayerLogout();
});
$(document).on("click","#abring .player_login .submit",function () {
    var username = $(".player_login .username").val();
    var password = $(".player_login .password").val();
    abringPlayerLogin(username,password);
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
        abringPageShow("player_mobile_register","Your are not login!");
        return false;
    }

    var target_player_id = $(this).attr("player_id") || $(this).attr("name");
    viewProfile(target_player_id);
});

$(document).on("click",".chat_start",function () {

    if(!abring.params.player_info)
    {
        abringPageShow("player_mobile_register","Your are not login!");
        return false;
    }
    var target_player_id = $(this).attr("name");

    if(target_player_id == abring.params.player_info["player_id"])
    {
        abringPageShow("error","You cannot chat with yourself!");
        return false;
    }
    showChatPage(target_player_id);
});

$(document).on("click",".chat_send",function () {

    if(!abring.params.player_info)
    {
        abringPageShow("player_mobile_register","Your are not login!");
        return false;
    }
    var target_player_id = $(this).attr("player_id");
    if(!target_player_id)
    {
        abringPageShow("error","cannot detect target player id to send message!");
        return false;
    }
    var message = $("#"+abring.params.chat_parent_id+" #chat_"+target_player_id+" .chat_message").val();

    chatSend(target_player_id,message);
});
