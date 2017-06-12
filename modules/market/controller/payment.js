
/**
 * payment event lister
 */
$(document).on("click",".abring_buttons_market_pay",function () {

    if(!abring.params.player_info)
    {
        abring.params.player.pages.player_mobile_register.show("Your are not login!");
        return false;
    }

    var payment_id = $(this).attr("basket_id");
    payByBank(payment_id);
});
$(document).on("click",".abring_buttons_market_get_payments",function () {

    if(!abring.params.player_info)
    {
        abring.params.player.pages.player_mobile_register.show("Your are not login!");
        return false;
    }

    getPayments();
});