
/**
 * basket event lister
 */
$(document).on("click",".abring_button_market_add_to_basket",function () {

    if(!abring.player_info)
    {
        abring.player.pages.player_mobile_register.show("Your are not login!");
        return false;
    }

    var product_id = $(this).attr("product_id");
    var amount = $(this).parent().find("input.order").val() || 1;

    addToBasket(
        product_id,
        amount,
        function (basket) {
            fillBasketView(basket);
            abring.market.basket.pages.basketView.show();
        },function (x,c,e) {
            abring.display.error.show(e);
        }
    );
});
$(document).on("click",".abring_button_market_delete_from_basket",function () {

    if(!abring.player_info)
    {
        abring.player.pages.player_mobile_register.show("Your are not login!");
        return false;
    }

    var product_id = $(this).attr("product_id");
    var amount = 0;

    addToBasket(
        product_id,
        amount,
        function (basket) {
            fillBasketView(basket);
            abring.market.basket.pages.basketView.show();
        },function (x,c,e) {
            abring.display.error.show(e);
        }
    );
});
$(document).on("click",".abring_buttons_market_basket_view",function () {

    if(!abring.player_info)
    {
        abring.player.pages.player_mobile_register.show("Your are not login!");
        return false;
    }

    var basket_id = $(this).attr("basket_id")||0;

    callAbringWithFileUpload(
        "basket/view",
        {"id":basket_id},
        function (basket) {
            if(!basket || basket.length==0)
                return abring.display.error.show("basket is empty!");
            fillBasketView(basket);
            abring.market.basket.pages.basketView.show();
        },function (x,c,e) {
            abring.display.error.show(e);
        }
    );
});

$(document).on("click",".abring_buttons_market_basket_list",function () {

    if(!abring.player_info)
    {
        abring.player.pages.player_mobile_register.show("Your are not login!");
        return false;
    }

    getBaskets(function () {
        abring.market.basket.pages.basketList.show();
    });
});