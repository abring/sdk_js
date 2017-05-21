
var socketIsAvailable = function()
{
    return ("WebSocket" in window)?true:false;
};
var socketIsConnected = function()
{
    if(!socketIsAvailable())
        return false;
    return (abring.params.socketObject)?true:false;
};

var socketConnect = function()
{
    if(!socketIsAvailable())
        return false;
    if(!socketIsConnected())
    {
        abring.params.socketObject = new WebSocket("ws://" + abring.params.socketDomain+":"+abring.params.socketPort);
        abring.params.socketObject.onopen = function () {
            $(".socket_status").html("online");
            socketSendMessage(abring.params.player_info["player_id"]);
        };

        abring.params.socketObject.onmessage = function (evt) {
            var received_msg = evt.data;
            if(received_msg=="0:0") socketSendMessage(abring.params.player_info["player_id"]);
            if(received_msg=="0:1") socketSendMessage("No group");
            socketMessageReceived(received_msg);
        };

        abring.params.socketObject.onclose = function () {
            $(".socket_status").html("offline");
            socketClose();
            // websocket is closed.
            log("Connection is closed...");
            //try to reconnect ??????????????????????
        };
    }
    return abring.params.socketObject;
};

var socketSendMessage = function(message)
{
    if(!socketIsConnected())
        socketConnect();

    if(!socketIsConnected())
        return abringPageShow("error","socket not connected!");

    abring.params.socketObject.send(message);
    log("socket send: "+message);
};
var socketClose = function()
{
    if(!socketIsConnected())
        abring.params.socketObject.close();
    abring.params.socketObject = null;
};