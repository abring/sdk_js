
/**
 * friends functions
 */

var friendsView = "";

var initFriends = function () {
    friendsView = readFile(abring_url+"/modules/friends/view/friends.html");
    $("#"+abring.params.friends.parent_id).html(friendsView);

    requests_friend_detail = $("#"+abring.params.friends.parent_id+" .friends_list .requests_friend_details .friend_details").html();
    $("#"+abring.params.friends.parent_id+" .friends_list .requests_friend_details .friend_details *").remove();

    members_friend_detail = $("#"+abring.params.friends.parent_id+" .friends_list .members_friend_details .friend_details").html();
    $("#"+abring.params.friends.parent_id+" .friends_list .members_friend_details  .friend_details *").remove();

    invitations_friend_detail = $("#"+abring.params.friends.parent_id+" .friends_list .invitations_friend_details .friend_details").html();
    $("#"+abring.params.friends.parent_id+" .friends_list .members_friend_details .friend_details *").remove();

    suggested_friend_detail = $("#"+abring.params.friends.parent_id+" .friends_list .suggested_friend_details .friend_details").html();
    $("#"+abring.params.friends.parent_id+" .friends_list .suggested_friend_details .friend_details *").remove();

    searched_friend_detail = $("#"+abring.params.friends.parent_id+" .friends_list .friends_search .friend_details").html();
    $("#"+abring.params.friends.parent_id+" .friends_list .friend_details *").remove();
};

var abringFriendsListShow = function () {

    abring.params.display.loading.show("loading list of your friends!");

    // $("#"+abring.params.friends.parent_id+" .friends_list .message").html("Loading friends list!");
    // $("#"+abring.params.friends.parent_id+" .friends_list .friend_details").hide();

    callAbringWithFileUpload("friends/list", false, friendListSuccess, friendListFail);
};
var friendListSuccess = function (friends_list) {


    // abringLoadingFinish();

    $("#"+abring.params.friends.parent_id+" .friends_list .friends_search .friend_details").html("");
    if(friends_list["members"]==undefined)
    {
        $("#"+abring.params.friends.parent_id+" .friends_list .message").html("No friend yet!");
        // return;
    }else{

    }
    $("#"+abring.params.friends.parent_id+" .friends_list .message").html("Friend_list!");
    friends_list['requests'] = friends_list['requests'] || [];
    friends_list['invitations'] = friends_list['invitations'] || [];
    friends_list['members'] = friends_list['members'] || [];
    friends_list['suggested'] = friends_list['suggested'] || [];

    $("#"+abring.params.friends.parent_id+" .friends_list .requests_friend_details .friend_details").html("");
    $.each(friends_list['requests'],function (key,player) {
        player['name'] = player['name'] || player['player_id'];
        if(player['name']=="No name")player['name']=player['player_id'];
        var friend_detail = requests_friend_detail.replaceAll("PLAYER_ID",player['player_id']).replaceAll("PLAYER_AVATAR",player['avatar']).replaceAll("PLAYER_NAME",player['name']);
        $("#"+abring.params.friends.parent_id+" .friends_list .requests_friend_details .friend_details").append(friend_detail);
        if(!player['avatar'] || player['avatar']=="" || player['avatar']=="No avatar")player['avatar']=abring.params.abring_default_avatar_url;
        $("#"+abring.params.friends.parent_id+" .friends_list .requests_friend_details .friend_details .avatar:last").attr("src",player['avatar']);
    });

    $("#"+abring.params.friends.parent_id+" .friends_list .invitations_friend_details .friend_details").html("");
    $.each(friends_list['invitations'],function (key,player) {
        player['name'] = player['name'] || player['player_id'];
        if(player['name']=="No name")player['name']=player['player_id'];
        var friend_detail = invitations_friend_detail.replaceAll("PLAYER_ID",player['player_id']).replaceAll("PLAYER_AVATAR",player['avatar']).replaceAll("PLAYER_NAME",player['name']);
        $("#"+abring.params.friends.parent_id+" .friends_list .invitations_friend_details .friend_details").append(friend_detail);
        if(!player['avatar'] || player['avatar']=="" || player['avatar']=="No avatar")player['avatar']=abring.params.abring_default_avatar_url;
        $("#"+abring.params.friends.parent_id+" .friends_list .invitations_friend_details .friend_details .avatar:last").attr("src",player['avatar']);
        // var friend_detail = invitations_friend_detail.replaceAll("PLAYER_ID",player_id);
        // $("#"+abring.params.friends.parent_id+" .friends_list .invitations_friend_details .friend_details").append(friend_detail);
    });
    $("#"+abring.params.friends.parent_id+" .friends_list .members_friend_details .friend_details").html("");
    $.each(friends_list['members'],function (key,player) {
        player['name'] = player['name'] || player['player_id'];
        if(player['name']=="No name")player['name']=player['player_id'];
        var friend_detail = members_friend_detail.replaceAll("PLAYER_ID",player['player_id']).replaceAll("PLAYER_AVATAR",player['avatar']).replaceAll("PLAYER_NAME",player['name']);
        $("#"+abring.params.friends.parent_id+" .friends_list .members_friend_details .friend_details").append(friend_detail);
        if(!player['avatar'] || player['avatar']=="" || player['avatar']=="No avatar")player['avatar']=abring.params.abring_default_avatar_url;
        $("#"+abring.params.friends.parent_id+" .friends_list .members_friend_details .friend_details .avatar:last").attr("src",player['avatar']);
        // var friend_detail = members_friend_detail.replaceAll("PLAYER_ID",player_id);
        // $("#"+abring.params.friends.parent_id+" .friends_list .members_friend_details .friend_details").append(friend_detail);
    });
    $("#"+abring.params.friends.parent_id+" .friends_list .suggested_friend_details .friend_details").html("");
    $.each(friends_list['suggested'],function (key,player) {
        player['name'] = player['name'] || player['player_id'];
        if(player['name']=="No name")player['name']=player['player_id'];
        var friend_detail = suggested_friend_detail.replaceAll("PLAYER_ID",player['player_id']).replaceAll("PLAYER_AVATAR",player['avatar']).replaceAll("PLAYER_NAME",player['name']);
        $("#"+abring.params.friends.parent_id+" .friends_list .suggested_friend_details .friend_details").append(friend_detail);
        if(!player['avatar'] || player['avatar']=="" || player['avatar']=="No avatar")player['avatar']=abring.params.abring_default_avatar_url;
        $("#"+abring.params.friends.parent_id+" .friends_list .suggested_friend_details .friend_details .avatar:last").attr("src",player['avatar']);
    });

    abring.params.display.showPageFunction("friends_list");
};
var friendListFail = function () {
    abring.params.display.error.show("failed to load friends list!");
    // $("#"+abring.params.friends.parent_id+" .friends_list .message").html("error loading list!");
};
var abringFriendsSearch = function (pattern) {

    $("#"+abring.params.friends.parent_id+" .friends_list .friends_search .friend_details").html("Searching ...");

    var data = {
        "pattern":pattern,
        "offset":0,
        "limit":5
    };
    callAbringWithFileUpload("friends/search",data,abringFriendsSearchSuccess,abringFriendsSearchFail);

};
var abringFriendsSearchSuccess = function (search_result ) {

    $("#"+abring.params.friends.parent_id+" .friends_list .friends_search .friend_details").html("");

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
        $("#"+abring.params.friends.parent_id+" .friends_list .friends_search .friend_details").append(friend_detail);

        if(player['avatar'] && player['avatar']!="No avatar")
            $("#"+abring.params.friends.parent_id+" .friends_list .friends_search .friend_details .avatar").last().attr("src",player['avatar']);
    });

    // $("#"+abring.params.friends.parent_id+" .friends_list .friends_search .result").html("result is going here\n"+search_result);
};
var abringFriendsSearchFail = function () {
};
var abringFriendsInvite = function (invited_player_id) {
    var data = {"player_id": invited_player_id};
    callAbringWithFileUpload("friends/invite",data,
        function (suggestion_result) {
            $("#"+abring.params.friends.parent_id+" .invite[name='" + invited_player_id + "'] input[type='button']").val("Invited (cancel request)!");
            $("#"+abring.params.friends.parent_id+" .invite[name='" + invited_player_id + "']").removeClass("invite").addClass("cancel_request");
            log("suggestion result = " + suggestion_result);
        }
    );
};
var abringFriendsAccept = function (invited_player_id) {
    var data = {"player_id": invited_player_id};
    callAbringWithFileUpload("friends/accept",data,
        function (suggestion_result) {
            $("#"+abring.params.friends.parent_id+" .accept_request[name='" + invited_player_id + "'] input[type='button']").val("Accepted (Unfriend?)!");
            $("#"+abring.params.friends.parent_id+" .reject_request[name='" + invited_player_id + "'] input[type='button']").hide();
            $("#"+abring.params.friends.parent_id+" .accept_request[name='" + invited_player_id + "']").removeClass("accept_request").addClass("unfriend");

            log("accept request result = "+suggestion_result);

        },function (x,c,e) {

        }
    );
};
var abringFriendsReject = function (invited_player_id) {
    var data = {"player_id": invited_player_id};
    callAbringWithFileUpload("friends/reject",data,
        function (suggestion_result) {
            $("#"+abring.params.friends.parent_id+" .reject_request[name='" + invited_player_id + "'] input[type='button']").val("Rejected (Invite again?)!");
            $("#"+abring.params.friends.parent_id+" .reject_request[name='" + invited_player_id + "']").removeClass("reject_request").addClass("invite");
            log("reject request result = "+suggestion_result);
        },function (x,c,e) {

        }
    );
};
var abringFriendsCancel = function (invited_player_id) {
    var data = {"player_id": invited_player_id};
    callAbringWithFileUpload("friends/cancel-request",data,
        function (suggestion_result) {
            $("#"+abring.params.friends.parent_id+" .cancel_request[name='" + invited_player_id + "'] input[type='button']").val("Cancelled (Invite again?)!");
            $("#"+abring.params.friends.parent_id+" .cancel_request[name='" + invited_player_id + "']").removeClass("cancel_request").addClass("invite");
            log("cancel request result = "+suggestion_result);
        },function (x,c,e) {

        }
    );
};
var abringFriendsUnfriend = function (invited_player_id) {
    var data = {"player_id": invited_player_id};
    callAbringWithFileUpload("friends/unfriend",data,
        function (suggestion_result) {
            $("#"+abring.params.friends.parent_id+" .unfriend_request[name='" + invited_player_id + "'] input[type='button']").val("Cancelled (Invite again?)!");
            $("#"+abring.params.friends.parent_id+" .unfriend_request[name='" + invited_player_id + "']").removeClass("unfriend_request").addClass("invite");
            log("unfriend result = "+suggestion_result);
        },function (x,c,e) {

        }
    );
};