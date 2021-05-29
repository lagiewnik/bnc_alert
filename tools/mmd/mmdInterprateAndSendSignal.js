const { text } = require("express");

function scoreSignal(analizeResult) {
    return new Promise(function(resolve, reject){
        let BuyScore = 0;
        let SellScore = 0
        let textMsg = "Price: " + parseFloat(analizeResult[0].currentPrice.toString()) + "\n";
        let textSub = analizeResult[0].symbol + ". ";
        let mmds = analizeResult[0].mmd_signals
        // sygnał Fast cross Short MMD
        switch (mmds.FastVsShortMMD) {
            case 3: 
                {textMsg = textMsg + "BUY signal: Fast cross Short MMD \n" 
                BuyScore+=3  
                }
                break
            case -3:
                {textMsg = textMsg + "SELL signal: Fast cross Short MMD \n"
                SellScore+=3 
                }
                break
            default:{
                    if (mmds.FastVsShortMMD>0) {
                        BuyScore+= mmds.FastVsShortMMD
                    }
                    else {
                        SellScore-= mmds.FastVsShortMMD
                    }
                   console.log("def:  " + mmds.FastVsShortMMD) 
            }
        }
        // FastVsMiddleMMD - Fast cross Middle MMD
        switch (mmds.FastVsMiddleMMD) {
            case 3: 
                {textMsg = textMsg + "BUY signal: Fast cross Middle MMD \n" 
                    BuyScore+=3  
                }
                break
            case -3:
                {textMsg = textMsg + "SELL signal: Fast cross Middle MMD \n"
                    SellScore+=3 
                }
                break
            default:{
                    if (mmds.FastVsMiddleMMD>0) {
                        BuyScore+= mmds.FastVsMiddleMMD
                    }
                    else {
                        SellScore-= mmds.FastVsMiddleMMD
                    }
                   console.log("def:  " + mmds.FastVsMiddleMMD) 
            }
        }
        //ShortVsMiddleMMD - sygnał przecięcie ceny przez chikou
        switch (mmds.ShortVsMiddleMMD) {
            case 3: 
                {textMsg = textMsg + "BUY signal: Short cross Middle MMD \n" 
                    BuyScore+=3  
                }
                break
            case -3:
                {textMsg = textMsg + "SELL signal: Short cross Middle MMD \n"
                    SellScore+=3 
                }
                break
            default:{
                    if (mmds.ShortVsMiddleMMD>0) {
                        BuyScore+= mmds.ShortVsMiddleMMD
                    }
                    else {
                        SellScore-= mmds.ShortVsMiddleMMD
                    }
                   console.log("def:  " + mmds.ShortVsMiddleMMD) 
            }
        }
        
        console.log(BuyScore)
        textSub = textSub + " "+ BuyScore+" : "+ SellScore + ".      " +analizeResult[0].interval +"\n"
        textMsg =   textSub + textMsg
        resolve({"buyScore": BuyScore, "sellScore":SellScore,"textMsg": textMsg})
        
    })
}



// analizeRecord =  [
//     {
//       symbol: 'USDTNGN',
//       interval: '1d',
//       startTime: 1617235200000,
//       stopTime: 1617321599999,
//       Signals: {
//         CrossTenkanKijun: -10,
//         crossVSKumo: -10,
//         CrossPriceKijun: -10,
//         crossPriceChikou: -10,
//         kumoColor: -5,
//         priceVsKumo: -10,
//         Signal3Line: -10,
//         ChikouSpanVsPrice: -9
//       }
//     }
//   ]

//scoreSignal(analizeRecord).then(x=>console.log(x))
module.exports = {
    scoreSignal
}