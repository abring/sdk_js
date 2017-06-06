
var initPayment = function () {
    var html = readFile(abring_url+"/modules/market/view/payment.html");
    $("body #abring").append(html);
};