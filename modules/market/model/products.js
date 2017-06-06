
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
        $("."+parent_id+" ul li:last *").attr("product_id",product["id"]);
        $("."+parent_id+" ul li:last .image").attr("src",product["image"]);
        $("."+parent_id+" ul li:last .name").html(product["name"]);
        $("."+parent_id+" ul li:last .fee").html(product["fee"]);
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