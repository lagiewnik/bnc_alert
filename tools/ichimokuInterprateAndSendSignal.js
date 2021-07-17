const { text } = require("express");

function scoreSignal(analizeResult) {
    return new Promise(function(resolve, reject){
        let BuyScore = 0;
        let SellScore = 0
        let textMsg = "Price: " + parseFloat(analizeResult[0].currentPrice.toString()) + "\n";
        let textSub = analizeResult[0].symbol + ". ";
        let stochRSI = analizeResult[0].stochRSI
        let stochMsg = "d: " + (stochRSI[0].d).toFixed(2) + "\t" + (stochRSI[1].d).toFixed(2) + "\n" + "k: " +(stochRSI[0].k).toFixed(2) + "\t" + (stochRSI[1].k).toFixed(2)
        
        // sygnał CrossTenkanKijun - przcięcie i położenie przecięcia
        switch (analizeResult[0].Signals.CrossTenkanKijun) {
            case 10: 
                {textMsg = textMsg + "BUY signal: tenkan cross kijun \n" 
                BuyScore+=1  
                if (analizeResult[0].Signals.crossVSKumo > 5){
                    textMsg = textMsg + "silne potwierdzenie - przecięcie nad kumo \n"
                    BuyScore+=1
                }
                else if (analizeResult[0].Signals.crossVSKumo < 0) {
                    textMsg = textMsg + "słabe potwierdzenie - przecięcie pod kumo \n" 
                }
                else {
                    textMsg = textMsg + "neutralne potwierdzenie - przecięcie w kumo \n"  
                }}
                break
            case -10:
                {textMsg = textMsg + "SELL signal: tenkan cross kijun \n"
                SellScore+=1 
                if (analizeResult[0].Signals.crossVSKumo > 5){
                    textMsg = textMsg + "słabe potwierdzenie - przecięcie nad kumo \n"
                }
                else if (analizeResult[0].Signals.crossVSKumo < 0) {
                    textMsg = textMsg + "silne potwierdzenie - przecięcie pod kumo \n"
                    SellScore+=1 
                }
                else {
                    textMsg = textMsg + "neutralne potwierdzenie - przecięcie w kumo \n"  
                }}
                break
            default:
                   console.log("def:  " + analizeResult[0].Signals.CrossTenkanKijun) 
        }
        // CrossPriceKijun - sygnał przecięcie kijun przez cenę
        switch (analizeResult[0].Signals.CrossPriceKijun) {
            case 10: 
               {textMsg = textMsg + "BUY signal: Price cross kijun \n" 
                BuyScore+=1} 
                break 
            case -10:
                {textMsg = textMsg + "SELL signal: Price cross kijun \n"
                SellScore+=1}
                break
            default:        
        }
        //crossPriceChikou - sygnał przecięcie ceny przez chikou
        switch (analizeResult[0].Signals.crossPriceChikou) {
            case 10: 
                {textMsg = textMsg + "BUY signal: Chikou cross Price \n" 
                BuyScore+=1 }
                break 
            case -10:
                {textMsg = textMsg + "SELL signal: Chikou cross Price \n"
                SellScore+=1 }
                break
            default:        
        }
        //kumoColor - sygnał zmiany koloru
        switch (analizeResult[0].Signals.kumoColor) {
            case 10: 
                {textMsg = textMsg + "BUY signal: Zmiana kumo we wzrostową \n" 
                BuyScore+=1  }
                break
            case -10:
                {textMsg = textMsg + "SELL signal: Zmiana kumo we zniżkową \n"
                SellScore+=1}
                break
            default:        
        }

        //priceVsKumo - sygnał - przejście ceny przez chmury
        switch (analizeResult[0].Signals.priceVsKumo) {
            case 10: 
                {textMsg = textMsg + "BUY signal:  cena wyszła powyżej kumo z kumo \n" 
                BuyScore+=1 }
                break
            case 11:
                {textMsg = textMsg + "BUY signal: cena weszła w górę w kumo \n"
                BuyScore+=1} 
                break
            case 15:
                {textMsg = textMsg + "BUY signal: cena przebiła kumo w góre \n"
                BuyScore+=1}
                break
            case -10:{
                textMsg = textMsg + "SELL signal: cena spadła poniżej kumo z kumo \n"
                SellScore+=1}
                break
            case -11:
                {textMsg = textMsg + "SELL signal: cena spadła w dół w kumo \n"
                SellScore+=1}
                break
            case -15:
                {textMsg = textMsg + "SELL signal: cena przebiła kumo w dół \n"
                SellScore+=1}
                break
            default:        
        }
        //Signal3Line - sygnał
        switch (analizeResult[0].Signals.Signal3Line) {
            case 10: 
                {textMsg = textMsg + "BUY signal: Sygnał 3 linii \n" 
                BuyScore+=1 } 
                break
            case -10:
                {textMsg = textMsg + "SELL signal: Sygnał 3 linii \n"
                SellScore+=1 }
                break
            default:        
        }
        //Potwierdzenia:
        //kumoColor
        switch (analizeResult[0].Signals.kumoColor) {
            case 5: 
                textMsg = textMsg + "BUY CONFIRM: kumo wzrostowe \n" 
                break
            case -5:
                textMsg = textMsg + "SELL CONFIRM: kumo spadkowe \n" 
                break
            default:        
        }
        //priceVsKumo
        switch (analizeResult[0].Signals.priceVsKumo) {
            case 5: 
                textMsg = textMsg + "BUY CONFIRM:  cena ponad kumo \n" 
                break
            case -5:
                textMsg = textMsg + "SELL CONFIRM: cena poniżej kumo \n"
                break
            default:        
        }
        //Signal3Line
        switch (analizeResult[0].Signals.Signal3Line) {
            case 5: 
                textMsg = textMsg + "BUY CONFIRM: Sygnał 3 linii \n" 
                break
            case -5:
                textMsg = textMsg + "SELL CONFIRM: Sygnał 3 linii \n"
                break
            default:        
        }
        //ChikouSpanVsPrice
        switch (analizeResult[0].Signals.ChikouSpanVsPrice) {
            case 9: 
                textMsg = textMsg + "BUY CONFIRM: ChikouSpan ponad ceną \n"
                break 
            case -9:
                textMsg = textMsg + "SELL CONFIRM: ChikouSpan ponad ceną \n"
                break
            default:        
        }
        console.log(BuyScore)
        textSub = textSub + " "+ BuyScore+" : "+ SellScore + ".      " +analizeResult[0].interval +" Ichimoku\n"
        textMsg =   textSub + textMsg + "StochRSI: \n" + stochMsg
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