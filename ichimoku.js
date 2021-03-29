const { range } = require('lodash');

function avgHighLow(currentPrice, marketInfos, timeget, sessions) {
    //console.log("Średnia dla timeget:" + new Date(timeget))
    const indexTimeget = marketInfos.indexOf(marketInfos.find(marketInfo => marketInfo.time === timeget))
    if (indexTimeget - sessions + 2 < 0) return -1;
    const subInfos = marketInfos.slice(indexTimeget - sessions + 2, indexTimeget);
    const highPriceArray = subInfos.map(marketInfo => marketInfo.high)
    if( currentPrice > 0 ) {
        highPriceArray.push(currentPrice)
    }
    const lowPriceArray = subInfos.map(marketInfo => marketInfo.low)
    if( currentPrice > 0 ) {
        lowPriceArray.push(currentPrice)
    }
    const highestPrice =  Math.max.apply(null, highPriceArray );
    const lowestPrice =  Math.min.apply(null, lowPriceArray );
    return (highestPrice + lowestPrice)/2;
}

function ichimokuCaculator(currentPrice, marketInfos, timeget) {
    const tenkanSen = avgHighLow(currentPrice, marketInfos, timeget, 9);
    const kijunSen = avgHighLow(currentPrice, marketInfos, timeget, 26);
    return {
        tenkanSen: tenkanSen,
        kijunSen:  kijunSen,
        senkouSpanA:  (tenkanSen + kijunSen)/2,
        senkouSpanB: avgHighLow(currentPrice, marketInfos, timeget, 52)
    }
}

function ichimokuDynamicResistCaculator(currentPrice, marketInfos, timeget, timeRangeValue) {
    const currentCacul = ichimokuCaculator(currentPrice, marketInfos, timeget)
    const cacul26Before = ichimokuCaculator(-1, marketInfos, timeget - timeRangeValue*25)
    return {
        tenkanSen: currentCacul.tenkanSen,
        kijunSen: currentCacul.kijunSen,
        senkouSpanA: cacul26Before.senkouSpanA,
        senkouSpanB: cacul26Before.senkouSpanB
    }
}

function ichimokuStaticResistCaculator(currentPrice, marketInfos, timeget, timeRangeValue, sessions = 100) {
    const tenkanSenResists = [];
    const kijunSenResists = [];
    const senkouSpanBResists = [];

    let checkTenkanSenResist = {
        price: 0,
        loopTime: 0
    }
    let checkKijunSenResist = {
        price: 0,
        loopTime: 0
    }
    let checkSenkouSpanBResist = {
        price: 0,
        loopTime: 0
    }
    let i;
    for(i = 0; i < sessions; i ++) {
        const checking = ichimokuCaculator(currentPrice, marketInfos, timeget - timeRangeValue*i)
        if (checkTenkanSenResist.price === checking.tenkanSen) {
            if (checkTenkanSenResist.loopTime >= 3 && tenkanSenResists.indexOf(checkTenkanSenResist.price) === -1) {
                tenkanSenResists.push(checkTenkanSenResist.price)
            }
            checkTenkanSenResist.loopTime++
        } else {
            checkTenkanSenResist.price = checking.tenkanSen
        }
        if (checkKijunSenResist.price === checking.kijunSen) {
            if (checkKijunSenResist.loopTime >= 3 && kijunSenResists.indexOf(checkKijunSenResist.price) === -1) {
                kijunSenResists.push(checkKijunSenResist.price)
            }
            checkKijunSenResist.loopTime++
        } else {
            checkKijunSenResist.price = checking.kijunSen
        }
        if (checkSenkouSpanBResist.price === checking.senkouSpanB) {
            if (checkSenkouSpanBResist.loopTime >= 3 && senkouSpanBResists.indexOf(checkSenkouSpanBResist.price) === -1) {
                senkouSpanBResists.push(checkSenkouSpanBResist.price)
            }
            checkSenkouSpanBResist.loopTime++
        } else {
            checkSenkouSpanBResist.price = checking.senkouSpanB
        }
    }
    return {
        tenkanSenResists: tenkanSenResists,
        kijunSenResists: kijunSenResists,
        senkouSpanBResists: senkouSpanBResists
    }
}

function getClosestResists(currentPrice, marketInfos, timeget, timeRangeValue, sessions = 100) {
    const resists = ichimokuStaticResistCaculator(currentPrice, marketInfos, timeget, timeRangeValue, sessions);

    const closestResistTenkanSen = resists.tenkanSenResists.reduce(function(prev, curr) {
        return (Math.abs(curr - currentPrice) > Math.abs(prev - currentPrice) ? curr : prev);
    });
    const closestSupportTenkanSen = resists.tenkanSenResists.reduce(function(prev, curr) {
        return (Math.abs(curr - currentPrice) < Math.abs(prev - currentPrice) ? curr : prev);
    });
    
    const closestResistKijunSen = resists.kijunSenResists.reduce(function(prev, curr) {
        return (Math.abs(curr - currentPrice) > Math.abs(prev - currentPrice) ? curr : prev);
    });
    const closestSupportKijunSen = resists.kijunSenResists.reduce(function(prev, curr) {
        return (Math.abs(curr - currentPrice) < Math.abs(prev - currentPrice) ? curr : prev);
    });
    
    const closestResistSenkouSpanB = resists.senkouSpanBResists.reduce(function(prev, curr) {
        return (Math.abs(curr - currentPrice) > Math.abs(prev - currentPrice) ? curr : prev);
    });
    const closestSupportSenkouSpanB = resists.senkouSpanBResists.reduce(function(prev, curr) {
        return (Math.abs(curr - currentPrice) < Math.abs(prev - currentPrice) ? curr : prev);
    });



    return {
        closestResistTenkanSen: closestResistTenkanSen > currentPrice? closestResistTenkanSen: 'Không có',
        closestSupportTenkanSen: closestSupportTenkanSen < currentPrice? closestSupportTenkanSen: 'Không có',
        closestResistKijunSen: closestResistKijunSen > currentPrice? closestResistKijunSen: 'Không có',
        closestSupportKijunSen: closestSupportKijunSen < currentPrice? closestSupportKijunSen: 'Không có',
        closestResistSenkouSpanB: closestResistSenkouSpanB > currentPrice? closestResistSenkouSpanB: 'Không có',
        closestSupportSenkouSpanB: closestSupportSenkouSpanB < currentPrice? closestSupportSenkouSpanB: 'Không có',
    }
}


module.exports = {
    ichimokuCaculator,
    ichimokuDynamicResistCaculator,
    ichimokuStaticResistCaculator,
    getClosestResists
}

