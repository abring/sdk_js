
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
    callAbringWithFileUpload(
        "basket/add",
        {"id":product_id},
        function (basket_info) {

        },function (x,c,e) {
            abring.params.display.error.show(e);
        }
    );
});
$(document).on("click",".abring_buttons_market_basket_list",function () {

    if(!abring.params.player_info)
    {
        abring.params.display.error.show("error","Your are not login!");
        return false;
    }

    callAbringWithFileUpload(
        "basket/view",
        {},
        function (basket_info) {

        },function (x,c,e) {
            abring.params.display.error.show(e);
        }
    );
});