
var initBasket = function () {
    var html = readFile(abring_url+"/modules/market/view/basket.html");
    $("body #abring").append(html);
};

var fillBasketView = function(basket){
    abring.params.market.basket.pages.basketView.getTheme();
    var parent_id = abring.params.market.basket.pages.basketView.parent_id;
    var list_row_template = $("."+parent_id+" ul li:first-child").outerHTML();
    $.each(basket["products"],function (index,product) {
        $("."+parent_id+" ul").append(list_row_template);
        $("."+parent_id+" ul li:last").attr("product_id",product["id"]);
        $("."+parent_id+" ul li:last *").attr("product_id",product["id"]);
        $("."+parent_id+" ul li:last .image").attr("src",product["image"]).addClass("abring_buttons_view_product_details");
        $("."+parent_id+" ul li:last .name").html(product["name"]).addClass("abring_buttons_view_product_details");
        $("."+parent_id+" ul li:last .fee").html(product["fee"]);
        $("."+parent_id+" ul li:last .order").html(product["order"]);
    })
};
var addToBasket = function(product_id,amount,addToBasketSuccess,addToBasketFailed){
    callAbringWithFileUpload(
        "basket/set",
        {"id":product_id,"amount":amount},
        function (basket) {
            addToBasketSuccess(basket);
        },function (x,c,e) {
            addToBasketFailed(x,c,e);
        }
    );
};