
/**
 * products event lister
 */
$(document).on("click",".abring_buttons_view_products_list",function () {
    abring.params.display.loading.show("Get products list");
    callAbringWithFileUpload(
        "products/list",
        {"limit":10,"offset":0,"tags":"*"},
        function (products) {
            abring.params.market.products.pages.productList.show(products);
        },function (x,c,e) {
            abring.params.display.error.show(e);
        }
    );
});
$(document).on("click",".abring_buttons_view_product_details",function () {

});