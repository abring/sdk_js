
var initChat = function () {
    var view = readFile(abring_url+"/modules/player/view/chat.html");
    $("#abring").append(view);

};

var chat_show_page = function (target_player_id,init_message) {

    abring.params.chat.pages.room.getTheme();
    var parent_id = abring.params.chat.pages.room.parent_id;

    if($("."+abring.params.chat.pages.room.parent_id+" .chat_"+target_player_id).length==0)
    {
        var template = $("."+abring.params.chat.pages.room.parent_id+" .template").outerHTML();
        template = template.replace('id="template"','class="chat_'+target_player_id+'"');
        $("."+abring.params.chat.pages.room.parent_id+" .tab_wrapper").append(template);
        $("."+abring.params.chat.pages.room.parent_id+" .tab_wrapper .template:last-child")
            .removeClass('template')
            .attr("player_id",target_player_id).addClass("chat_"+target_player_id);
    }

    getOtherPlayerInfo(target_player_id,false,
        function (target_player_info ) {
            if(!socketConnect())
                abring.params.display.error.show("error connecting to socket server");

            $("."+parent_id+" .chat_"+target_player_id+" .target_player_avatar").attr("src",target_player_info["avatar"]);
            $("."+parent_id+" .chat_"+target_player_id+" .target_player_name").html(target_player_info["name"]);
            $("."+parent_id+" .chat_"+target_player_id+" .chat_send").attr("player_id",target_player_info["player_id"]);

            abring.params.chat.pages.room.show();

            if(init_message)
                abring.params.chat.pages.room.target_player_say(target_player_info,init_message);
        },function (x,c,e) {
            abring.params.display.error.show(e);
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

            log("process chat");
            getOtherPlayerInfo(from_player_id,false,
                function (from_player_info) {
                    abring.params.chat.pages.room.show(from_player_info,message[1]);
                },function (x,c,e) {
                    abring.params.display.error.show(e);
                }
            );
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