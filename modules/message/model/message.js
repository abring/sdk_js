
var initMessage = function () {
    var html = readFile(abring_url+"/modules/message/view/message.html");
    $("body #abring").append(html);

    $.each(abring.message.pages,function (page_id,page) {
        page.getTheme(true);
    });

    // abring.message.pages.unicast.getTheme(true);
    // abring.message.pages.list.getTheme(true);
    // abring.message.pages.view.getTheme(true);
};

var getMessageList = function (getMessageListSuccess,getMessageListFailed) {
    callAbringWithFileUpload(
        "message/list",
        {},
        function (messageList) {
            getMessageListSuccess(messageList);
        },function (x,c,e) {
            getMessageListFailed(x,c,e);
        }
    );
};
var fillMessageList = function (messageList) {
    //fill list
    log("message list");
    log(messageList);

    var parent_id = abring.message.pages.list.parent_id;
    var message_types = [
        "broadcast",
        "multicast",
        "unicast",
        "sent"
    ];
    var type_template = "";
    var messages = {};
    var message = {};
    var type_object = null;
    var list_object = null;
    $.each(message_types,function (index,type) {
        type_object = $("."+parent_id+" ul#abring_message_list_"+type);
        if(!messageList[type]||messageList[type].length==0)
        {
            type_object.hide();
        }else{
            messages = messageList[type];
            type_object.append('<h3>'+type+'</h3>');
            list_object = $("."+parent_id+" ul#abring_message_list_"+type+" li:first-child");
            type_template = list_object.outerHTML();
            list_object.hide();
            $.each(messages,function (message_id,message) {
                type_object.append(type_template);
                list_object.parent().find("li:last-child").attr("message_id",message_id);
                list_object.parent().find("li:last-child .by_player_id").attr("player_id",message["by_player_info"]["player_id"]);
                list_object.parent().find("li:last-child .by_avatar").attr("src",message["by_player_info"]["avatar"]);
                list_object.parent().find("li:last-child .by_name").html(message["by_player_info"]["name"]);
                list_object.parent().find("li:last-child .title").html(message["title"]);
                list_object.parent().find("li:last-child .date").html(message["date"]);
                if(message["status"]!="read")
                    list_object.parent().find("li:last-child").addClass("unread");
            });
        }
    });

};

var showMessage = function () {
    var parent_id = abring.message.pages.view.parent_id;
    abring.display.showPageFunction(parent_id);
};
var getMessage = function (message_id,getMessageSuccess,getMessageFailed) {
    callAbringWithFileUpload(
        "message/view",
        {"message_id":message_id},
        function (message) {
            getMessageSuccess(message);
        },function (x,c,e) {
            getMessageFailed(x,c,e);
        }
    );
};
var fillMessage = function (message) {

    var parent_id = abring.message.pages.view.parent_id;

    $("."+parent_id+" .by_avatar").attr("src",message["by_player_info"]["avatar"]);
    $("."+parent_id+" .by_name").html(message["by_player_info"]["name"]);
    $("."+parent_id+" .by_player_id").attr("player_id",message["by_player_info"]["player_id"]);
    $("."+parent_id+" .title").html(message["title"]);
    $("."+parent_id+" .message").html(message["message"]);
    $("."+parent_id+" .date").html(message["date"]);
    if(message["by_player_info"]["player_id"]==abring.params.player_info["player_id"])
        $("."+parent_id+" .abring_buttons_message_unicast").hide();
    else
        $("."+parent_id+" .abring_buttons_message_unicast").show();
};

var showMessageUnicast = function (player_id) {
    var parent_id = abring.message.pages.unicast.parent_id;
    $("."+parent_id+" .abring_message_form *").attr("player_id",player_id);
    $("."+parent_id+" .abring_message_form #abring_message_player_id").val(player_id);
    abring.display.showPageFunction(parent_id);
};
var sendMessageUnicast = function (player_id,title,message) {
    callAbringWithFileUpload(
        "message/unicast",
        {"player_id":player_id,"title":title,"message":message},
        function () {
            abring.display.info.show("message is sent");
            abring.message.pages.list.show();
        },function (x,c,e) {
            abring.display.error.show(e);
        }
    );
};

var updateNewMessageTip = function(amount)
{
    abring.params.new_message = amount;
    $(".abring_buttons_message_list .abring_message_new_theme_wrapper").remove();
    if(amount>0) {
        $(".abring_buttons_message_list").append($(".abring_message_new_theme").html());
        $(".abring_message_new_amount").html(amount);
    }
    setBadge(amount);
};