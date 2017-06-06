
document.writeln("<script type='text/javascript' src='"+abring_url+"/modules/market/model/products.js'></script>");
document.writeln("<script type='text/javascript' src='"+abring_url+"/modules/market/controller/products.js'></script>");

document.writeln("<script type='text/javascript' src='"+abring_url+"/modules/market/model/payment.js'></script>");
document.writeln("<script type='text/javascript' src='"+abring_url+"/modules/market/controller/payment.js'></script>");

document.writeln("<script type='text/javascript' src='"+abring_url+"/modules/market/model/basket.js'></script>");
document.writeln("<script type='text/javascript' src='"+abring_url+"/modules/market/controller/basket.js'></script>");

document.writeln("<script type='text/javascript' src='"+abring_url+"/modules/market/model/orders.js'></script>");
document.writeln("<script type='text/javascript' src='"+abring_url+"/modules/market/controller/orders.js'></script>");


var initMarket = function () {
    initBasket();
    initPayment();
    initProducts();
    initOrders();
};