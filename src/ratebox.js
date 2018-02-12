var rateboxTimeout;
var currentExchange;
var ratebox_ms = 3000; // 3 second update interval
var globalRate = -1; // set upon first rate received

function setGlobalRate(rate) {
    if (globalRate === -1) {
        var checkbox = $("#showDollarCheckBox");
        checkbox.prop("disabled", false);
        checkbox.parent().removeClass("disabled");
    }
    $("#rate").html(parseFloat(rate).toFixed(2));
    globalRate = rate;
}

rateboxGetRate = function() {
	$.getJSON("https://api.coinmarketcap.com/v1/ticker/trezarcoin/", function(data) {
        $.each(data[0], function(i, field){
            if(i=="price_usd"){
                setGlobalRate(field);
            }
        });
    });
};

$(document).ready(function() {
	// Bitstamp websocket API
    rateboxGetRate();
});

switchExchange = function(exchangeName) {
	clearTimeout(rateboxTimeout);
	currentExchange = exchangeName;
	$("#rate").html("---");
	
	if (exchangeName == "bitstamp") {
		$("#bitstampRate").css("color", "white");
		$("#mtgoxRate").css("color", "gray");
	} else if (exchangeName == "mtgox") {
		$("#mtgoxRate").css("color", "white");
		$("#bitstampRate").css("color", "gray");
	}
	
	rateboxGetRate();
};
