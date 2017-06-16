
$(document).on("click",".abring_buttons_message_list",function () {

    if(!abring.params.token)
    {
        abring.params.display.error.show("Your are not login.");
        return false;
    }

    abring.params.display.loading.show("loading your messages");
    abring.params.message.pages.list.getTheme();
    getMessageList(
        function (messageList) {
            fillMessageList(messageList);
            abring.params.display.hidePageFunction();
            abring.params.message.pages.list.show();
        },function (x,c,e) {
            abring.params.display.error.show(e);
        }
    );


});
$(document).on("click",".abring_buttons_message_view",function () {

    if(!abring.params.token)
    {
        abring.params.display.error.show("Your are not login.");
        return false;
    }

    abring.params.display.loading.show("loading message");

    var message_id = $(this).attr("message_id");
    getMessage(
        message_id,
        function (message) {
            fillMessage(message);
            abring.params.display.hidePageFunction();
            abring.params.message.pages.view.show(message_id);
        },function (x,c,e) {
            abring.params.display.error.show(e);
        }
    );


});
$(document).on("click",".abring_buttons_message_unicast",function () {

    if(!abring.params.token)
    {
        abring.params.display.error.show("Your are not login.");
        return false;
    }
    var player_id = $(this).attr("player_id");
    if(!player_id)
        return abring.params.display.error.show("player id not set");

    var parent_id = abring.params.message.pages.unicast.parent_id;

    getOtherPlayerInfo(player_id,false,
        function(player_info){

            $("."+parent_id+" .abring_message_form *").attr("player_id",player_id);
            $("."+parent_id+" .abring_message_form #abring_message_player_id").val(player_id);
            $("."+parent_id+" .avatar").attr("src",player_info["avatar"]);
            $("."+parent_id+" .name").html(player_info["name"]);
            $.each(player_info["public"],function(index,item){
                if(typeof item == "string")
                    $("."+parent_id+" ."+index).html(item);
            });
            abring.params.message.pages.unicast.show(player_info);
        },
        function(x,c,e){
            return abring.params.display.error.show(e);
        }
    );

});
$(document).on("click",".abring_buttons_message_unicast_submit",function () {

    if(!abring.params.token)
    {
        abring.params.display.error.show("Your are not login.");
        return false;
    }

    var title = $("#abring_message_title").val();
    var message = $("#abring_message_message").val();
    var player_id = $(this).attr("player_id");
    if(!title)
        return alert("title not set");
    if(!message)
        return alert("message not set");
    if(!player_id)
        return alert("player id not set");
    sendMessageUnicast(player_id,title,message);

});