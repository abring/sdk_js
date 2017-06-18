
var initPayment = function () {
    var html = readFile(abring_url+"/modules/market/view/payment.html");
    $("#abring").append(html);

};
var payByBank = function(basket_id)
{
    abring.display.loading.show("Process payment ...");
    basket_id = basket_id || false;
    callAbringWithFileUpload(
        "payment/index",
        {"basket_id":basket_id,extra_data:{var1:"val1",var2:"val2"}},
        function (payment_info) {
            log(">>>>>>>>>payment_info<<<<<<<<<<");
            log(payment_info);
            $(".abring_payment_pay .pay").html(payment_info["html"]);
            $(".abring_payment_pay .pay form").append("<input type='submit' value='پرداخت' />");
            $(".abring_payment_pay .pay form").attr("target","_blank");
            $(".abring_payment_pay .pay form").submit(function () {
                document.getElementById('abring_buttons_payment_form').submit();
            });
            abring.display.hidePageFunction();
            abring.display.showPageFunction('abring_payment_pay');
        },function (x,c,e) {
            abring.display.error.show(e);
        }
    );
};