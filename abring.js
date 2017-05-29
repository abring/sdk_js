

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
//JQUERY must be included before
document.writeln("<script type='text/javascript' src='cordova.js'></script>");
// document.writeln("<script type='text/javascript' src='js/jquery-1.11.3.min.js'></script>");
// document.writeln("<script type='text/javascript' src='js/jquery.mobile-1.4.5.min.js'></script>");
}

var abringClass = function () {
    this.params = {};
    this.init = {};
};
abring = new abringClass();

//external library

document.writeln("<script type='text/javascript' src='abring/lib/md5.min.js'></script>");

document.writeln("<script type='text/javascript' src='abring/models/helpers.js'></script>");
document.writeln("<script type='text/javascript' src='abring/configs/params.js'></script>");
document.writeln("<script type='text/javascript' src='abring/controller/page.js'></script>");
document.writeln("<script type='text/javascript' src='abring/models/socket.js'></script>");
document.writeln("<script type='text/javascript' src='abring/models/file.js'></script>");
document.writeln("<script type='text/javascript' src='abring/models/init_abring.js'></script>");
document.writeln("<script type='text/javascript' src='abring/models/display.js'></script>");

document.writeln("<script type='text/javascript' src='abring/modules/player/module.js'></script>");
document.writeln("<script type='text/javascript' src='abring/modules/leaderboard/module.js'></script>");
document.writeln("<script type='text/javascript' src='abring/modules/friends/module.js'></script>");
document.writeln("<script type='text/javascript' src='abring/modules/post/module.js'></script>");



