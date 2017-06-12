
var initPayment = function () {
    var html = readFile(abring_url+"/modules/market/view/payment.html");
    $("body #abring").append(html);
};

var getPayments = function()
{
    abring.params.display.loading.show("get payment list ...");
    callAbringWithFileUpload(
        "payment/list",
        {},
        function (payment_list) {
            log(">>>>>>>>>payment_list<<<<<<<<<<");
            log(payment_list);
            abring.params.display.hidePageFunction();
        },function (x,c,e) {
            abring.params.display.error.show(e);
        }
    );
};

var payByBank = function(payment_id)
{
    abring.params.display.loading.show("Process payment ...");
    payment_id = payment_id || false;
    callAbringWithFileUpload(
        "payment/index",
        {"payment_id":payment_id},
        function (payment_info) {
            log(">>>>>>>>>payment_info<<<<<<<<<<");
            log(payment_info);
            abring.params.display.hidePageFunction();
        },function (x,c,e) {
            abring.params.display.error.show(e);
        }
    );
};