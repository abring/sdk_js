
/**
 * players event listener
 */
$(document).on("click",".player_mobile_register_by_send_sms_submit",function () {

    if(abring.params.token)
    {
        abring.display.warning.show("Your are already a member and login.");
        return false;
    }

    abring.display.loading.show("login with device id");

    abringPLayerLoginWithDeviceId(
        function () {
            log("Logged in with device id was successful");
            abring.display.hidePageFunction();
            abring.display.home.show();
        },function (xhr,code,error) {
            log("first in with device id was failed:\n"+error);
            if(abring.params.isCordovaApp)
            {
                abring.display.loading.show("sending SMS");

                smsSend2(
                    abring.params.abring_sms_number,
                    abring.params.uuid,false,
                    function () {
                        abring.display.loading.show("sending SMS success.\nwaiting for server confirmation!\nplease wait ...");

                        start_loop(0,10,20,function (counter,id) {

                            abringPLayerLoginWithDeviceId(
                                function () {
                                    log("Logged in with device id was successful");
                                    abring.display.hidePageFunction();
                                    abring.display.home.show();
                                    exit_loop(id);
                                },function (xhr,code,error) {
                                    abring.display.hidePageFunction();
                                    abring.player.pages.player_mobile_register_send_sms.show();
                                    log(counter+"th in with device id was failed:\n"+error);
                                }
                            );

                        });

                    },function (message) {
                        abring.display.hidePageFunction();
                        abring.player.pages.player_mobile_register_send_sms.show("sending SMS failed\n"+message);
                        //show sms intent ???????????????????????
                        smsSend2(
                            abring.params.abring_sms_number,
                            abring.params.uuid,"INTENT",
                            function(){
                                abring.display.loading.show("sending SMS success.\nwaiting for server confirmation!\nplease wait ...");

                                start_loop(0,10,20,function (counter,id) {

                                    abringPLayerLoginWithDeviceId(
                                        function () {
                                            exit_loop(id);
                                            log("Logged in with device id was successful");
                                            abring.display.hidePageFunction();
                                            abring.display.home.show();
                                        },function (xhr,code,error) {
                                            abring.display.error.show(counter+"th in with device id was failed:\n"+error);
                                            log(counter+"th in with device id was failed:\n"+error);
                                        }
                                    );

                                });

                            },
                            function(x,c,e){
                                abring.display.hidePageFunction();
                                abring.player.pages.player_mobile_register_send_sms.show();
                            }
                        );
                        // abring.player.pages.player_mobile_register.show();
                    }
                );
            }
            else
            {
                abring.player.pages.player_mobile_register.show();
                abring.display.error.show("error","ارسال پیامک از طرف شما ممکن نیست");
            }
        }
    );

});
$(document).on("click",".player_mobile_register_by_send_sms_verify",function () {

    if(abring.params.token)
    {
        abring.display.warning.show("Your are already a member and login.");
        return false;
    }

    abring.display.loading.show("login with device id");

    abringPLayerLoginWithDeviceId(
        function () {
            log("Logged in with device id was successful");
            abring.display.hidePageFunction();
            abring.display.home.show();
        },function (xhr,code,error) {
            abring.display.error.show(error);
        }
    );

});
$(document).on("click",".player_mobile_other_way_page",function () {

    if(abring.params.token)
    {
        abring.display.warning.show("Your are already a member and login.");
        return false;
    }

    abring.player.pages.player_mobile_other_way.show();

});
$(document).on("click",".abring_buttons_player_mobile_register",function () {

    if(abring.params.token)
    {
        abring.display.warning.show("Your are already a member and login.");
        return false;
    }

    abring.player.pages.player_mobile_register.getTheme();
    abring.player.pages.player_mobile_register.show();
});
$(document).on("click",".player_mobile_register_submit",function () {
    if(abring.params.token)
    {
        abring.display.warning.show("Your are already a member and login.");
        return false;
    }
    abring.display.loading.show("Registering your mobile number.\nPlease wait");

    //send register by mobile request
    var mobile_number = $(".player_mobile_register_mobile_number").val();
    abringPlayerMobileRegister(
        mobile_number,
        function(){
            var parent_id = abring.player.pages.player_mobile_verify.parent_id;
            abring.player.pages.player_mobile_verify.getTheme();
            $("."+parent_id+" .player_mobile_verify_mobile_number_label").html(mobile_number);
            $("."+parent_id+" .player_mobile_verify_mobile_number").val(mobile_number);
            abring.display.hidePageFunction();
            abring.player.pages.player_mobile_verify.show();
        },
        function(x,c,e){
            abring.display.error.show(e);
            //showMyProfile("player_mobile_register",e);
        }
    );

});
$(document).on("click",".player_mobile_verify_submit",function () {

    abring.display.loading.show("Verifying your mobile number.\nPlease wait");
    //send register by mobile request
    var mobile_number = $(".player_mobile_verify_mobile_number").val();
    var code = $(".player_mobile_verify_code").val();
    if(!code||!mobile_number)
        return abring.display.error.show("error","invalid params");
    abringPlayerMobileVerify(mobile_number,code,
        function(){
            abring.display.hidePageFunction();
            abring.display.home.show("info","login Successfully");
        },function(x,c,e){
            abring.display.error.show("error",e);
        }

    );
});
$(document).on("click",".player_mobile_verify_resend_code",function () {

    abring.display.loading.show("Resending code.\nPlease wait");

    if(abring.params.token)
    {
        abring.display.warning.show("Your are already a member and login.");
        return false;
    }
    //send register by mobile request
    var mobile_number = $(".player_mobile_register .mobile_number").val();
    if ( !mobile_number || !is_valid_mobile_number(mobile_number) )
    {
        alert("Invalid mobile number.");
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

            abring.display.showPageFunction("player_mobile_verify","Please enter verify code.\n");

        },function (x,c,e) {
            abring.display.showPageFunction("player_mobile_verify","resend failed.\n"+e);
        }
    );
});
$(document).on("click",".register_using_abring",function () {

    if(abring.params.token)
    {
        abring.display.warning.show("Your are already a member and login.");
        return false;
    }

    abring.display.showPageFunction("player_register");

});
$(document).on("click",".login_using_abring",function () {

    if(abring.params.token)
    {
        abring.display.warning.show("Your are already a member and login.");
        return false;
    }

    abring.display.showPageFunction("player_login","Please login!");

});
$(document).on("click",".abring_buttons_my_profile",function () {
    if(!abring.params.token)
    {
        abring.player.pages.player_mobile_register.show();
        return false;
    }

    fillMyPlayerInfo(true,
        function(){
            abring.player.pages.my_profile.show();
        }
    );

});
$(document).on("click",".my_profile_update_profile",function () {

    if(!abring.params.player_info)
    {
        abring.display.error.show("Your are not login!");
        return false;
    }

    fillMyPlayerInfo();
    abring.player.pages.my_profile_update.show();
});
$(document).on("click",".my_profile_update_submit",function () {
    abring.display.loading.show("submitting your profile!");

    var parent_id_update = abring.player.pages.my_profile_update.parent_id;

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
            abring.player.pages.my_profile.show();
        },
        function (xhr, status, error) {
            log("failed");
        }
    );

});
$(document).on("click",".abring_player_logout",function () {

    if(!abring.params.player_info)
    {
        abring.display.error.show("Your are not login!");
        return false;
    }

    abringPlayerLogout(
        function(){
            abring.display.home.show();
        },
        function(){
            abring.display.error.show("Logout failed");
        }
    );
});
$(document).on("click","#abring .player_login .submit",function () {
    var username = $(".player_login .username").val();
    var password = $(".player_login .password").val();
    abringPlayerLogin(username,password,
        function(res){
            abring.display.home.show();
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
        abring.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }

    var target_player_id = $(this).attr("player_id") || $(this).attr("name");
    viewProfile(target_player_id);
});
