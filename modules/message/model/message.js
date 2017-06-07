
var initMessage = function () {
    var html = readFile(abring_url+"/modules/message/view/message.html");
    $("body #abring").append(html);
};

var showMessageList = function () {
    abring.params.display.loading.show("loading your messages");
    getMessageList(
        function (messageList) {
            fillMessageList(messageList);
            var parent_id = abring.params.message.pages.list.parent_id;
            abring.params.display.showPageFunction(parent_id);
        },function (x,c,e) {
            abring.params.display.error.show(e);
        }
    );
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
};

var showMessage = function (message_id) {
    abring.params.display.loading.show("loading message");
    getMessage(
        message_id,
        function (message) {
            fillMessage(message);
            var parent_id = abring.params.message.pages.view.parent_id;
            abring.params.display.showPageFunction(parent_id);
        },function (x,c,e) {
            abring.params.display.error.show(e);
        }
    );
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
    //fill message
    log("message");
    log(message);

    var parent_id = abring.params.message.pages.view.parent_id;

    $("."+parent_id+" .by_avatar").attr("src",message["by_player_info"]["avatar"]);
    $("."+parent_id+" .by_name").html(message["by_player_info"]["name"]);
    $("."+parent_id+" .by_player_id").attr("player_id",message["by_player_info"]["player_id"]);
    $("."+parent_id+" .title").html(message["title"]);
    $("."+parent_id+" .message").html(message["message"]);
    $("."+parent_id+" .date").html(message["date"]);
};

var showMessageUnicast = function (player_id) {
    var parent_id = abring.params.message.pages.unicast.parent_id;
    $("."+parent_id+" .abring_message_form *").attr("player_id",player_id);
    $("."+parent_id+" .abring_message_form #abring_message_player_id").val(player_id);
    abring.params.display.showPageFunction(parent_id);
};
var sendMessageUnicast = function (player_id,title,message) {
    callAbringWithFileUpload(
        "message/unicast",
        {"player_id":player_id,"title":title,"message":message},
        function () {
            abring.params.display.info.show("message is sent");
        },function (x,c,e) {
            abring.params.display.error.show(e);
        }
    );
};
