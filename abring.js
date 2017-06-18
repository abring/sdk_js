

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
//JQUERY must be included before
document.writeln("<script type='text/javascript' src='cordova.js'></script>");
// document.writeln("<script type='text/javascript' src='js/jquery-1.11.3.min.js'></script>");
// document.writeln("<script type='text/javascript' src='js/jquery.mobile-1.4.5.min.js'></script>");
}

var abring_url = "abring";

var abringClass = function () {
    this.init = {};
    this.params = {};
    this.player = {};
    this.market = {
        products: {},
        basket: {},
        payment: {},
        orders: {}
    };
    this.posts = {};
    this.friends = {};
    this.leaderboard = {};
    this.message = {};
    this.chat = {};

};
abring = new abringClass();

//external library

document.writeln("<script type='text/javascript' src='"+abring_url+"/lib/md5.min.js'></script>");

document.writeln("<script type='text/javascript' src='"+abring_url+"/models/helpers.js'></script>");
document.writeln("<script type='text/javascript' src='"+abring_url+"/configs/params.js'></script>");
document.writeln("<script type='text/javascript' src='"+abring_url+"/models/translation.js'></script>");
document.writeln("<script type='text/javascript' src='"+abring_url+"/controller/page.js'></script>");
document.writeln("<script type='text/javascript' src='"+abring_url+"/models/socket.js'></script>");
document.writeln("<script type='text/javascript' src='"+abring_url+"/models/file.js'></script>");
document.writeln("<script type='text/javascript' src='"+abring_url+"/models/init_abring.js'></script>");
document.writeln("<script type='text/javascript' src='"+abring_url+"/models/display.js'></script>");

document.writeln("<script type='text/javascript' src='"+abring_url+"/modules/player/module.js'></script>");
document.writeln("<script type='text/javascript' src='"+abring_url+"/modules/message/module.js'></script>");
document.writeln("<script type='text/javascript' src='"+abring_url+"/modules/leaderboard/module.js'></script>");
document.writeln("<script type='text/javascript' src='"+abring_url+"/modules/friends/module.js'></script>");
document.writeln("<script type='text/javascript' src='"+abring_url+"/modules/post/module.js'></script>");
document.writeln("<script type='text/javascript' src='"+abring_url+"/modules/market/module.js'></script>");

