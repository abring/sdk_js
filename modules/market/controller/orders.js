
/**
 * basket event lister
 */
$(document).on("click",".abring_buttons_basket_list",function () {

    if(!abring.params.player_info)
    {
        abring.player.pages.player_mobile_register.show("Your are not login!");
        return false;
    }

});