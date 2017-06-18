
/**
 * payment event lister
 */
$(document).on("click",".abring_buttons_market_pay",function () {

    if(!abring.player_info)
    {
        abring.player.pages.player_mobile_register.show("Your are not login!");
        return false;
    }

    var payment_id = $(this).attr("basket_id");
    payByBank(payment_id);
});