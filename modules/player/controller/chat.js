
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
