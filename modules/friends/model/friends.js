
/**
 * friends functions
 */

var friendsView = "";

var initFriends = function () {
    friendsView = readFile("abring/modules/friends/view/friends.html");
    $("#"+abring.params.friends_parent_id).html(friendsView);

    requests_friend_detail = $("#"+abring.params.friends_parent_id+" .friends_list .requests_friend_details .friend_details").html();
    $("#"+abring.params.friends_parent_id+" .friends_list .requests_friend_details .friend_details *").remove();

    members_friend_detail = $("#"+abring.params.friends_parent_id+" .friends_list .members_friend_details .friend_details").html();
    $("#"+abring.params.friends_parent_id+" .friends_list .members_friend_details  .friend_details *").remove();

    invitations_friend_detail = $("#"+abring.params.friends_parent_id+" .friends_list .invitations_friend_details .friend_details").html();
    $("#"+abring.params.friends_parent_id+" .friends_list .members_friend_details .friend_details *").remove();

    suggested_friend_detail = $("#"+abring.params.friends_parent_id+" .friends_list .suggested_friend_details .friend_details").html();
    $("#"+abring.params.friends_parent_id+" .friends_list .suggested_friend_details .friend_details *").remove();

    searched_friend_detail = $("#"+abring.params.friends_parent_id+" .friends_list .friends_search .friend_details").html();
    $("#"+abring.params.friends_parent_id+" .friends_list .friend_details *").remove();
};

var friends_loading_start = function () {
    abringPageShow("loading","loading list of your friends!");
    abringLoadingStart();

};
var friends_loading_finish = function () {
    abringPageHide();
};
var friends_show_page = function () {
    abringPageShow("friends_list");
};

var abringFriendsListShow = function () {

    abring.params.friends_loading_start_function();

    // $("#"+abring.params.friends_parent_id+" .friends_list .message").html("Loading friends list!");
    // $("#"+abring.params.friends_parent_id+" .friends_list .friend_details").hide();

    callAbringWithFileUpload("friends/list", false, friendListSuccess, friendListFail);
};
var friendListSuccess = function (friends_list) {


    // abringLoadingFinish();

    $("#"+abring.params.friends_parent_id+" .friends_list .friends_search .friend_details").html("");
    if(friends_list["members"]==undefined)
    {
        $("#"+abring.params.friends_parent_id+" .friends_list .message").html("No friend yet!");
        // return;
    }else{

    }
    $("#"+abring.params.friends_parent_id+" .friends_list .message").html("Friend_list!");
    friends_list['requests'] = friends_list['requests'] || [];
    friends_list['invitations'] = friends_list['invitations'] || [];
    friends_list['members'] = friends_list['members'] || [];
    friends_list['suggested'] = friends_list['suggested'] || [];

    $("#"+abring.params.friends_parent_id+" .friends_list .requests_friend_details .friend_details").html("");
    $.each(friends_list['requests'],function (key,player) {
        player['name'] = player['name'] || player['player_id'];
        if(player['name']=="No name")player['name']=player['player_id'];
        var friend_detail = requests_friend_detail.replaceAll("PLAYER_ID",player['player_id']).replaceAll("PLAYER_AVATAR",player['avatar']).replaceAll("PLAYER_NAME",player['name']);
        $("#"+abring.params.friends_parent_id+" .friends_list .requests_friend_details .friend_details").append(friend_detail);
        if(!player['avatar'] || player['avatar']=="" || player['avatar']=="No avatar")player['avatar']=abring.params.abring_default_avatar_url;
        $("#"+abring.params.friends_parent_id+" .friends_list .requests_friend_details .friend_details .avatar:last").attr("src",player['avatar']);
    });

    $("#"+abring.params.friends_parent_id+" .friends_list .invitations_friend_details .friend_details").html("");
    $.each(friends_list['invitations'],function (key,player) {
        player['name'] = player['name'] || player['player_id'];
        if(player['name']=="No name")player['name']=player['player_id'];
        var friend_detail = invitations_friend_detail.replaceAll("PLAYER_ID",player['player_id']).replaceAll("PLAYER_AVATAR",player['avatar']).replaceAll("PLAYER_NAME",player['name']);
        $("#"+abring.params.friends_parent_id+" .friends_list .invitations_friend_details .friend_details").append(friend_detail);
        if(!player['avatar'] || player['avatar']=="" || player['avatar']=="No avatar")player['avatar']=abring.params.abring_default_avatar_url;
        $("#"+abring.params.friends_parent_id+" .friends_list .invitations_friend_details .friend_details .avatar:last").attr("src",player['avatar']);
        // var friend_detail = invitations_friend_detail.replaceAll("PLAYER_ID",player_id);
        // $("#"+abring.params.friends_parent_id+" .friends_list .invitations_friend_details .friend_details").append(friend_detail);
    });
    $("#"+abring.params.friends_parent_id+" .friends_list .members_friend_details .friend_details").html("");
    $.each(friends_list['members'],function (key,player) {
        player['name'] = player['name'] || player['player_id'];
        if(player['name']=="No name")player['name']=player['player_id'];
        var friend_detail = members_friend_detail.replaceAll("PLAYER_ID",player['player_id']).replaceAll("PLAYER_AVATAR",player['avatar']).replaceAll("PLAYER_NAME",player['name']);
        $("#"+abring.params.friends_parent_id+" .friends_list .members_friend_details .friend_details").append(friend_detail);
        if(!player['avatar'] || player['avatar']=="" || player['avatar']=="No avatar")player['avatar']=abring.params.abring_default_avatar_url;
        $("#"+abring.params.friends_parent_id+" .friends_list .members_friend_details .friend_details .avatar:last").attr("src",player['avatar']);
        // var friend_detail = members_friend_detail.replaceAll("PLAYER_ID",player_id);
        // $("#"+abring.params.friends_parent_id+" .friends_list .members_friend_details .friend_details").append(friend_detail);
    });
    $("#"+abring.params.friends_parent_id+" .friends_list .suggested_friend_details .friend_details").html("");
    $.each(friends_list['suggested'],function (key,player) {
        player['name'] = player['name'] || player['player_id'];
        if(player['name']=="No name")player['name']=player['player_id'];
        var friend_detail = suggested_friend_detail.replaceAll("PLAYER_ID",player['player_id']).replaceAll("PLAYER_AVATAR",player['avatar']).replaceAll("PLAYER_NAME",player['name']);
        $("#"+abring.params.friends_parent_id+" .friends_list .suggested_friend_details .friend_details").append(friend_detail);
        if(!player['avatar'] || player['avatar']=="" || player['avatar']=="No avatar")player['avatar']=abring.params.abring_default_avatar_url;
        $("#"+abring.params.friends_parent_id+" .friends_list .suggested_friend_details .friend_details .avatar:last").attr("src",player['avatar']);
    });

    abring.params.friends_loading_finish_function();
    abring.params.friends_show_page_function();

};
var  friendListFail = function () {
    abringPageShow("error","failed to load friends list!");
    // $("#"+abring.params.friends_parent_id+" .friends_list .message").html("error loading list!");
};
var abringFriendsSearch = function (pattern) {

    $("#"+abring.params.friends_parent_id+" .friends_list .friends_search .friend_details").html("Searching ...");

    var data = {
        "pattern":pattern,
        "offset":0,
        "limit":5
    };
    callAbringWithFileUpload("friends/search",data,abringFriendsSearchSuccess,abringFriendsSearchFail);

};
var abringFriendsSearchSuccess = function (search_result ) {

    $("#"+abring.params.friends_parent_id+" .friends_list .friends_search .friend_details").html("");

    $.each(search_result,function (key,player) {
        player['name'] = player['name'] || player['player_id'];
        if(player['name']=="No name" || player['name']=="")player['name']=player['player_id'];
        var friend_detail = searched_friend_detail.replaceAll("PLAYER_ID",player['player_id']).replaceAll("PLAYER_AVATAR",player['avatar']).replaceAll("PLAYER_NAME",player['name']);
        friend_detail = friend_detail.replaceAll("PLAYER_INVITE", 'block');
        $.each(abring.params.player_info['friends']['members'] , function(friendsKey , friendsValue){ console.log(friendsValue[['player_id']] +'----'+ player['player_id']);
            if(friendsValue['player_id'] == player['player_id']){
                friend_detail = friend_detail.replaceAll("PLAYER_INVITE", 'none');
            }
        });
        $("#"+abring.params.friends_parent_id+" .friends_list .friends_search .friend_details").append(friend_detail);

        if(player['avatar'] && player['avatar']!="No avatar")
            $("#"+abring.params.friends_parent_id+" .friends_list .friends_search .friend_details .avatar").last().attr("src",player['avatar']);
    });

    // $("#"+abring.params.friends_parent_id+" .friends_list .friends_search .result").html("result is going here\n"+search_result);
};
var abringFriendsSearchFail = function () {
};
var abringFriendsInvite = function (invited_player_id) {
    var data = {"player_id": invited_player_id};
    var suggestion_result = callAbring("friends/invite",data);
    log("suggestion result = " + suggestion_result);
    if( suggestion_result ) {
        $("#"+abring.params.friends_parent_id+" .invite[name='" + invited_player_id + "'] input[type='button']").val("Invited (cancel request)!");
        $("#"+abring.params.friends_parent_id+" .invite[name='" + invited_player_id + "']").removeClass("invite").addClass("cancel_request");
    }else{
        alert("error");
    }
    return true;
};
var abringFriendsAccept = function (invited_player_id) {
    var data = {"player_id": invited_player_id};
    var suggestion_result = callAbring("friends/accept",data);
    log("accept request result = "+suggestion_result);

    if( suggestion_result ) {
        $("#"+abring.params.friends_parent_id+" .accept_request[name='" + invited_player_id + "'] input[type='button']").val("Accepted (Unfriend?)!");
        $("#"+abring.params.friends_parent_id+" .reject_request[name='" + invited_player_id + "'] input[type='button']").hide();
        $("#"+abring.params.friends_parent_id+" .accept_request[name='" + invited_player_id + "']").removeClass("accept_request").addClass("unfriend");
    }else{
        alert("error");
    }
    return true;
};
var abringFriendsReject = function (invited_player_id) {
    var data = {"player_id": invited_player_id};
    var suggestion_result = callAbring("friends/reject",data);
    log("reject request result = "+suggestion_result);

    if( suggestion_result ) {
        $("#"+abring.params.friends_parent_id+" .reject_request[name='" + invited_player_id + "'] input[type='button']").val("Rejected (Invite again?)!");
        $("#"+abring.params.friends_parent_id+" .reject_request[name='" + invited_player_id + "']").removeClass("reject_request").addClass("invite");
    }else{
        alert("error");
    }
    return true;
};
var abringFriendsCancel = function (invited_player_id) {
    var data = {"player_id": invited_player_id};
    var suggestion_result = callAbring("friends/cancel-request",data);
    log("cancel request result = "+suggestion_result);

    if( suggestion_result ) {
        $("#"+abring.params.friends_parent_id+" .cancel_request[name='" + invited_player_id + "'] input[type='button']").val("Cancelled (Invite again?)!");
        $("#"+abring.params.friends_parent_id+" .cancel_request[name='" + invited_player_id + "']").removeClass("cancel_request").addClass("invite");
    }else{
        alert("error");
    }
    return true;
};
var abringFriendsUnfriend = function (invited_player_id) {
    var data = {"player_id": invited_player_id};
    var suggestion_result = callAbring("friends/unfriend",data);
    log("unfriend result = "+suggestion_result);

    if( suggestion_result ) {
        $("#"+abring.params.friends_parent_id+" .unfriend_request[name='" + invited_player_id + "'] input[type='button']").val("Cancelled (Invite again?)!");
        $("#"+abring.params.friends_parent_id+" .unfriend_request[name='" + invited_player_id + "']").removeClass("unfriend_request").addClass("invite");
    }else{
        alert("error");
    }
    return true;
};