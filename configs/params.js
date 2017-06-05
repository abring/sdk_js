abring.params = {
//configs
    "app" : "ir.abring.sdk",
    "ws_base_url" : "http://ws.v3.abring.ir/index.php?r=",

    "leaderboard":{
        "parent_id" : "abring_leaderboard"
    },

    "friends":{
        "parent_id" : "abring_friends"
    },

    "posts_parent_id" : "frog_posts", //use custom parent to show posts,

    "sounds":{
        "beep" : abring_url+"/sound/beep.wav",
        "notification" : abring_url+"/sound/notification.mp3"
    },


//global variables
    "timeStamp" : 0,
    "badgeNumber" : 0, //an small number shown in corner of application icon
    "template" : "",
    "app_data" : "",
    "last_error" : "",
    "token" : "",
    "isCordovaApp" : false,
    "other_players" : {},
    "smsIsAllowed" : false,
    "isOnline" : true,
    "player_info":{},
    "player_view_detail":{},

    "current_location_latitude" : 0,
    "current_location_longitude" : 0,
    "current_location_country" : "", //default is ""
    "current_location_province" : "", //default is ""
    "current_location_city" : "",//default is ""

    "socketDomain" : '185.116.160.61',
    "socketPort" : 18000,
    "socketConnectFunction" : function(){return on_socket_connect()},
    "socketCloseFunction" : function(){return on_socket_close()},
    "socketMessageFunction" : function(from_player_id,message){return abringOnPlayerSocketMessage(from_player_id,message)},
    "socketObject" : null,
    "socketRetryInterval" : 5,
    "socketRetryIsRunning" : false,

    "chat_parent_id" : "abring_chat",
    "chatMessageFunction" : function(from_player_info,message){return abringOnPlayerChatMessage(from_player_info,message)},
    "chat_template_parent_id" : "abring_chat_template",
    "chat_show_page_function" : function(target_player_info){return chat_show_page(target_player_info)},

    "abring_sms_number" : "10005769297561",
    "uuid" : "", //device's Universally Unique Identifier,

    "ping_time" : 30,
    "cookie_max_size":4000
};

abring.params.display ={
    "current_page" : "",
    "splashTime" : 0,
    "showPageFunction":function (pageID,title,message) {
        abringPageHide();
        abring.params.display.current_page = pageID;
        return abringPageShow(pageID,title,message);
    },
    "hidePageFunction":function () {
        abring.params.display.current_page = "";
        return abringPageHide();
    },
    "home":{
        "parent_id":"home",
        "show":function(title,message) {
            abring.params.display.current_page = abring.params.display.home.parent_id;
            return abringPageHide();
        }
    },
    "loading":{
        "parent_id":"loading",
        "url" : abring_url+"/img/loading.gif",
        "show":function(title,message){
            var pageID = abring.params.display.loading.parent_id;
            abringPageHide();
            abring.params.display.current_page = pageID;
            return abringPageShow(pageID,title,message);}
    },
    "error":{
        "parent_id":"error",
        "url" : abring_url+"/img/error.gif",
        "show":function(title,message){
            var pageID = abring.params.display.error.parent_id;
            abringPageHide();
            abring.params.display.current_page = pageID;
            return abringPageShow(pageID,title,message);}
    },
    "info":{
        "parent_id":"info",
        "url" : abring_url+"/img/info.gif",
        "show":function(title,message){
            var pageID = abring.params.display.info.parent_id;
            abringPageHide();
            abring.params.display.current_page = pageID;
            return abringPageShow(pageID,title,message);}
    },
    "warning":{
        "parent_id":"warning",
        "url" : abring_url+"/img/warning.gif",
        "show":function(title,message){
            var pageID = abring.params.display.warning.parent_id;
            abringPageHide();
            abring.params.display.current_page = pageID;
            return abringPageShow(pageID,title,message);}
    },
    "confirm":{
        "parent_id":"confirm",
        "url" : abring_url+"/img/warning.gif",
        "show":function(title,message){
            var pageID = abring.params.display.confirm.parent_id;
            abringPageHide();
            abring.params.display.current_page = pageID;
            return abringPageShow(pageID,title,message);}
    },
    "tooltip":{
        "parent_id":"tooltip",
        "url" : abring_url+"/img/info.gif",
        "time" : 5,
        "show":function(title,message,type,wait) {
            var pageID = abring.params.display.tooltip.parent_id;

            title = title || "";
            message = message || "";
            type = type || "info";
            wait = wait || abring.params.display.tooltip.time;

            abringPageHide();
            abringPageShow(type,title, message);
            setTimeout(function () {
                abringPageHide();
            }, wait * 1000);
        }
    },
    "logo_url" : abring_url+"/img/abring.png",
    "default_avatar_url" : abring_url+"/img/default_avatar.png"

};

abring.params.player = {
    "pages":{
        "my_profile":{
            "parent_id":"my_profile",
            "theme":"",
            "getTheme":function(){
                var theme = abring.params.player.pages.my_profile.theme;
                if(!theme)
                    theme = abring.params.player.pages.my_profile.theme =
                        $("#abring .my_profile").html();
                $("#abring .my_profile").html("");
                var parent_id = abring.params.player.pages.my_profile.parent_id;
                $("."+parent_id).html(theme);
                return abring.params.player.pages.my_profile.theme;
            },
            "show":function(){
                fillMyPlayerInfo(true);
                var parent_id = abring.params.player.pages.my_profile.parent_id;
                abring.params.display.showPageFunction(parent_id);
            }
        },
        "other_player_profile":{
            "parent_id":"player_view_details",
            "theme":"",
            "getTheme":function(){
                var theme = abring.params.player.pages.other_player_profile.theme;
                if(!theme)
                    theme = abring.params.player.pages.other_player_profile.theme =
                        $("#abring .player_view_details").html();
                $("#abring .player_view_details").html("");
                var parent_id = abring.params.player.pages.other_player_profile.parent_id;
                $("."+parent_id).html(theme);
                return abring.params.player.pages.other_player_profile.theme;
            },
            "show":function(other_player_id){
                fillOtherPlayerInfo(other_player_id,
                    function(){
                        var parent_id = abring.params.player.pages.other_player_profile.parent_id;
                        abring.params.display.showPageFunction(parent_id);
                    },
                    function(x,c,e){
                        alert("Failed to fetch player data\n"+e);
                    }
                );
            }
        },
        "player_mobile_register":{
            "parent_id":"player_mobile_register",
            "theme":"",
            "getTheme":function(){
                var theme = abring.params.player.pages.player_mobile_register.theme;
                if(!theme)
                    theme = abring.params.player.pages.player_mobile_register.theme =
                        $("#abring .player_mobile_register").html();
                $("#abring .player_mobile_register").html("");
                var parent_id = abring.params.player.pages.player_mobile_register.parent_id;
                $("."+parent_id).html(theme);
                return abring.params.player.pages.player_mobile_register.theme;
            },
            "show":function(){
                var parent_id = abring.params.player.pages.player_mobile_register.parent_id;
                abring.params.player.showPageFunction(parent_id);
            }
        },
        "player_mobile_verify":{

            "parent_id":"player_mobile_verify",
            "theme":"",
            "getTheme":function(){
                var theme = abring.params.player.pages.player_mobile_verify.theme;
                if(!theme)
                    theme = abring.params.player.pages.player_mobile_verify.theme =
                        $("#abring .player_mobile_verify").html();
                $("#abring .player_mobile_verify").html("");
                var parent_id = abring.params.player.pages.player_mobile_verify.parent_id;
                $("."+parent_id).html(theme);
                return abring.params.player.pages.player_mobile_verify.theme;
            },
            "show":function(){
                var parent_id = abring.params.player.pages.player_mobile_verify.parent_id;
                abring.params.player.showPageFunction(parent_id);
            }
        },
        "player_mobile_other_way":{},
        "player_register":{},
        "player_login":{},
        "my_profile_update":{

            "parent_id":"my_profile_update",
            "theme":"",
            "getTheme":function(){
                var theme = abring.params.player.pages.my_profile_update.theme;
                if(!theme)
                    theme = abring.params.player.pages.my_profile_update.theme =
                        $("#abring .my_profile_update").html();
                $("#abring .my_profile_update").html("");
                var parent_id = abring.params.player.pages.my_profile_update.parent_id;
                $("."+parent_id).html(theme);
                return abring.params.player.pages.my_profile_update.theme;
            },
            "show":function(){
                fillMyPlayerInfo(true);
                var parent_id = abring.params.player.pages.my_profile_update.parent_id;
                abring.params.display.showPageFunction(parent_id);
            }
        },
        "abring_chat":{}
    },
    "parent_id" : "abring_player",
    "template" : readFile(abring_url+"/modules/player/view/player.html"),
    "showPageFunction":function (subPageID) { return showMyProfile(subPageID); },
    "onLoginFunction":function (data) { return onPlayerLogin(data)},
    "onLogoutFunction":function () { return onPlayerLogout()},
    "onDataLoaded":function (data) { return onDataLoaded(data)}
};
