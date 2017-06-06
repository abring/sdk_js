
var initOrders = function () {
    var html = readFile(abring_url+"/modules/market/view/orders.html");
    $("body #abring").append(html);
};