
/**
 * products event lister
 */
$(document).on("click",".abring_buttons_market_products_list",function () {
    abring.display.loading.show("Get products list");
    callAbringWithFileUpload(
        "products/list",
        {"limit":10,"offset":0,"tags":"*"},
        function (products) {
            $.each(products,function (index,product) {
                products[index]["data"] = JSON.parse(product["data"]);
            });
            abring.market.products.pages.productList.show(products);
        },function (x,c,e) {
            abring.display.error.show(e);
        }
    );
});

$(document).on("click",".abring_buttons_view_product_details",function () {
    abring.display.loading.show("Get products details");
    callAbringWithFileUpload(
        "products/view",
        {"id":$(this).attr("product_id")},
        function (products) {
            products.data = JSON.parse(products.data); 
            abring.market.products.pages.productView.show(products);
        },function (x,c,e) {
            abring.display.error.show(e);
        }
    );
});