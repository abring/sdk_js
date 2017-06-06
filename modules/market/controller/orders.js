
/**
 * basket event lister
 */
$(document).on("click",".abring_buttons_basket_list",function () {

    if(!abring.params.player_info)
    {
        abring.params.player.showPageFunction("player_mobile_register","Your are not login!");
        return false;
    }

});