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
    "init_completed" : false,
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

    "abring_sms_number" : "10005769297561",
    "uuid" : "", //device's Universally Unique Identifier,

    "ping_time" : 30,
    "cookie_max_size":4000
};

abring.display = {
    "current_page" : "",
    "showPageFunction":function (pageID,title,message) {
        abringPageHide();
        abring.display.current_page = pageID;
        return abringPageShow(pageID,title,message);
    },
    "hidePageFunction":function () {
        abring.display.current_page = "";
        return abringPageHide();
    },
    "home":{
        "parent_id":"home",
        "show":function(title,message) {
            abring.display.current_page = abring.display.home.parent_id;
            return abringPageHide();
        }
    },
    "loading":{
        "parent_id":"loading",
        "url" : abring_url+"/img/loading.gif",
        "show":function(title,message){
            var pageID = abring.display.loading.parent_id;
            abringPageHide();
            abring.display.current_page = pageID;
            return abringPageShow(pageID,title,message);}
    },
    "error":{
        "parent_id":"error",
        "url" : abring_url+"/img/error.gif",
        "show":function(title,message){
            var pageID = abring.display.error.parent_id;
            abringPageHide();
            abring.display.current_page = pageID;
            return abringPageShow(pageID,title,message);}
    },
    "info":{
        "parent_id":"info",
        "url" : abring_url+"/img/info.gif",
        "show":function(title,message){
            var pageID = abring.display.info.parent_id;
            abringPageHide();
            abring.display.current_page = pageID;
            return abringPageShow(pageID,title,message);}
    },
    "warning":{
        "parent_id":"warning",
        "url" : abring_url+"/img/warning.gif",
        "show":function(title,message){
            var pageID = abring.display.warning.parent_id;
            abringPageHide();
            abring.display.current_page = pageID;
            return abringPageShow(pageID,title,message);}
    },
    "confirm":{
        "parent_id":"confirm",
        "url" : abring_url+"/img/warning.gif",
        "show":function(title,message){
            var pageID = abring.display.confirm.parent_id;
            abringPageHide();
            abring.display.current_page = pageID;
            return abringPageShow(pageID,title,message);}
    },
    "tooltip":{
        "parent_id":"tooltip",
        "url" : abring_url+"/img/info.gif",
        "time" : 5,
        "show":function(title,message,type,wait) {
            var pageID = abring.display.tooltip.parent_id;

            title = title || "";
            message = message || "";
            type = type || "info";
            wait = wait || abring.display.tooltip.time;

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

abring.message = {
    "pages":{
        "list":{
            "parent_id":"message_list",
            "theme_parent_id":"message_list",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.message.pages.list.parent_id = parent_id;
                if(theme_parent_id)
                    abring.message.pages.list.theme_parent_id = theme_parent_id;
                abring.message.pages.list.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.message.pages.list.theme;
                if(!theme || override)
                {
                    theme = abring.message.pages.list.theme =
                        $("."+abring.message.pages.list.theme_parent_id).html();
                    $("."+abring.message.pages.list.theme_parent_id).html("");
                }
                var parent_id = abring.message.pages.list.parent_id;
                $("."+parent_id).html(theme);
                return abring.message.pages.list.theme;
            },
            "show":function () {

                var parent_id = abring.message.pages.list.parent_id;
                abring.display.showPageFunction(parent_id);

            }
        },
        "view":{
            "parent_id":"message_view",
            "theme_parent_id":"message_view",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.message.pages.view.parent_id = parent_id;
                if(theme_parent_id)
                    abring.message.pages.view.theme_parent_id = theme_parent_id;
                abring.message.pages.view.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.message.pages.view.theme;
                if(!theme || override)
                {
                    theme = abring.message.pages.view.theme =
                        $("."+abring.message.pages.view.theme_parent_id).html();
                    $("."+abring.message.pages.view.theme_parent_id).html("");
                }
                var parent_id = abring.message.pages.view.parent_id;
                $("."+parent_id).html(theme);
                return abring.message.pages.view.theme;
            },
            "show":function (messageId) {
                showMessage(messageId);
            }
        },
        "unicast":{
            "parent_id":"message_unicast",
            "theme_parent_id":"message_unicast",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.message.pages.unicast.parent_id = parent_id;
                if(theme_parent_id)
                    abring.message.pages.unicast.theme_parent_id = theme_parent_id;
                abring.message.pages.unicast.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.message.pages.unicast.theme;
                if(!theme || override)
                {
                    theme = abring.message.pages.unicast.theme =
                        $("."+abring.message.pages.unicast.theme_parent_id).html();
                    $("."+abring.message.pages.unicast.theme_parent_id).html("");
                }
                var parent_id = abring.message.pages.unicast.parent_id;
                $("."+parent_id).html(theme);
                return abring.message.pages.unicast.theme;
            },
            "show":function (player_info) {
                var parent_id = abring.message.pages.unicast.parent_id;
                abring.display.showPageFunction(parent_id);
            }
        }
    }
};

abring.player = {
    "pages":{
        "my_profile":{
            "parent_id":"my_profile",
            "theme_parent_id":"my_profile",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.player.pages.my_profile.parent_id = parent_id;
                if(theme_parent_id)
                    abring.player.pages.my_profile.theme_parent_id = theme_parent_id;
                abring.player.pages.my_profile.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.player.pages.my_profile.theme;
                if(!theme || override)
                {
                    theme = abring.player.pages.my_profile.theme =
                        $("."+abring.player.pages.my_profile.theme_parent_id).html();
                    $("."+abring.player.pages.my_profile.theme_parent_id).html("");
                }
                var parent_id = abring.player.pages.my_profile.parent_id;
                $("."+parent_id).html(theme);
                return abring.player.pages.my_profile.theme;
            },
            "show":function(){
                var parent_id = abring.player.pages.my_profile.parent_id;
                abring.display.showPageFunction(parent_id);
            }
        },
        "other_player_profile":{
            "parent_id":"other_player_profile",
            "theme_parent_id":"other_player_profile",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.player.pages.other_player_profile.parent_id = parent_id;
                if(theme_parent_id)
                    abring.player.pages.other_player_profile.theme_parent_id = theme_parent_id;
                abring.player.pages.other_player_profile.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.player.pages.other_player_profile.theme;
                if(!theme || override)
                {
                    theme = abring.player.pages.other_player_profile.theme =
                        $("."+abring.player.pages.other_player_profile.theme_parent_id).html();
                    $("."+abring.player.pages.other_player_profile.theme_parent_id).html("");
                }
                var parent_id = abring.player.pages.other_player_profile.parent_id;
                $("."+parent_id).html(theme);
                return abring.player.pages.other_player_profile.theme;
            },
            "show":function(other_player_id){
                abring.player.pages.other_player_profile.getTheme();
                fillOtherPlayerInfo(other_player_id,
                    function(){
                        var parent_id = abring.player.pages.other_player_profile.parent_id;
                        abring.display.showPageFunction(parent_id);
                    },
                    function(x,c,e){
                        alert("Failed to fetch player data\n"+e);
                    }
                );
            }
        },
        "player_mobile_register":{
            "parent_id":"player_mobile_register",
            "theme_parent_id":"player_mobile_register",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.player.pages.player_mobile_register.parent_id = parent_id;
                if(theme_parent_id)
                    abring.player.pages.player_mobile_register.theme_parent_id = theme_parent_id;
                abring.player.pages.player_mobile_register.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.player.pages.player_mobile_register.theme;
                if(!theme || override)
                {
                    theme = abring.player.pages.player_mobile_register.theme =
                        $("."+abring.player.pages.player_mobile_register.theme_parent_id).html();
                    $("."+abring.player.pages.player_mobile_register.theme_parent_id).html("");
                }
                var parent_id = abring.player.pages.player_mobile_register.parent_id;
                $("."+parent_id).html(theme);
                return abring.player.pages.player_mobile_register.theme;
            },
            "show":function(){
                var parent_id = abring.player.pages.player_mobile_register.parent_id;
                abring.display.showPageFunction(parent_id);
            }
        },
        "player_mobile_verify":{
            "parent_id":"player_mobile_verify",
            "theme_parent_id":"player_mobile_verify",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.player.pages.player_mobile_verify.parent_id = parent_id;
                if(theme_parent_id)
                    abring.player.pages.player_mobile_verify.theme_parent_id = theme_parent_id;
                abring.player.pages.player_mobile_verify.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.player.pages.player_mobile_verify.theme;
                if(!theme || override)
                {
                    theme = abring.player.pages.player_mobile_verify.theme =
                        $("."+abring.player.pages.player_mobile_verify.theme_parent_id).html();
                    $("."+abring.player.pages.player_mobile_verify.theme_parent_id).html("");
                }
                var parent_id = abring.player.pages.player_mobile_verify.parent_id;
                $("."+parent_id).html(theme);
                return abring.player.pages.player_mobile_verify.theme;
            },
            "show":function(){
                var parent_id = abring.player.pages.player_mobile_verify.parent_id;
                abring.player.showPageFunction(parent_id);
            }
        },
        "player_mobile_other_way":{
            "parent_id":"player_mobile_other_way",
            "theme_parent_id":"player_mobile_other_way",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.player.pages.player_mobile_other_way.parent_id = parent_id;
                if(theme_parent_id)
                    abring.player.pages.player_mobile_other_way.theme_parent_id = theme_parent_id;
                abring.player.pages.player_mobile_other_way.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.player.pages.player_mobile_other_way.theme;
                if(!theme || override)
                {
                    theme = abring.player.pages.player_mobile_other_way.theme =
                        $("."+abring.player.pages.player_mobile_other_way.theme_parent_id).html();
                    $("."+abring.player.pages.player_mobile_other_way.theme_parent_id).html("");
                }
                var parent_id = abring.player.pages.player_mobile_other_way.parent_id;
                $("."+parent_id).html(theme);
                return abring.player.pages.player_mobile_other_way.theme;
            },
            "show":function(){
                abring.player.pages.player_mobile_other_way.getTheme();
                var parent_id = abring.player.pages.player_mobile_other_way.parent_id;
                abring.player.showPageFunction(parent_id);
            }
        },
        "player_register":{
            "parent_id":"player_register",
            "theme_parent_id":"player_register",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.player.pages.player_register.parent_id = parent_id;
                if(theme_parent_id)
                    abring.player.pages.player_register.theme_parent_id = theme_parent_id;
                abring.player.pages.player_register.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.player.pages.player_register.theme;
                if(!theme || override)
                {
                    theme = abring.player.pages.player_register.theme =
                        $("."+abring.player.pages.player_register.theme_parent_id).html();
                    $("."+abring.player.pages.player_register.theme_parent_id).html("");
                }
                var parent_id = abring.player.pages.player_register.parent_id;
                $("."+parent_id).html(theme);
                return abring.player.pages.player_register.theme;
            },
            "show":function(){
                abring.player.pages.player_register.getTheme();
                fillMyPlayerInfo(true);
                var parent_id = abring.player.pages.player_register.parent_id;
                abring.display.showPageFunction(parent_id);
            }
        },
        "player_login":{
            "parent_id":"player_login",
            "theme_parent_id":"player_login",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.player.pages.player_login.parent_id = parent_id;
                if(theme_parent_id)
                    abring.player.pages.player_login.theme_parent_id = theme_parent_id;
                abring.player.pages.player_login.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.player.pages.player_login.theme;
                if(!theme || override)
                {
                    theme = abring.player.pages.player_login.theme =
                        $("."+abring.player.pages.player_login.theme_parent_id).html();
                    $("."+abring.player.pages.player_login.theme_parent_id).html("");
                }
                var parent_id = abring.player.pages.player_login.parent_id;
                $("."+parent_id).html(theme);
                return abring.player.pages.player_login.theme;
            },
            "show":function(){
                abring.player.pages.player_login.getTheme();
                fillMyPlayerInfo(true);
                var parent_id = abring.player.pages.player_login.parent_id;
                abring.display.showPageFunction(parent_id);
            }
        },
        "my_profile_update":{
            "parent_id":"my_profile_update",
            "theme_parent_id":"my_profile_update",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.player.pages.my_profile_update.parent_id = parent_id;
                if(theme_parent_id)
                    abring.player.pages.my_profile_update.theme_parent_id = theme_parent_id;
                abring.player.pages.my_profile_update.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.player.pages.my_profile_update.theme;
                if(!theme || override)
                {
                    theme = abring.player.pages.my_profile_update.theme =
                        $("."+abring.player.pages.my_profile_update.theme_parent_id).html();
                    $("."+abring.player.pages.my_profile_update.theme_parent_id).html("");
                }
                var parent_id = abring.player.pages.my_profile_update.parent_id;
                $("."+parent_id).html(theme);
                return abring.player.pages.my_profile_update.theme;
            },
            "show":function(){
                abring.player.pages.my_profile_update.getTheme();
                fillMyPlayerInfo(true);
                var parent_id = abring.player.pages.my_profile_update.parent_id;
                abring.display.showPageFunction(parent_id);
            }
        },
    }
    ,
    // "parent_id" : "abring_player",
    // "template" : readFile(abring_url+"/modules/player/view/player.html"),
    // "showPageFunction":function (subPageID) { return showMyProfile(subPageID); },
    "onLoginFunction":function (data) { return function (data) {}},
    "onLogoutFunction":function () { return function () {}},
    "onDataLoaded":function (data) { return function (data) {}}
};

abring.market.products = {
    "pages":{
        "productList":{
            "parent_id":"products_list",
            "theme_parent_id":"products_list",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.market.products.pages.productList.parent_id = parent_id;
                if(theme_parent_id)
                    abring.market.products.pages.productList.theme_parent_id = theme_parent_id;
                abring.market.products.pages.productList.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.market.products.pages.productList.theme;
                if(!theme || override)
                {
                    theme = abring.market.products.pages.productList.theme =
                        $("."+abring.market.products.pages.productList.theme_parent_id).html();
                    $("."+abring.market.products.pages.productList.theme_parent_id).html("");
                }
                var parent_id = abring.market.products.pages.productList.parent_id;
                $("."+parent_id).html(theme);
                return abring.market.products.pages.productList.theme;
            },
            "show":function (productsList) {
                showProductsList(productsList);
            }
        },
        "productView":{
            "parent_id":"product_view",
            "theme_parent_id":"product_view",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.market.products.pages.productView.parent_id = parent_id;
                if(theme_parent_id)
                    abring.market.products.pages.productView.theme_parent_id = theme_parent_id;
                abring.market.products.pages.productView.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.market.products.pages.productView.theme;
                if(!theme || override)
                {
                    theme = abring.market.products.pages.productView.theme =
                        $("."+abring.market.products.pages.productView.theme_parent_id).html();
                    $("."+abring.market.products.pages.productView.theme_parent_id).html("");
                }
                var parent_id = abring.market.products.pages.productView.parent_id;
                $("."+parent_id).html(theme);
                return abring.market.products.pages.productView.theme;
            },
            "show":function (product) {
                showProductsView(product);
            }
        }
    }
};

abring.market.basket = {
    "pages":{
        "basketView":{
            "parent_id":"basket_view",
            "theme_parent_id":"basket_view",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.market.basket.pages.basketView.parent_id = parent_id;
                if(theme_parent_id)
                    abring.market.basket.pages.basketView.theme_parent_id = theme_parent_id;
                abring.market.basket.pages.basketView.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.market.basket.pages.basketView.theme;
                if(!theme || override)
                {
                    theme = abring.market.basket.pages.basketView.theme =
                        $("."+abring.market.basket.pages.basketView.theme_parent_id).html();
                    $("."+abring.market.basket.pages.basketView.theme_parent_id).html("");
                }
                var parent_id = abring.market.basket.pages.basketView.parent_id;
                $("."+parent_id).html(theme);
                return abring.market.basket.pages.basketView.theme;
            },
            "show":function () {
                var parent_id = abring.market.basket.pages.basketView.parent_id;
                abring.display.showPageFunction(parent_id);
            }
        },
        "basketList":{
            "parent_id":"basket_list",
            "theme_parent_id":"basket_list",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.market.basket.pages.basketList.parent_id = parent_id;
                if(theme_parent_id)
                    abring.market.basket.pages.basketList.theme_parent_id = theme_parent_id;
                abring.market.basket.pages.basketList.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.market.basket.pages.basketList.theme;
                if(!theme || override)
                {
                    theme = abring.market.basket.pages.basketList.theme =
                        $("."+abring.market.basket.pages.basketList.theme_parent_id).html();
                    $("."+abring.market.basket.pages.basketList.theme_parent_id).html("");
                }
                var parent_id = abring.market.basket.pages.basketList.parent_id;
                $("."+parent_id).html(theme);
                return abring.market.basket.pages.basketList.theme;
            },
            "show":function () {
                var parent_id = abring.market.basket.pages.basketList.parent_id;
                abring.display.showPageFunction(parent_id);
            }
        }
    }
};

abring.posts = {
    "pages":{
    },
    "parent_id" : "abring_posts",
    "template" : readFile(abring_url+"/modules/post/view/post.html")
};

abring.chat = {
    pages:{
        list:{
            "parent_id":"chat_list",
            "theme_parent_id":"chat_list",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.chat.pages.list.parent_id = parent_id;
                if(theme_parent_id)
                    abring.chat.pages.list.theme_parent_id = theme_parent_id;
                abring.chat.pages.list.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.chat.pages.list.theme;
                if(!theme || override)
                {
                    theme = abring.chat.pages.list.theme =
                        $("."+abring.chat.pages.list.theme_parent_id).html();
                    $("."+abring.chat.pages.list.theme_parent_id).html("");
                }
                var parent_id = abring.chat.pages.list.parent_id;
                $("."+parent_id).html(theme);
                return abring.chat.pages.list.theme;
            },
            "show":function(){
                var parent_id = abring.chat.pages.list.parent_id;
                abring.display.showPageFunction(parent_id);
            }
        },
        room:{

            "parent_id":"chat_room",
            "theme_parent_id":"chat_room",
            "setParents":function(parent_id,theme_parent_id){
                if(parent_id)
                    abring.chat.pages.room.parent_id = parent_id;
                if(theme_parent_id)
                    abring.chat.pages.room.theme_parent_id = theme_parent_id;
                abring.chat.pages.room.getTheme(true);
            },
            "theme":"",
            "getTheme":function(override){
                var theme = abring.chat.pages.room.theme;
                var parent_id = abring.chat.pages.room.parent_id;
                if(!theme || override)
                {
                    theme = abring.chat.pages.room.theme =
                        $("."+abring.chat.pages.room.theme_parent_id).html();
                    $("."+abring.chat.pages.room.theme_parent_id).html("");
                    $("."+parent_id).html(theme);
                }
                return abring.chat.pages.room.theme;
            },
            "show":function(target_player_info,init_message){
                var parent_id = abring.chat.pages.room.parent_id;
                abring.display.showPageFunction(parent_id);
            },
            "target_player_say":function(target_player_info,message){
                var parent_id = abring.chat.pages.room.parent_id;
                var tag_selector = "."+parent_id+" #chat_"+target_player_info["player_id"];
                var template = $(tag_selector+" .you").first().outerHTML();
                $(tag_selector+" .chat_content").append(template);
                $(tag_selector+" .chat_content .you:last .avatar").attr("src",target_player_info["avatar"]);
                $(tag_selector+" .chat_content .you").last().find(".name").html(target_player_info["name"]);
                $(tag_selector+" .chat_content .you").last().find(".message").html(message);
                $(tag_selector+" .chat_content .you").last().find(".time").html('now');//???????????
                $(tag_selector+" .chat_content .you").last().show("slow");
            },
            "i_say":function(target_player_id,message){
                var parent_id = abring.chat.pages.room.parent_id;
                var tag_selector = "."+parent_id+" #chat_"+target_player_id;
                var template = $(tag_selector+" .me").first().outerHTML();
                $(tag_selector+" .chat_content").append(template);
                var dialog_tag = $(tag_selector+" .chat_content .me:last");
                dialog_tag.find(".message").html(message);
                dialog_tag.find(".time").html('now');//???????????
                dialog_tag.show("slow");
            }
        }
    }
};
