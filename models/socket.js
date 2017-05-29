
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
            socketSendMessage(abring.params.player_info["player_id"]);
            abring.params.socketConnectFunction();
        };

        abring.params.socketObject.onmessage = function (evt) {
            var received_msg = evt.data;
            log("SOCKET:<"+received_msg+">");
            var received_msg_parts = received_msg.split(":");
            if(received_msg_parts.length>1)
            {
                var socket_target_player_id = received_msg_parts[0];
                var socket_message = received_msg_parts.slice(1);
                var socket_message_0 = socket_message[0].trim();
                if(socket_target_player_id==0){
                    if(socket_message_0=="0") log("ping from socket");
                    else if(socket_message_0=="1") socketSendMessage(abring.params.player_info["player_id"]);
                    else if(socket_message_0=="2") socketSendMessage(abring.params.app);//set app id as default group for this player
                    else if(socket_message_0=="3") log("ready for multicast");
                    else if(socket_message_0=="6") log("socket command executed");
                    else log("unknown message from admin: '"+socket_message+"'");
                }else if(socket_message_0=="4"){
                    log(socket_target_player_id + " joined to the socket server!");
                }else if(socket_message_0=="5"){
                    log(socket_target_player_id + " left the socket server!");
                }else{
                    abring.params.socketMessageFunction(socket_target_player_id,socket_message);
                }
            }else{
                log("unknown message '"+received_msg+"'");
            }
        };

        abring.params.socketObject.onclose = function (e) {
            socketClose();
            // websocket is closed.
            abring.params.socketCloseFunction();
            log("Connection is closed...");

            //try to reconnect in 5 seconds
            if(!abring.params.socketRetryIsRunning)
                abring.params.socketRetryIsRunning=true;
                setTimeout(function(){
                    if(playerIsLogin())
                        socketConnect();
                },
                abring.params.socketRetryInterval*1000
            );
        };
    }
    return abring.params.socketObject;
};

var socketSendMessage = function(message)
{
    if(!socketIsConnected())
        socketConnect();

    if(!socketIsConnected())
        return abring.params.display.showPageFunction("error","socket not connected!");

    abring.params.socketObject.send(message+"\n");
    log("socket send: "+message);
};
var socketClose = function()
{
    if(!socketIsConnected())
        abring.params.socketObject.close();
    abring.params.socketObject = null;
};
var on_socket_connect = function () {
    $(".my_socket_status").css("background-color","green");
};
var on_socket_close = function () {

    $(".my_socket_status").css("background-color","red");
};