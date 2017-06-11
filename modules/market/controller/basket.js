
/**
 * basket event lister
 */
$(document).on("click",".abring_button_market_add_to_basket",function () {

    if(!abring.params.player_info)
    {
        abring.params.display.error.show("error","Your are not login!");
        return false;
    }

    var product_id = $(this).attr("product_id");
    var amount = $(this).parent().find("input.order").val() || 1;

    addToBasket(
        product_id,
        amount,
        function (basket) {
            fillBasketView(basket);
            abring.params.market.basket.pages.basketView.show();
        },function (x,c,e) {
            abring.params.display.error.show(e);
        }
    );
});
$(document).on("click",".abring_buttons_market_basket_view",function () {

    if(!abring.params.player_info)
    {
        abring.params.display.error.show("error","Your are not login!");
        return false;
    }

    callAbringWithFileUpload(
        "basket/index",
        {},
        function (basket) {
            fillBasketView(basket);
            abring.params.market.basket.pages.basketView.show();
        },function (x,c,e) {
            abring.params.display.error.show(e);
        }
    );
});