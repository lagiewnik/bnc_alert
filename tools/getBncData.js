var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');
const dirpath = "./config/"

function getallsymbols() {
    var ourRequest1 = new XMLHttpRequest();
    var url = 'https://api.binance.com/api/v3/ticker/price';
    ourRequest1.open('GET', url, true);
    ourRequest1.onload = function () {
        ourData = JSON.parse(ourRequest1.responseText);
        
        //console.log(ourData)
        //gv_symbols = gv_symbols.concat(ourData);
        var optionsAsString = '';
        //document.getElementById('currentprice').value = ourData[0]["price"];
        var filteredPair = ourData.filter(function (entry){
                return entry.symbol.includes("USDT")
        })
        let pairs = []
        const symbols = filteredPair.map(function (sp) {
            pairs.push(sp.symbol)
         })
        //console.log(filteredPair)
        console.log(pairs)

        fs.writeFileSync(dirpath + 'pair.txt', JSON.stringify(pairs));
        
    }
    ourRequest1.send();
    
}

getallsymbols()