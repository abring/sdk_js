abring.params = {
//configs
    "app" : "ir.abring.sdk",
    "abring_base_url" : "http://ws.v3.abring.ir/index.php?r=",

//module parent ids
    "player":{
        "parent_id" : "abring_player",
        "template" : readFile("abring/modules/player/view/player.html"),
        "showPageFunction":function (subPageID) { return showMyProfile(subPageID); },
        "onLoginFunction":function (data) { return onPlayerLogin(data)},
        "onLogoutFunction":function () { return onPlayerLogout()},
        "onDataLoaded":function (data) { return onDataLoaded(data)}
    },

    "leaderboard":{
        "parent_id" : "abring_leaderboard"
    },

    "friends":{
        "parent_id" : "abring_friends"
    },

    "posts_parent_id" : "frog_posts", //use custom parent to show posts,

//default icons
    "abring_loading_url" : "abring/img/loading.gif",
    "abring_error_url" : "abring/img/error.png",
    "abring_info_url" : "abring/img/info.png",
    "abring_warning_url" : "abring/img/warning.png",
    "abring_logo_url" : "abring/img/abring.png",
    "abring_default_avatar_url" : "abring/img/default_avatar.png",

    "splashTime" : 0,
    "tooltip_default_time" : 5,
    "sounds":{
        "beep" : "abring/sound/beep.wav",
        "notification" : "abring/sound/notification.mp3"
    },


//global variables
    "timeStamp" : 0,
    "template" : "",
    "app_data" : "",
    "last_error" : "",
    "token" : "",
    "isCordovaApp" : false,
    "current_page" : "",
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

    "ping_time" : 30
};