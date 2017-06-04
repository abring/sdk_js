

/**
 * helpers
 *
 * remove previous abring if exists
 * reset global data
 * init Game hub
 * -add abring theme to body
 * -show splash page
 * -read token from cookie
 * -load app data
 * -load player info
 * -hide splash if load is less than one second or remain until loading completed
 */
var getPostTimeAgo = function (check_timestamp) {
    //get current_time_stamp
    var current_timestamp = Math.floor(Date.now() / 1000);

    //get diff between current and check timestamp
    var diff = parseInt(current_timestamp) - parseInt(check_timestamp);

    if(diff<600)
        return "چند لحظه قبل";

    if(diff<1800)
        return "دقایقی قبل";

    if(diff<3600)
        return "ساعتی قبل";

    if(diff<3600*24)
        return "چند ساعت قبل";

    if(diff<3600*24*2)
        return "دیروز";

    if(diff<3600*24*2)
        return "دو روز قبل";

    if(diff<3600*24*7)
        return "همین هفته";

    if(diff<3600*24*14)
        return "هفته قبل";
    else{
        var days = diff/3600/24;
        if(days<30)
            return "همن ماه";
        else
            return "بیش از یک ماه قبل";
    }
};
var getAppData = function (resetCache,getAppDataSuccess,getAppDataFailed) {
    getAppDataSuccess = getAppDataSuccess || function(){};
    getAppDataFailed = getAppDataFailed || function(){};
    abring.params.app_data = getCookie("app_data");
    if( resetCache || !abring.params.app_data )
    {
        callAbringWithFileUpload(
            "app/get",{},
            function(res){
                abring.params.app_data = res;
                setCookie("app_data",abring.params.app_data,100);
                getAppDataSuccess(abring.params.app_data);

            },function(x,code,error){
                getAppDataFailed(x,code,error);
            }
        );
    }else{
        getAppDataSuccess(abring.params.app_data);
    }
};
var readFile = function (filePath) {
    log("going to read "+filePath);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",filePath,false);

    try{
        xmlhttp.send(null);
    }catch (e){
        return false;
    }
    var status = xmlhttp.status;
    if(status==200||status==0)
    {
        var respond = xmlhttp.responseText;
        if(filePath.indexOf(".html")==-1)log(respond);
        return respond;
    }else{
        log(filePath+" not exists(2)!");
        return false;
    }
};
var callAbringSynchronously = function (method,data) {

    if(!abring.params.isOnline)
    {
        log("You are offline!\nPlease check your internet connection");
        return false;
    }

    data = data || {};
    data["app"] = abring.params.app;
    if(abring.params.token)
        data["token"] = abring.params.token;
    var data_string = "";
    $.each(data, function( index, value ) {
        data_string += "&" + index + "=" + value ;
    });
    var url = abring.params.ws_base_url+method+data_string;
    var result = readFile(url);
    result = JSON.parse(result);
    if(result&&result['code']==200){
        log('call abring was successful');
        return result['result'];
    }else{
        if(result['code']==401) //invalid login
        {
            //unset current token
            //unset current player info
            //show login page
        }
        abring.params.last_error = result['message'];
        //continue to error page ??????????????????????????
        return false;
    }
};
var callAbringWithFileUpload = function (methodUrl,postData,successCallback,failCallback,identifier) {

    successCallback = successCallback || function () {};
    failCallback = failCallback || function () {};

    if(!abring.params.isOnline)
    {
        log("You are offline!\nPlease check your internet connection");
        failCallback({},500,"You are offline!\nPlease check your internet connection");
        return false;
    }
    /*
     Example:
     var postData = {
     "name":$(".page.profile_form_update .name").val(), //value as string
     "avatar": $("#abring_profile_avatar_upload")[0].files[0] //value as file
     };
     */
    var url = abring.params.ws_base_url+methodUrl;

    var data = new FormData();

    data.append("app", abring.params.app);
    if(abring.params.token)
        data.append("token", abring.params.token);
    postData = postData || {};
    $.each(postData,function (inputName,inputValue) {
        if(typeof inputValue!="string")
            inputValue = JSON.stringify(inputValue);
        data.append(inputName, inputValue);
    });
    var ajaxTime = new Date().getTime();
    $.ajax({
        url: url,
        data: data,
        type: "POST",
        contentType: false,
        processData: false,
        beforeSend:function (xhr) {
            //show loading dialog
        },
        success: function (json_result_data,status,xhr) {

            //hide loading dialog
            json_result_data = JSON.parse(json_result_data);

            if(json_result_data['code']&&json_result_data['code']=="401")
            {
                if(abring.params.player_info || abring.params.token)
                    abringPlayerLogout();
                //try to login with uuid
                abring.params.display.loading.show("you are not login\ntry to login with your device\nplease wait");
                abringPLayerLoginWithDeviceId(
                    function () {
                        abring.params.display.hidePageFunction();//continue previous request ????????????
                        log("Logged in with device id was successful");
                    },function (xhr,code,error) {
                        log("first in with device id was failed:\n"+error);
                        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
                    }
                );

                return false;
            }
            if(!json_result_data['code']||json_result_data['code']!="200")
            {
                failCallback(xhr,json_result_data['code'],"failed:"+json_result_data['message']);
                return false;
            }

            var result = json_result_data["result"] || false;

            if(successCallback)
                successCallback(result,identifier);

            var totalTime = new Date().getTime()-ajaxTime;

            log("respond in "+totalTime+"ms");

            return result;
        },
        error: function (xhr, status, error) {
            //hide loading dialog
            if(failCallback)
                failCallback(xhr, status, error,identifier);
            $('#result').html(xhr.responseText);
        }
    });

};
var chunkString = function(str, length) {
    return str.match(new RegExp('.{1,' + length + '}', 'g'));
};
var setCookie = function (cname, cvalue, exdays,setCookieSuccess,setCookieFailed) {
    setCookieSuccess = setCookieSuccess || function(){};
    setCookieFailed = setCookieFailed || function(){};
    if(abring.params.isCordovaApp)
    {
        cname = "c_"+cname+".txt";
        if(exdays<=0)
            delCookie(cname);
        if(isArray(cvalue)||isObject(cvalue))
            cvalue = JSON.stringify(cvalue);
        log("set file as cookie of "+cname+"="+cvalue);
        localFileWrite(cname,cvalue,false,setCookieSuccess,setCookieFailed);
        return true;
    }else{
        log("set cookie of "+cname);
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        if(typeof cvalue != "string")
            cvalue = JSON.stringify(cvalue);
        if(cvalue.length>abring.params.cookie_max_size)
        {
            var cvalue_parts = chunkString(cvalue,abring.params.cookie_max_size);
            setCookie(cname+"_chunk",1,100,function(){},function(){});
            $.each(cvalue_parts,function(index,item){
                setCookie(cname+"_"+index,item,100);
            });
        }else {
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }
        setCookieSuccess();
        return true;
    }
};
var delCookie = function (cname,delCookieSuccess,delCookieFailed) {
    if(abring.params.isCordovaApp)
    {
        cname = "c_"+cname+".txt";
        log("del cookie file"+cname);
        localFileWrite(cname,"",false,delCookieSuccess,delCookieFailed);
        return true;
    }else{
        log("del cookie of "+cname);

        var expires = "0";

        if(checkIfCookieIsMultipart(cname))
        {
            for(i=0;i<100;i++)
            {
                if(getCookie(cname+"_"+i))
                    document.cookie = cname + "=;" + expires + ";path=/";
                else
                    break;
            }
        }else
            document.cookie = cname + "=;" + expires + ";path=/";
        delCookieSuccess();
        return true;
    }
};
var getCookie = function (cname) {
    if(abring.params.isCordovaApp)
    {
        cname = "c_"+cname+".txt";
        log("read cookie as file of "+cname);
        var value = localFileRead(cname);

        if(isJson(value))
            return JSON.parse(value);
        else
            return value;
    }else{
        log("read cookie of "+cname);
        var cvalue = "";
        var cvalue_part = "";

        if(checkIfCookieIsMultipart(cname))
        {
            for(i=0;i<100;i++)
            {
                cvalue_part = getCookie(cname+"_"+i);
                if(cvalue_part)
                    cvalue += cvalue_part;
                else
                    break;
            }
            try{
                cvalue = JSON.parse(cvalue);
            }catch(e){}
            return cvalue;
        }
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                cvalue = c.substring(name.length, c.length);
                try{
                    cvalue = JSON.parse(cvalue);
                }catch(e){}
                return cvalue;
            }
        }
        return "";
    }
};
var checkIfCookieIsMultipart = function (cname) {
    var name = cname + "_chunk=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            cvalue = c.substring(name.length, c.length);
            cvalue = JSON.parse(cvalue);
            return (cvalue==1);
        }
    }
};
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
var getTime = function (format) {
    format = format || "timestamp";
    if(format=="timestamp"){
        return Math.floor(Date.now() / 1000);
    }else{
        return false;
    }
};
var is_valid_mobile_number = function(mobile_number) {
    return (mobile_number.replace("+98","").replace("0098","").replace("091","").length==10);
};
var abringShowSplash = function(wait){
    wait = wait || 3;
    $("#abring .splash,#abring").show();
    setTimeout(function(){ $("#abring .splash,#abring").hide(); }, wait*1000);
};
var rand = function(min,max){
    return Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) + parseInt(min);
};
var randomString = function(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};
var nl2br = function (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
};
var br2ln = function (str) {
    return (str + '').replaceAll("<br>", "\n").replaceAll("\n\n", "\n");
};
var log = function (message,save_to_file) {
    save_to_file = save_to_file || false;
    // alert(message);
    console.log(message);
    if(abring.params.isCordovaApp && save_to_file) { //this part will cause in law performance ??????????????????
        localFileWrite("log.txt", "\n" + get_current_time() + "\n" + message + "\n", true);
    }
    $(".abring_log_preview").append(message + "<br>");
    return true;
};
var get_current_time = function(){
    return getTime("timestamp")
};
var isObject = function(a) {
    return (!!a) && (a.constructor === Object);
};
var isArray = function(a) {
    return (!!a) && (a.constructor === Array);
};
var isJson = function(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};
var isImage = function(image) {
    if(!image)
        return false;
    var strCount = image.substr(-3).toLocaleLowerCase();
    if(strCount == 'jpg' || strCount == 'gif' || strCount == 'svg' ||  strCount == 'png' || strCount == 'bmp' || strCount == 'bat'){
        return strCount;
    }
    strCount = image.substr(-4).toLocaleLowerCase();
    if(strCount == 'jpeg' || strCount == 'tiff' || strCount == 'jfif'){
        return strCount;
    }
    return false;
};
var isVideo = function(video) {
    if(!video)
        return false;
    var strCount = video.substr(-3).toLocaleLowerCase();
    if(strCount == 'mkv' || strCount == 'flv' || strCount == 'mp4' || strCount == 'ogg' || strCount == 'avi' || strCount == 'mov' || strCount == 'wmv' || strCount == 'mpg' || strCount == '3gp'){
        return strCount;
    }
    strCount = video.substr(-4).toLocaleLowerCase();
    if(strCount == 'mpeg'){
        return strCount;
    }
    return false;
};
var updateLocation = function (locationSuccessCallback,locationFailCallback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                abring.params.current_location_latitude = position.coords.latitude;
                log( "Latitude: " + position.coords.latitude );
                abring.params.current_location_longitude = position.coords.longitude;
                log( "Longitude: " + position.coords.longitude);
                if(!abring.params.isOnline)
                {
                    locationFailCallback();
                    return false;
                }
                var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+abring.params.current_location_latitude+","+abring.params.current_location_longitude+"&sensor=false";
                $.ajax({
                    dataType: "json",
                    url: url,
                    data: {},
                    success: function(data){
                        log("location success");
                        if(data["status"]=="OK")
                        {
                            var l = data["results"][2]["address_components"].length;
                            abring.params.current_location_country = data["results"][2]["address_components"][l-1]["long_name"];
                            abring.params.current_location_province = data["results"][2]["address_components"][l-2]["long_name"];
                            abring.params.current_location_city = data["results"][2]["address_components"][l-3]["long_name"];
                        }
                        locationSuccessCallback = locationSuccessCallback || function(){log("province = " + abring.params.current_location_province);};
                        locationSuccessCallback({"country":abring.params.current_location_country,"province":abring.params.current_location_province,"city":abring.params.current_location_city,"latitude":abring.params.current_location_latitude,"longitude":abring.params.current_location_longitude});
                    },
                    fail: function(){
                        locationFailCallback = locationFailCallback || function () {
                            log("location fail: google api failed");
                        };
                    }
                });
            },
            function(){
                console.log("location fail: not permitted");
            }
        );
    } else {
        locationFailCallback = locationFailCallback || function () {
            log( "Geo location is not supported by this browser." );
        };
    }
};

/**
 *
 * @param number
 * @param message
 * @param smsSuccessCallback
 * @param smsFailCallback
 * @param intent
 *
 * https://www.npmjs.com/package/cordova-plugin-sms
 * 
 * sendSMS(address(s), text, successCallback, failureCallback);
 * listSMS(filter, successCallback, failureCallback);
 * deleteSMS(filter, successCallback, failureCallback);
 *
 * startWatch(successCallback, failureCallback);
 * stopWatch(successCallback, failureCallback);
 *
 * enableIntercept(on_off, successCallback, failureCallback);
 * restoreSMS(msg_or_msgs, successCallback, failureCallback);
 *
 * setOptions(options, successCallback, failureCallback);
 *
 * @returns {boolean}
 */
var smsSend = function (number,message,smsSuccessCallback,smsFailCallback,intent) {

    console.log("Send SMS to " + number + "\n" + message);
    smsSuccessCallback = smsSuccessCallback || function () { log('Message sent successfully'); };
    smsFailCallback =  smsFailCallback || function (e) { log('Message Failed:' + e); };

    if(!abring.params.isCordovaApp)
    {
        smsFailCallback("It is not a mobile application");
        return false;
    }

    if(typeof SMS === "undefined")
    {
        smsFailCallback("Sms plugin not loaded");
        return false;
    }

    if(SMS)
    {
        var options = {
            //     intent = intent || 'INTENT';
            //     // intent = 'INTENT'  // send SMS with the native android SMS messaging
            //     // intent: '' // send SMS without open any other app
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                intent: intent
            }
        };
        SMS.setOptions(options,function () {
            SMS.sendSMS(number,message,smsSuccessCallback,smsFailCallback);
        },function () {
            smsFailCallback("failed to set options");
        });
    }
    else
        smsFailCallback("SMS loaded but not defined");

};

var loop_params = {};
var start_loop = function (start,end,sleep,func,id){

    if(!id) id = loop_params.length || 0;

    loop_params[id] = {
        "start": start,
        "end": end,
        "sleep": sleep
    };


    if(loop_params[id]["start"] < loop_params[id]["end"]){
        setTimeout(function(){
            loop_params[id]["start"]++;
            func(loop_params[id]["start"],id);
            start_loop(loop_params[id]["start"],loop_params[id]["end"],loop_params[id]["sleep"],func,id);
        }, loop_params[id]["sleep"]*1000);
    }
};
var exit_loop = function (id) {
    loop_params[id]["start"] = loop_params[id]["end"];
};
var checkIsOnline = function(checkIsOnlineSuccess){
    checkIsOnlineSuccess = checkIsOnlineSuccess || function(){};
    callAbringWithFileUpload("site/ping",{}, function () {
        abring.params.isOnline = true;
        checkIsOnlineSuccess(true);
        socketConnect();
    },function (x,c,e) {
        abring.params.isOnline = false;
        checkIsOnlineSuccess(false);
        if(abring.params.socketObject != null)
            abring.params.socketObject.onclose();
    });
};
var array_diff = function (a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
};
var play_sound = function(sound_src){
    sound_src = sound_src || abring.params.sounds.notification;
    var audio = new Audio(sound_src);
    audio.play();
};
var current_file = function(relative) {
    relative = relative || false;
    var script = document.currentScript;
    if(relative)
        return $(script).attr("src");
    else
        return script.src;
};
var current_dir = function(relative) {
    relative = relative || false;
    var script = document.currentScript;
    var file = "";
    if(relative)
        file = $(script).attr("src");
    else
        file = script.src;
    return file.substring(0, file.lastIndexOf('/'));
};
var setBadge = function (badgeNumber) {//an small number shown in corner of application icon
    abring.params.badgeNumber = badgeNumber;
    if(abring.params.isCordovaApp)
    {
        // cordova.plugins.notification.badge.increase();
        // cordova.plugins.notification.badge.decrease(2);
        cordova.plugins.notification.badge.set(badgeNumber);
        if(badgeNumber==0)
            cordova.plugins.notification.badge.clear();
    }
    return badgeNumber;
};