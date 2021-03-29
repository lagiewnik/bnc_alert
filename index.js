const axios = require('axios');

const { readPair, createMockData } = require('./file.js');
const ichimokuTools = require('./tools/ichimokuSpanAnalize')

const dataFolder = "./calcresults/"

const ichimokuCloud = require('technicalindicators').IchimokuCloud;

const binanceApiEndpoint = 'https://api.binance.com';

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  responseType: 'json',
  crossDomain: true,
  withCredentials: false
});

const DEBUG = false;

const candleTimeRangeMap = new Map();
//candleTimeRangeMap.set('1h', { timeDuration: 3600000, addtionTime: 0});
//candleTimeRangeMap.set('4h', { timeDuration: 14400000, addtionTime: 0 });
candleTimeRangeMap.set('1d', { timeDuration: 86400000, addtionTime: 0 });
//candleTimeRangeMap.set('3d', { timeDuration: 259200000, addtionTime: 172800000});
//candleTimeRangeMap.set('1w', { timeDuration: 604800000, addtionTime: 259200000});

const symbolList = readPair('./pair.txt');
//const symbolList = ['XEMUSDT']
console.log("Count of symbol: " + symbolList.length);

function candleStickBuildParam(symbol, interval, startTime, endTime, limit = 130) {
  console.log(`Binance endpoint: ${binanceApiEndpoint}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`)
  return `${binanceApiEndpoint}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
}

async function analyzeData(currentPrice, timeRangeKey, symbol) {

  let ichimokuInput = {
    high: [],
    low: [],
    close: [],
    startTimeCandle: [],
    stopTimeCandle: [],
    conversionPeriod: 9,
    basePeriod: 26,
    spanPeriod: 52,
    displacement: 26
  }

  const dataRequest = await axiosInstance.get(candleStickBuildParam(symbol, timeRangeKey, "", ""));
  const responseData = dataRequest.data

  if(DEBUG) console.log('responseData = ', responseData)
  if(DEBUG) console.log('responseData Lenght = ', responseData.length)

  responseData.forEach(marketInfoR => {
    ichimokuInput.high.push(parseFloat(marketInfoR[2]))
    ichimokuInput.low.push(parseFloat(marketInfoR[3]))
    ichimokuInput.close.push(parseFloat(marketInfoR[4]))
    ichimokuInput.startTimeCandle.push(marketInfoR[0])
    ichimokuInput.stopTimeCandle.push(marketInfoR[6])
  })

  let input = JSON.parse(JSON.stringify(ichimokuInput))
  if (DEBUG) console.log('input = ', input)

  const result = ichimokuCloud.calculate(input)

  if (responseData.length >= ichimokuInput.spanPeriod + ichimokuInput.displacement) {
    console.log('Data set size = ', result.length)

    if (DEBUG) console.log('Data set = ', result)

    const ichimokuResult = {
      "symbol": symbol,
      "interval": timeRangeKey,
      "startTime": ichimokuInput.startTimeCandle[ichimokuInput.startTimeCandle.length - 1],
      "stopTime": ichimokuInput.stopTimeCandle[ichimokuInput.stopTimeCandle.length - 1],
      "currentPrice": currentPrice,
      "tenkanSen": result[result.length - 1].conversion,
      "kijunSen": result[result.length - 1].base,
      "senkouSpanA": result[result.length - ichimokuInput.displacement].spanA,
      "senkouSpanB": result[result.length - ichimokuInput.displacement].spanB,
      "chikouSpan": parseFloat(currentPrice),
      "priceVSchikouSpan": ichimokuInput.close[ichimokuInput.close.length - ichimokuInput.displacement],
      "tenkanSenPrev": result[result.length - 2].conversion,
      "kijunSenPrev": result[result.length - 2].base,
      "senkouSpanAPrev": result[result.length - ichimokuInput.displacement - 1].spanA,
      "senkouSpanBPrev": result[result.length - ichimokuInput.displacement - 1].spanB,
      "chikouSpanPrev": ichimokuInput.close[ichimokuInput.close.length - 2],
      "priceVSchikouSpanPrev": ichimokuInput.close[ichimokuInput.close.length - ichimokuInput.displacement - 1],
    }
    if(DEBUG) console.log('ichimokuResult = ', ichimokuResult)

    const ichimokuAnalizeResult = [{
      "symbol": symbol,
      "interval": timeRangeKey,
      "startTime": ichimokuInput.startTimeCandle[ichimokuInput.startTimeCandle.length - 1],
      "stopTime": ichimokuInput.stopTimeCandle[ichimokuInput.stopTimeCandle.length - 1],
      "Signals": {
        "CrossTenkanKijun": ichimokuTools.crossKijunTenkan(ichimokuResult.kijunSen, ichimokuResult.kijunSenPrev, ichimokuResult.tenkanSen, ichimokuResult.tenkanSenPrev),
        "crossVSKumo": ichimokuTools.crossVSKumo(ichimokuResult.kijunSen, ichimokuResult.kijunSenPrev, ichimokuResult.tenkanSen, ichimokuResult.tenkanSenPrev, ichimokuResult.senkouSpanA, ichimokuResult.senkouSpanAPrev, ichimokuResult.senkouSpanB, ichimokuResult.senkouSpanBPrev),
        "CrossPriceKijun": ichimokuTools.crossKijunPrice(ichimokuResult.kijunSen, ichimokuResult.kijunSenPrev, ichimokuResult.currentPrice, ichimokuResult.chikouSpanPrev),
        "crossPriceChikou": ichimokuTools.crossPriceChikou(ichimokuResult.priceVSchikouSpan, ichimokuResult.priceVSchikouSpanPrev, ichimokuResult.chikouSpan, ichimokuResult.chikouSpanPrev),
        "kumoColor": ichimokuTools.kumoColor(ichimokuResult.senkouSpanA, ichimokuResult.senkouSpanAPrev, ichimokuResult.senkouSpanB, ichimokuResult.senkouSpanBPrev),
        "priceVsKumo": ichimokuTools.priceVsKumo(ichimokuResult.currentPrice, ichimokuResult.chikouSpanPrev, ichimokuResult.senkouSpanA, ichimokuResult.senkouSpanAPrev, ichimokuResult.senkouSpanB, ichimokuResult.senkouSpanBPrev),
        "Signal3Line": ichimokuTools.s3line(ichimokuResult.tenkanSen, ichimokuResult.tenkanSenPrev, ichimokuResult.kijunSen, ichimokuResult.kijunSenPrev, ichimokuResult.senkouSpanA, ichimokuResult.senkouSpanAPrev, ichimokuResult.senkouSpanB, ichimokuResult.senkouSpanBPrev),
        "ChikouSpanVsPrice": 9 * Math.sign(parseFloat(currentPrice) - ichimokuResult.priceVSchikouSpan)
      }
    }]
    if (DEBUG) console.log('ichimokuAnalizeResult = ', ichimokuAnalizeResult)

    return ichimokuAnalizeResult;
  } else {
    console.log('Skipping analyze process, because data set is too small = ',result.length)
  }
}

// save can be done to file or preferably to database
function saveData(analizeResult, timeRangeKey, symbol) {
  createMockData(`${dataFolder}IchimokuResult-${symbol}-${timeRangeKey}.json`, analizeResult)
}

// return signal data if exists, otherwise return empty array
function prepareSignalData(analizeResult) {
  const signalToSend = analizeResult.filter(
    m => Math.abs(m.Signals.CrossTenkanKijun) > 0
      || Math.abs(m.Signals.crossVSKumo) > 0
      || Math.abs(m.Signals.CrossPriceKijun) > 0
      //|| Math.abs(m.Signals.crossPriceChikou)>0
      //|| m.Signals.kumoColor!=0
      || Math.abs(m.Signals.priceVsKumo) >= 10
      || Math.abs(m.Signals.Signal3Line) >= 10
    //|| m.Signals.ChikouSpanVsPrice!=0
  )
  //console.log('Signal data = ', signalToSend);
  return signalToSend;
}

// for now notification is sent to file, further can be email or telegram
function notify(analizeResult, timeRangeKey, symbol) {
  createMockData(`${dataFolder}signal-${symbol}-${timeRangeKey}.json`, analizeResult)
}

async function getCurrentPrice(symbol) {
  return await axiosInstance.get(`${binanceApiEndpoint}/api/v3/ticker/price?symbol=${symbol}`);
}

async function main() {
  try {
    console.log("Symbol list = ", symbolList)
    console.log("Start execution")

    const candleTimeRangeMapKeys = [...candleTimeRangeMap.keys()];

    for (let i = 0; i < symbolList.length; i++) {
      let symbol = symbolList[i];
      console.log('Get price for symbol = ', symbol)
      const currentPrice = await getCurrentPrice(symbol);
      console.log('Price for symbol = ', currentPrice.data);

      for (let j = 0; j < candleTimeRangeMapKeys.length; j++) {
        console.log('================================================');
        let timeRangeKey = candleTimeRangeMapKeys[j];

        console.log(`Analyze data for symbol ${symbol} and time range ${timeRangeKey}`)

        let analyzeResult = await analyzeData(currentPrice.data.price, timeRangeKey, symbol);

        if(analyzeResult) {
          console.log('Analyze data result = ', analyzeResult);

          console.log('Saving data..');
          saveData(analyzeResult, timeRangeKey, symbol);
          console.log('Data saved.');
  
          let signalData = prepareSignalData(analyzeResult);
          console.log('Signal data result = ', signalData);
  
          if (signalData.length > 0) {
            console.log('Sending notification..');
            notify(signalData, timeRangeKey, symbol);
            console.log('Notification sent.');
          } else {
            console.log('Signal data is empty - no need to send notification.');
          }
        } 
      }
    }
  } catch (e) {
    //telegramMessageRequest(testChannelId, e)
    console.error(e);
  }
}

// execute main function at start
main();

