const { json } = require('body-parser');
var fs = require('fs');
const { toNamespacedPath } = require('path');
const filePath = __dirname+'../config/alerts.json';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const mailSender = require(__dirname+'/../sender/mailer')
const telegramSend = require(__dirname+'/../sender/telegram')
const Promise = require('bluebird')

const mysqlcon = require(__dirname+'/../db/mysqldao.js')

var gv_allsymprice = {};

getallsymbolsprices()

updatesymprices();

function updatesymprices() {
    getallsymbolsprices();
    //console.log(gv_allsymprice)
    setTimeout(updatesymprices, 10 * 1000);
}
genalerts();

function genalerts() {
    console.log("alerts checking")
    generatealerts();
    setTimeout(genalerts, 5 * 1000);
}

function getallsymbolsprices() {
    var ourRequestx = new XMLHttpRequest();
    ourRequestx.open('GET', 'https://api.binance.com/api/v3/ticker/price', true);
    ourRequestx.onload = function () {
        var gv_allsymprice_l = {};
        ourDatax = JSON.parse(ourRequestx.responseText);
        for (k = 0; k < ourDatax.length; k++) {
            gv_allsymprice_l[ourDatax[k]["symbol"]] = ourDatax[k]["price"];
        }
        gv_allsymprice = gv_allsymprice_l;
    }
    ourRequestx.send();
}

function generatealerts() {
    //const alerts_repo = new AlertsRepo(dao)
    alertCfgChange = 0
    // try {
    //     dataAlerts = JSON.parse(fs.readFileSync(filePath));
    // } catch (err) {
    //     console.log(err)
    //     // handle your file not found (or other error) here
    // }
    try {
        mysqlcon.getAll().then(dbd=>{dataAlerts=dbd;

            dataAlerts.forEach(function (json) {
                var symbol1 = json.symbol.replace(/\s+/g, "");
                var symbol = json.symbol.replace(/\s+/g, "");
                //var symbol = symbol1.substr(1,symbol1.length);//remove leading spaces
                var alerton = json.alertOn.trim();
                var currencytype = json.currency.trim();
                var alertoptions = json.conditional.trim();
                var price1 = parseFloat(json.price1);
                var price2 = parseFloat(json.price2);
                var trid = json.trid
                var gotSend = json.gotSend
                console.log(symbol + " " + symbol1 + " " + alerton + " " + currencytype + " " + alertoptions + " " + price1 + " " + price2 + " gotSend: " + gotSend)
        
                var fp1, fp2, fp;
                if (currencytype == 'USDT') {
                    if (symbol.substr(symbol.length - 4, symbol.length) == 'USDT') {
                        fp1 = gv_allsymprice[symbol];
                        fp2 = 1;
                    }
                    else {
                        fp1 = gv_allsymprice[symbol];
                        fp2 = gv_allsymprice[symbol.substr(symbol.length - 3, symbol.length) + 'USDT'];
                    }
                }
                else {
                    if (symbol.substr(symbol.length - 4, symbol.length) == 'USDT') {
                        fp1 = gv_allsymprice[symbol];
                        fp2 = 1;
                    }
                    else {
                        fp1 = 1;
                        fp2 = gv_allsymprice[symbol.substr(symbol.length - 3, symbol.length) + 'USDT'];
                    }
                }
        
                fp = fp1 * fp2;
                console.log("fp: "+ fp + " FP1: " + fp1+ " fP2: " + fp2)
        
                if (!price2) {
                    if (alertoptions == 'Greater Than') {
                        console.log("FP: " + fp + "Price1: " + price1)
                        if (fp >= price1) {
                            if(gotSend==0){
                            alarmSend(symbol, price1, price2, fp, alertoptions,trid)
                            }
                           // alert('Price of ' + symbol + ' is greater than ' + price1 + '. Price is: ' + fp);
                        }
                        else{
                            if (gotSend != 0){
                                console.log("zmien wasSend =0 dla: " + symbol)
                                setGotSend(trid, 0)}
                        }
                    }
                    else {
                        if (fp <= price1) {
                            if(gotSend==0)
                            {
                                alarmSend(symbol, price1, price2, fp, alertoptions,trid)
                            }
                            //alert('Price of ' + symbol + ' is less than ' + price1);
                        }
                        else {
                            if (gotSend != 0){
                                console.log("zmien wasSend =0 dla: " + symbol)
                                setGotSend(trid, 0)}
                        }
                    }
        
                }
                else {
                    if (alertoptions == 'Inside Channel') {
                        if (fp >= price1 && fp <= price2) {
                            if(gotSend==0){
                            alarmSend(symbol, price1, price2, fp, alertoptions,trid)
                            }
                            //alert('Price of ' + symbol + ' is Inside channel ' + price1 + ' & ' + price2);
                        }
                        else {
                            if (gotSend != 0){
                                console.log("zmien wasSend =0 dla: " + symbol)
                                setGotSend(trid, 0)}
                        }
                    }
                    else {
                        if (fp <= price1 || fp >= price2) {
                            if(gotSend==0){
                                alarmSend(symbol, price1, price2, fp, alertoptions,trid)
                            }
                            //alert('Price of ' + symbol + ' is Outside channel ' + price1 + ' & ' + price2);
                        }
                        else {
                            if (gotSend != 0){
                                console.log("zmien wasSend =0 dla: " + symbol)
                                setGotSend(trid, 0)}
                        }
                    }
        
                }
        
            });
            //resp.render("AlertGenerator", {alerts: datadb})
            //console.log("Po promisie")
            //console.log(datadb)
        });
    } catch (err) {
        console.log(err)
        // handle your file not found (or other error) here
    }
    
    console.log('koniec petrli')
    // console.log(dataAlerts)
    console.log("Czey zmiana parametrów wysłania: " + alertCfgChange)
    if(alertCfgChange == 1) {
        console.log("zapis pliku configu po zmianie")
        console.log(dataAlerts)
        //fs.writeFileSync(filePath, JSON.stringify(dataAlerts), null, 2)
        alertCfgChange = 0
    }
}

function alarmSend (symbol, price1, price2, currentPrice, conditional, trid) {
    
    const sendParams = {
        'symbol': symbol, 
        'price1':price1, 
        'price2': price2,
        'currentPrice': currentPrice, 
        'conditional': conditional,
        'trid' : trid
    }
    console.log("The currency: " + symbol + "break price" + price1 + " Current price is: " + currentPrice + " conditional: " + conditional )
    mailSender.sendEmail(sendParams)
    telegramSend.sendTelegramMsg(sendParams)
    setGotSend(trid, 1)
    //console.log(dataAlerts)
}

function setGotSend(trid, newGotSend) {
    //const alerts_repo = new AlertsRepo(dao)
    try {
        mysqlcon.update({trid, newGotSend }).then(
            console.log("zmiana parametru gotSend na: "+ newGotSend + " dla: " + trid )
        )
    } catch (err) {
        console.log(err)
        // handle your file not found (or other error) here
    }

    for (var i = 0; i < dataAlerts.length; i++) {
      if (dataAlerts[i].trid === trid) {
        dataAlerts[i].gotSend = newGotSend;
        alertCfgChange =1
        return;
      }
    }
  }


