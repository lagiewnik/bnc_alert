var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var gv_allsymprice = {};

  function getallsymbolsprices(){
    var ourRequestx = new XMLHttpRequest();
    ourRequestx.open('GET','https://api.binance.com/api/v3/ticker/price',true);
    ourRequestx.onload = function (){
        var gv_allsymprice_l = {};
        ourDatax = JSON.parse(ourRequestx.responseText);
        for(k=0;k<ourDatax.length;k++){
            gv_allsymprice_l[ourDatax[k]["symbol"]] = ourDatax[k]["price"];
        }
        gv_allsymprice = gv_allsymprice_l;
        //console.log(gv_allsymprice)
    }
    ourRequestx.send();
}


function getallsymbols(){
    var ourRequest1 = new XMLHttpRequest();
    var url = 'https://api.binance.com/api/v3/ticker/price';
    ourRequest1.open('GET',url,true);
    ourRequest1.onload = function (){  
        ourData = JSON.parse(ourRequest1.responseText);
        //gv_symbols = gv_symbols.concat(ourData);
        var optionsAsString = '';
        //document.getElementById('currentprice').value = ourData[0]["price"];
        for (i=0;i<ourData.length;i++){
            optionsAsString += "<option value='" + ourData[i]["symbol"] + "'>" + ourData[i]["symbol"] + "</option>";
        }    
        //$('select[name="currency"]' ).append( optionsAsString );
        //console.log(optionsAsString)
    }
    ourRequest1.send();
}


getallsymbols()