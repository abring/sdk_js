
var initBasket = function () {
    var html = readFile(abring_url+"/modules/market/view/basket.html");
    $("body #abring").append(html);
};

var fillBasketView = function(basket,parent_id){
    abring.params.market.basket.pages.basketView.getTheme();
    if(!parent_id)
        parent_id = abring.params.market.basket.pages.basketView.parent_id;
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

var getBaskets = function(getBasketsSuccess)
{
    getBasketsSuccess = getBasketsSuccess || function () {};

    callAbringWithFileUpload(
        "basket/list",
        {},
        function (baskets) {
            if(!baskets || baskets.length==0)
                return abring.params.display.error.show("there is not any basket!");
            fillBasketList(baskets);
            getBasketsSuccess();
        },function (x,c,e) {
            abring.params.display.error.show(e);
        }
    );
};
var fillBasketList = function(baskets){
    abring.params.market.basket.pages.basketList.getTheme();
    var parent_id = abring.params.market.basket.pages.basketList.parent_id;
    var list_row_template = $("."+parent_id+" ul li:first-child").outerHTML();
    $.each(baskets,function (index,basket) {
        $("."+parent_id+" ul").append(list_row_template);
        $("."+parent_id+" ul li:last .create_time").html(basket["create_time"]);
        $("."+parent_id+" ul li:last .fee").html(basket["fee"]);
        $("."+parent_id+" ul li:last .status").html(basket["status"]);
        if(basket["status"]!="payed")
            $("."+parent_id+" ul li:last").append('<button class="abring_buttons_market_pay">pay this basket</button>');
        $("."+parent_id+" ul li:last *").attr("basket_id",basket["id"]);
    })
};