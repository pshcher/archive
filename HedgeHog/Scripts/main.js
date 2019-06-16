var oneDay = 1 / 365;

var viewModel = {
    stock : ko.observable("QQQ"),
    volatility : ko.observable("12"),
    positions  : ko.observable("21"),
    coverage  : ko.observable("4000"),
    stockPrice : ko.observable("0"),
    pollingOn: ko.observable(false)
}

var _volatility;
var interest = 0.01;
var floor = 170;
var pollingInterval = 5000;
var avgCurrentHedgeStrike = 0;
var avgNextHedgeStrike = 0;
var term;
var hedges = ['ch1_', 'ch2_', 'ch3_', 'ch4_'];
var newHedges = ['nh1_', 'nh2_', 'nh3_', 'nh4_'];
var persistedData = {
    curPrice: 0,
    positions: [],
    nWPositions: []
};
var bestConfig = {
    lowerStrike: 0,
    lsPositions: 0,
    upperStrike: 0
};
//TODO
var callCache = {
    thisWeek: new Map(),
    nextWeek: new Map()
};

var quoteAPI = 
//"https://api.iextrading.com/1.0/stock/qqq/price";
// "https://query2.finance.yahoo.com/v10/finance/quoteSummary/QQQ?formatted=true&crumb=0&lang=en-CA&region=CA&modules=price%2CsummaryDetail&corsDomain=ca.finance.yahoo.com";
 "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=QQQ&apikey=yourkeygoeshere";


var quotePollingHandler;

$(function () {
    var strike;
    _volatility = viewModel.volatility() / 100;
   
    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    };

    viewModel.stockPrice.subscribe(function (value) {
        updateStockPrice(value);
        document.title = value;
     });

    viewModel.volatility.subscribe(function (value) {
        _volatility = value / 100;
        callCache.thisWeek.clear();
        callCache.nextWeek.clear();
    });

    $('#getquote').on("click", function () {
        stock = $('#stock').val();
        strike = $('#strike').val();

        $('#thisweek').text(getCall(strike, true));
        $('#nextweek').text(getCall(strike, false));
    })

    $('#gethedgetotal').on("click", function () {
        $('#totalhedge').val(getCurrentHedgeValue());
    });

    $('#getnewhedge').on("click", function () {
       //getNextWeekHedge();
       get2tierHedgeMaxTimeValue();
    });
    $('#getnewmanualhedge').on("click", function () {
        getNextWeekManualHedge();
    });

    $('#getnew2tierhedge').on("click", function () {
        get2tierHedge();
    });

    $('#clearNextWeekTable').on("click", function () {
        clearNextWeekTable();
    });
    $('#copyToNextWeek').on("click", function () {
        copyToNextWeek();
    });

    viewModel.pollingOn.subscribe(function (value) {
        if (value) {
            quotePollingHandler = setInterval(function () {
                downloadCurrentQuote();
            }, pollingInterval);
        }
        else
            clearInterval(quotePollingHandler);
    });

    ko.applyBindings(viewModel);

    setDates();
    downloadCurrentQuote(true);
})

function updateStockPrice( value ){
    viewModel.stockPrice(value);
    callCache.thisWeek.clear();
    callCache.nextWeek.clear();

    console.log(value);
}

function setDates() {
    var d = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $('#greetDate').text(d.toLocaleDateString("en-US", options));

    d.setDate(d.getDate() + (5 + 7 - d.getDay()) % 7);
    
    
    var d2 = d.addDays(7);
    options = { month: 'long', day: 'numeric' };
    $('#curWeekStart').text(d.toLocaleDateString("en-US", options));
    $('#nextWeekStart').text(d2.toLocaleDateString("en-US", options));
}

function getCall(strike, thisWeek) {
    var callPrice = 0;
    var _term = oneDay * parseFloat(getBusDaysLeftThisWeek());
    if (parseFloat(_term) != parseFloat(term)){
        callCache.thisWeek.clear();
        callCache.nextWeek.clear();
        term = _term;
    }

    if (!thisWeek) {
        term = oneDay * (parseFloat(getBusDaysLeftThisWeek()) + parseFloat(5));
        callPrice = callCache.nextWeek.get(strike);
        if (callPrice === undefined) {
            callPrice = BS.call(new BSHolder(viewModel.stockPrice(), strike, interest, _volatility, term));
            callCache.nextWeek.set(strike, callPrice);
        }
    }
    else {
        callPrice = callCache.thisWeek.get(strike);
        if (callPrice === undefined) {
            callPrice = BS.call(new BSHolder(viewModel.stockPrice(), strike, interest, _volatility, term));
            callCache.thisWeek.set(strike, callPrice);
        }
    }

    return callPrice;
}

function getCurrentHedgeValue() {
    // Capture all inputs and save them in a cookie
    persistedData.curPrice = viewModel.stockPrice();
    persistedData.volatility = _volatility;
    persistedData.positions = [];

    var total = 0;
    var runningHedgeTotal = 0;
    var runningHedgePositions = 0;

    hedges.forEach(function (v) {
        var quantity = $('#' + v + 'quantity').val();
        if (quantity) {
            var strike = $('#' + v + 'strike').val();
            var price = getCall(strike, true);
            $('#' + v + 'price').val(price);
            var subtotal = quantity * price * 100;
            $('#' + v + 'subtotal').val(subtotal.toFixed(2));

            total += subtotal;

            runningHedgeTotal += strike * quantity;
            runningHedgePositions += +quantity;

            persistedData.positions.push({ strike: strike, qty: quantity });
        }
    });

    setCookie(persistedData);

    avgCurrentHedgeStrike = (runningHedgeTotal / runningHedgePositions).toFixed(2);
    $('#curavgstrike').text("$ " + avgCurrentHedgeStrike);
    $('#curhedgetotals').text("$ " + total.toFixed(2));

    return total;
}

function copyToNextWeek() {
    getCurrentHedgeValue();
    clearNextWeekTable();

    var total = 0;
    var runningHedgeTotal = 0;
    var runningHedgePositions = 0;

    var nIndex = 0;
    hedges.forEach(function (v) {
        var quantity = $('#' + v + 'quantity').val();
        if (quantity) {
            var strike = $('#' + v + 'strike').val();
            var price = getCall(strike, false);
            var subtotal = quantity * price * 100;

            $('#' + newHedges[nIndex] + 'quantity').val(quantity);
            $('#' + newHedges[nIndex] + 'strike').val(strike);
            $('#' + newHedges[nIndex] + 'price').val(price);
            $('#' + newHedges[nIndex] + 'subtotal').val(subtotal.toFixed(2));

            nIndex++;

            total += subtotal;
            runningHedgeTotal += strike * quantity;
            runningHedgePositions += +quantity;
        }
    });

    avgNextHedgeStrike = (runningHedgeTotal / runningHedgePositions).toFixed(2);
    $('#newavgstrike').text("$ " + avgNextHedgeStrike);
    $('#newhedgetotals').text("$ " + total.toFixed(2));
}

function getNextWeekHedge() {
    var bestTotal = 0;
    var bestConfiguration = {};
    var curHedgeTotal = getCurrentHedgeValue();

    clearNextWeekTable();

    for (var strike = Math.round(viewModel.stockPrice()) + 4; strike > floor; strike -= 0.5) {
        var opPrice = getCall(strike, false);
        var total = (viewModel.positions() * opPrice * 100).toFixed(2);

        var profFloor = parseFloat('0.5') + parseFloat(avgCurrentHedgeStrike);
        if (parseFloat(strike) < parseFloat(profFloor)) {
            $('#nh1_strike').val(strike);
            $('#nh1_quantity').val(viewModel.positions());
            $('#nh1_price').val(opPrice);
            $('#nh1_subtotal').val(total);

            $('#newhedgetotals').text("$ " + total);
            break;
        }
        else if (parseFloat(total) > parseFloat(curHedgeTotal)) {
            //todo ??
            bestTotal = total;

            bestConfiguration.strike = strike;
            bestConfiguration.opPrice = opPrice;
        }
    }
}

function getNextWeekManualHedge() {
    // Capture all inputs and save them in a cookie
    persistedData.curPrice = viewModel.stockPrice();
    persistedData.volatility = _volatility;
    persistedData.nWPositions = [];

    var total = 0;
    var runningHedgeTotal = 0;
    var runningHedgePositions = 0;

    newHedges.forEach(function (v) {
        var quantity = $('#' + v + 'quantity').val();
        if (quantity) {
            var strike = $('#' + v + 'strike').val();
            var price = getCall(strike, false);
            $('#' + v + 'price').val(price);
            var subtotal = quantity * price * 100;
            $('#' + v + 'subtotal').val(subtotal.toFixed(2));

            total += subtotal;

            runningHedgeTotal += strike * quantity;
            runningHedgePositions += +quantity;

            persistedData.nWPositions.push({ strike: strike, qty: quantity });
        }
    });

    setCookie(persistedData);

    avgNextHedgeStrike = (runningHedgeTotal / runningHedgePositions).toFixed(2);
    $('#newavgstrike').text("$ " + avgNextHedgeStrike);
    $('#newhedgetotals').text("$ " + total.toFixed(2));

    return total;
}

function get2tierHedge() {
    var end = Math.ceil(viewModel.stockPrice()) + 3.00;
    var total = 0;
    var avg = 0;
    for (l = floor; l < end; l = parseFloat(l) + parseFloat(0.5)) {
        for (u = end; u > l; u = parseFloat(u) - parseFloat(0.5)) {
            for (i = 1; i < viewModel.positions(); i++) {
                var temp1 = getCall(l, false) * i;
                var temp2 = getCall(u, false) * (21 - i);

                var _total = (temp1 + temp2) * 100;
                var _avg = (l * i + parseFloat(u) * (21 - i)) / 21;

                if (parseFloat(_total) > parseFloat(total) &&
                    parseFloat(_avg) >= parseFloat(avgCurrentHedgeStrike)) {
                    total = _total;
                    avg = _avg;

                    saveConfig(l, i, u, avg, total);
                }
            }
        }
    }

    // Show results
    showResults();
}

function get2tierHedgeMaxTimeValue() {
    var end = Math.ceil(viewModel.stockPrice()) + 3.00;
    var total = 0;
    var avg = 0;
    var maxTimeValue = 0;
       for (l = floor; l < end; l = parseFloat(l) + parseFloat(0.5)) {
        for (u = end; u > l; u = parseFloat(u) - parseFloat(0.5)) {
            for (i = 1; i < viewModel.positions(); i++) {
                var lCall = getCall(l, false);
                var uCall = getCall(u, false);

                var timeValueInLower = 0;
                var timeValueInUpper = 0;
                if ( parseFloat(l) > parseFloat(viewModel.stockPrice()) )
                    timeValueInLower = lCall;
                else
                    timeValueInLower = (parseFloat(l) + parseFloat(lCall) - parseFloat(viewModel.stockPrice())) ;
                if ( parseFloat(u) > parseFloat(viewModel.stockPrice()) )
                    timeValueInUpper = uCall;
                else
                    timeValueInLower = (parseFloat(u) + parseFloat(uCall) - parseFloat(viewModel.stockPrice())) ;

                var _timeValue = parseFloat(timeValueInLower) * i + parseFloat(timeValueInUpper) * (21 - i) * 100;

                var _total = (lCall * i + uCall * (21 - i)) * 100;
                var _avg = (l * i + parseFloat(u) * (21 - i)) / 21;

                if (parseFloat(_total) > parseFloat(total) &&
                   parseFloat(_timeValue) >= parseFloat(maxTimeValue) &&
                   parseFloat(_avg) >= parseFloat(avgCurrentHedgeStrike)) 
                {
                    total = _total;
                    avg = _avg;
                    maxTimeValue = _timeValue;

                    saveConfig(l, i, u, avg, total);
                }
            }
        }
    }
   // Show results
   showResults();    
   $('#positiontimevalue').text('$' + maxTimeValue.toFixed(2));

}

function showResults() {
    clearNextWeekTable();

    var price = getCall(bestConfig.lowerStrike, false);
    $('#nh1_quantity').val(bestConfig.lsPositions);
    $('#nh1_strike').val(bestConfig.lowerStrike);
    $('#nh1_price').val(price);
    $('#nh1_subtotal').val((price * bestConfig.lsPositions * 100).toFixed(2));

    price = getCall(bestConfig.upperStrike, false);
    $('#nh2_quantity').val(viewModel.positions() - bestConfig.lsPositions);
    $('#nh2_strike').val(bestConfig.upperStrike);
    $('#nh2_price').val(price);
    $('#nh2_subtotal').val((price * (viewModel.positions() - bestConfig.lsPositions) * 100).toFixed(2));

    $('#newavgstrike').text('$' + bestConfig.average.toFixed(2));
    $('#newhedgetotals').text('$' + bestConfig.total.toFixed(2));
}


function downloadCurrentQuote( firstTime) {
    $.ajax({
        url: quoteAPI,
        crossDomain: true,
        type: 'GET',
        contentType: 'text/plain',
        xhrFields: {
            // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
            // This can be used to set the 'withCredentials' property.
            // Set the value to 'true' if you'd like to pass cookies to the server.
            // If this is enabled, your server must respond with the header
            // 'Access-Control-Allow-Credentials: true'.
            withCredentials: false
        }
    })
    .done(function (data) {
        // var q = data;
        var q= data['Global Quote']['05. price'];

        var clr;
        if (parseFloat(q) >= parseFloat(viewModel.stockPrice())){
            clr = 'lightgreen';
            $("#favicon").attr("href","./Content/up.png");
        }
        else{
            clr = 'red';
            $("#favicon").attr("href","./Content/down.png");
        }
        $('#currprice').val(q).css('background-color', clr);
        updateStockPrice(q); // todo: this should have happened in change handler ???
        if (firstTime)
        {
            popFromCookie(getCookie());
        }
        $('#gethedgetotal').trigger("click");  
    })
    .fail(function () {
        toastr.options.timeOut = 50;
        toastr.error( "Error accessing the service","Bro");
     });
}


/////////////////////////////
function popFromCookie(pData) {
    if (pData) {

        var hedgeIndex = 0;

        pData.positions.forEach(function (v) {
            if (v.qty) {
                $('#' + hedges[hedgeIndex] + 'quantity').val(v.qty)
                $('#' + hedges[hedgeIndex++] + 'strike').val(v.strike);
            }
        });

        hedgeIndex = 0;
        pData.nWPositions.forEach(function (v) {
            if (v.qty) {
                $('#' + newHedges[hedgeIndex] + 'quantity').val(v.qty)
                $('#' + newHedges[hedgeIndex++] + 'strike').val(v.strike);
            }
        });
 
        if ( pData.volatility )
            viewModel.volatility((pData.volatility * 100).toFixed(2));
    }
}

function getBusDaysLeftThisWeek() {
    var date = new Date();
    var dow = date.getDay(); // Sunday - Saturday : 0 - 6
    var busDaysLeftThisWeek = 5 - (dow < 6 ? dow : 0);

    if (dow > 0 && dow < 6) { // mon - fri
        var part = 1;
        var hrs = date.getHours();
        if (hrs >= 16)
            part = 0;
        else if (hrs >= 13)
            part = 0.33;
        else if (hrs >= 10)
            part = 0.66;

        busDaysLeftThisWeek = parseFloat(busDaysLeftThisWeek) + parseFloat(part);
    }

    return busDaysLeftThisWeek;
}

function saveConfig(lowerStrike, lsQty, upperStrike, average, total) {
    bestConfig.lowerStrike = lowerStrike;
    bestConfig.lsPositions = lsQty;
    bestConfig.upperStrike = upperStrike;
    bestConfig.upPositions = 21 - lsQty;
    bestConfig.average = average;
    bestConfig.total = total;
}

function clearNextWeekTable() {
    newHedges.forEach(function (v) {
        $('#' + v + 'quantity').val('');
        $('#' + v + 'strike').val('');
        $('#' + v + 'price').val('');
        $('#' + v + 'subtotal').val('');
    });

    //avgCurrentHedgeStrike = (runningHedgeTotal / runningHedgePositions).toFixed(2);
    $('#newavgstrike').text('');
    $('#newhedgetotals').text('');
}

function setCookie(pData) {
    Cookies.remove('ARO');
    Cookies.set('ARO', pData, { expires: 7, path: '' });
}

function getCookie() {
    return Cookies.getJSON('ARO');;
}
