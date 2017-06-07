
$(document).on("click",".abring_buttons_message_list",function () {

    if(!abring.params.token)
    {
        abring.params.display.error.show("Your are not login.");
        return false;
    }

    abring.params.message.pages.list.show();

});
$(document).on("click",".abring_buttons_message_view",function () {

    if(!abring.params.token)
    {
        abring.params.display.error.show("Your are not login.");
        return false;
    }

    var message_id = $(this).attr("message_id");
    abring.params.message.pages.view.show(message_id);

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
    abring.params.message.pages.unicast.show(player_id);

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