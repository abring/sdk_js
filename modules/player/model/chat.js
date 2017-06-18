
var initChat = function () {
    var view = readFile(abring_url+"/modules/player/view/chat.html");
    $("#abring").append(view);

    $.each(abring.chat.pages,function (page_id,page) {
        page.getTheme(true);
    });

};

var chat_show_page = function (from_player_id,init_message) {
    getOtherPlayerInfo(from_player_id,false,
        function (from_player_info) {
            abring.chat.pages.room.getTheme();
            var template = $("."+abring.chat.pages.room.parent_id+" li:first-child").outerHTML();
            var parent_id = abring.chat.pages.room.parent_id;
            var from_player_id = from_player_info["player_id"];

            if($("."+parent_id+" #chat_"+from_player_id).length==0)
            {
                $("."+parent_id+" ul").append(template);
                $("."+parent_id+" ul>li:last-child").attr("id","chat_"+from_player_id);

                $("#chat_"+from_player_id+" .target_player_avatar").attr("src",from_player_info["avatar"]);
                $("#chat_"+from_player_id+" .target_player_name").html(from_player_info["name"]);
                $("#chat_"+from_player_id+" .chat_send").attr("player_id",from_player_info["player_id"])
            }

            if(!socketConnect())
                return abring.display.error.show("error connecting to socket server");

            if(init_message)
            {
                abring.chat.pages.room.target_player_say(from_player_info,init_message);
                if(abring.display.current_page!=abring.chat.pages.room.parent_id)
                    play_sound(abring.params.sounds.notification);
            }

            abring.display.current_page = parent_id;
            abring.chat.pages.room.show(from_player_info,init_message);
        },function (x,c,e) {
            abring.display.error.show(e);
        }
    );
};

var chatSend = function (target_player_id,message) {
    socketSendMessage(">unicast>"+target_player_id+">chat:"+message);
    $(".chat_message").val('');
};

var abringOnPlayerSocketMessage = function(from_player_id,message){

    if( (typeof message == "array" || typeof message == "object") && message.length>1 ) //is command from socket server
    {
        if(message[0]=="chat"){ //is chat
            chat_show_page(from_player_id,message[1]);
        }else
        {
            log("unknown command from socket >>>>>>>");
            log(message);
            log("<<<<<<<< unknown command from socket");
        }
    }else{
        log("unknown message from socket >>>>>>>");
        log(message);
        log("<<<<<<<< unknown message from socket");
    }
};