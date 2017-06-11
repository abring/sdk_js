
var initProducts = function () {
    var html = readFile(abring_url+"/modules/market/view/products.html");
    $("body #abring").append(html);
};

var fillProductsList = function(productsList){
    abring.params.market.products.pages.productList.getTheme();
    var parent_id = abring.params.market.products.pages.productList.parent_id;
    var list_row_template = $("."+parent_id+" ul li:first-child").outerHTML();
    $.each(productsList,function (index,product) {
        $("."+parent_id+" ul").append(list_row_template);
        $("."+parent_id+" ul li:last").attr("product_id",product["id"]);
        $("."+parent_id+" ul li:last *").attr("product_id",product["id"]);
        $("."+parent_id+" ul li:last .image").attr("src",product["image"]).addClass("abring_buttons_view_product_details");
        $("."+parent_id+" ul li:last .name").html(product["name"]).addClass("abring_buttons_view_product_details");
        $("."+parent_id+" ul li:last .fee").html(product["fee"]);
        $("."+parent_id+" ul li:last .short_description").html(product["data"]["short_description"]);
        if(product["amount"]>0)
            $("."+parent_id+" ul li:last .amount").html("Available");
        else
            $("."+parent_id+" ul li:last .amount").html("Not available");
    })
};
var showProductsList = function(productsList){
    fillProductsList(productsList);
    var parent_id = abring.params.market.products.pages.productList.parent_id;
    abring.params.display.showPageFunction(parent_id);
};

var fillProductsView = function(product){
    abring.params.market.products.pages.productView.getTheme();
    var parent_id = abring.params.market.products.pages.productView.parent_id;

    $("."+parent_id+" *").attr("product_id",product["id"]);
    $("."+parent_id+" .image").attr("src",product["image"]);
    $("."+parent_id+" .name").html(product["name"]);
    $("."+parent_id+" .data").html(product["data"]);
    $("."+parent_id+" .fee").html(product["fee"]);
    if(product["amount"]>0)
        $("."+parent_id+" .amount").html("Available");
    else
        $("."+parent_id+" .amount").html("Not available");
};
var showProductsView = function(product){
    fillProductsView(product);
    var parent_id = abring.params.market.products.pages.productView.parent_id;
    abring.params.display.showPageFunction(parent_id);
};