
/**
 * friends event lister
 */
$(document).on("click",".abring_buttons_friends_list",function () {

    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }

    abringFriendsListShow();
});
$(document).on("keyup","#"+abring.params.friends.parent_id+" .friends_search_input",function (e) {

    if(!abring.params.player_info)
    {
        abring.params.display.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }
    var search_pattern = $(".friends_search input.friends_search_input").val();
    if(!search_pattern)
    {
        abring.params.display.showPageFunction("friends_list","Search cannot be empty");
        return false;
    }else{
        abring.params.display.showPageFunction("friends_list","Search result!");
    }
    abringFriendsSearch(search_pattern);
});
$(document).on("click","#"+abring.params.friends.parent_id+" .invite",function () {
    abringFriendsInvite($(this).attr("name"));
});
$(document).on("click","#"+abring.params.friends.parent_id+" .cancel_request",function () {
    abringFriendsCancel($(this).attr("name"));
});
$(document).on("click","#"+abring.params.friends.parent_id+" .accept_request",function () {
    abringFriendsAccept($(this).attr("name"));
});
$(document).on("click","#"+abring.params.friends.parent_id+" .reject_request",function () {
    abringFriendsReject($(this).attr("name"));
});
$(document).on("click","#"+abring.params.friends.parent_id+" .unfriend_request",function () {
    abringFriendsUnfriend($(this).attr("name"));
});

