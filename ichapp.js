const axios = require('axios');
var path = require("path");
const mailSender = require(__dirname + '/sender/mailer')
const telegramSend = require(__dirname + '/sender/telegram')
const { readPair, createMockData } = require(__dirname + '/file.js');
const ichimokuTools = require(__dirname + '/tools/ichimokuSpanAnalize')
const ichimokuScore = require(__dirname + '/tools/ichimokuInterprateAndSendSignal')
const dataFolder = __dirname + "/calcresults/"
const mysqlcon = require(__dirname + '/db/mysqlichimoku.js')
const mysqldb = require(__dirname + '/db/mysqldao.js')
const mysqlconmmd = require(__dirname + '/db/mysqlmmd.js')
const ichimokuCloud = require('technicalindicators').IchimokuCloud;
const mmd_calculate = require(__dirname + '/tools/mmd/mmd_calculate.js')
const mmd_tools = require(__dirname + '/tools/mmd/mmd_tools.js')
const mmdScore = require(__dirname + '/tools/mmd/mmdInterprateAndSendSignal.js')
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
candleTimeRangeMap.set('4h', { timeDuration: 14400000, addtionTime: 0 });
candleTimeRangeMap.set('1d', { timeDuration: 86400000, addtionTime: 0 });
//candleTimeRangeMap.set('3d', { timeDuration: 259200000, addtionTime: 172800000});
//candleTimeRangeMap.set('1w', { timeDuration: 604800000, addtionTime: 259200000});

const symbolList = readPair(__dirname + '/pair.txt');
//const symbolList = ["CHZUSDT"]
console.log("Count of symbol: " + symbolList.length);

function candleStickBuildParam(symbol, interval, startTime, endTime, limit = 600) {
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
    displacement: 26,
    mmd: {
      quicklength: 12,
      shortlength: 48,
      mediumlength: 288
    }
  }

  const dataRequest = await axiosInstance.get(candleStickBuildParam(symbol, timeRangeKey, "", ""));
  const responseData = dataRequest.data

  if (DEBUG) console.log('responseData = ', responseData)
  if (DEBUG) console.log('responseData Lenght = ', responseData.length)

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
  const mmd_results = mmd_calculate.mmd_calculate(input.close)
  console.log("MMD avg:" + symbol)
  console.log(mmd_results)
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
      "mmd_avgs": mmd_results
    }
    if (DEBUG) console.log('ichimokuResult = ', ichimokuResult)

    const ichimokuAnalizeResult = [{
      "symbol": symbol,
      "interval": timeRangeKey,
      "currentPrice": currentPrice,
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
      },
      "mmd_signals": mmd_tools.generate_mmd_signals(ichimokuResult.mmd_avgs)
    }]
    if (DEBUG) console.log('ichimokuAnalizeResult = ', ichimokuAnalizeResult)
    return ichimokuAnalizeResult;
  } else {
    console.log('Skipping analyze process, because data set is too small = ', result.length)
  }
}

// save can be done to file or preferably to database
function saveData(analizeResult, timeRangeKey, symbol, file = 1, db = 0) {
  if (file == 1) {
    createMockData(`${dataFolder}IchimokuResult-${symbol}-${timeRangeKey}.json`, analizeResult)
  }//save to db
  if (db == 1) {
    try {
      mysqlcon.replace(analizeResult)
    }
    catch (e) {
      console.log(e);
    }
  }

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
  return signalToSend;
}

function prepareSignalMmd(analizeResult) {
  const signalToSend = analizeResult.filter(
    m => Math.abs(m.mmd_signals.FastVsShortMMD) > 2
      || Math.abs(m.mmd_signals.FastVsMiddleMMD) > 2
      || Math.abs(m.mmd_signals.ShortVsMiddleMMD) > 2
  )
  return signalToSend;
}

// for now notification is sent to file, further can be email or telegram
async function notify(analizeResult, timeRangeKey, symbol, observedSymbols = []) {
  //createMockData(`${dataFolder}signal-${symbol}-${timeRangeKey}.json`, analizeResult)
  const is = ichimokuScore.scoreSignal(analizeResult).then(is => console.log(is));
  console.log("observedSymbols w notifaju dla symbolu:" + symbol)
  console.log(observedSymbols)
  console.log(observedSymbols.some(item=>item.symbol===symbol))
  try {
    mysqlcon.checkSignalWasSend(analizeResult).then(row => {
      console.log("wiersze juz istniejace: " + row[0].count)
      if (row[0].count == 0) {
        console.log("do db i wyslij")
        mysqlcon.replace(analizeResult)
        ichimokuScore.scoreSignal(analizeResult).then(is => {
          mysqlcon.updateBuySellScore(analizeResult, is.buyScore, is.sellScore)
          if (observedSymbols.length == 0 || observedSymbols.some(item=>item.symbol==symbol)) {
            telegramSend.sendTelegramRawMsg(is.textMsg)
            mysqlcon.updateSendSignalStatus(analizeResult)
          }
          console.log(is)
        });
      }
    })
  }
  catch (e) {
    console.log(e);
  }
}

async function notifyMMD(analizeResult, timeRangeKey, symbol, observedSymbols = []) {
  //createMockData(`${dataFolder}signal-${symbol}-${timeRangeKey}.json`, analizeResult)
  const is = mmdScore.scoreSignal(analizeResult).then(is => console.log(is));
  console.log("observedSymbols w notifaju dla symbolu:" + symbol)
  console.log(observedSymbols)
  console.log(observedSymbols.some(item=>item.symbol===symbol))
  try {
    mysqlconmmd.checkSignalWasSend(analizeResult).then(row => {
      console.log("wiersze juz istniejace: " + row[0].count)
      if (row[0].count == 0) {
        console.log("do db i wyslij")
        mysqlconmmd.replace(analizeResult)
        mmdScore.scoreSignal(analizeResult).then(is => {
          mysqlconmmd.updateBuySellScore(analizeResult, is.buyScore, is.sellScore)
          if (observedSymbols.length == 0 || observedSymbols.some(item=>item.symbol==symbol)) {
            telegramSend.sendTelegramRawMsg(is.textMsg)
            mysqlconmmd.updateSendSignalStatus(analizeResult)
          }
          console.log(is)
        });
      }
    })
  }
  catch (e) {
    console.log(e);
  }
}
async function getCurrentPrice(symbol) {
  return await axiosInstance.get(`${binanceApiEndpoint}/api/v3/ticker/price?symbol=${symbol}`);
}

async function main() {
  try {
    console.log("Symbol list = ", symbolList)
    console.log("Start execution")
    console.log(candleTimeRangeMap)
    console.log(candleTimeRangeMap.values())
    const candleTimeRangeMapKeys = [...candleTimeRangeMap.keys()];

    var observedSymbols = mysqldb.getObservedSymbols();
    var obsSymbols = await observedSymbols;
    console.log("Symbole obeserwowane:")
    console.log(obsSymbols)
    for (let i = 0; i < symbolList.length; i++) {
      let symbol = symbolList[i];
      if (1) console.log('Get price for symbol = ', symbol)
      const currentPrice = await getCurrentPrice(symbol);
      if (DEBUG) console.log('Price for symbol = ', currentPrice.data);

      for (let j = 0; j < candleTimeRangeMapKeys.length; j++) {
        if (DEBUG) console.log('================================================');
        let timeRangeKey = candleTimeRangeMapKeys[j];
        if (DEBUG) console.log(candleTimeRangeMap.get(candleTimeRangeMapKeys[j]));
        if (DEBUG) console.log(`Analyze data for symbol ${symbol} and time range ${timeRangeKey}`)

        let analyzeResult = await analyzeData(currentPrice.data.price, timeRangeKey, symbol);

        if (DEBUG) console.log('Analyze data result = ', analyzeResult);
        if (analyzeResult != null) {
          if (DEBUG) console.log('Saving data..');
          saveData(analyzeResult, timeRangeKey, symbol, 1, 0);
          if (DEBUG) console.log('Data saved.');

          let signalData = prepareSignalData(analyzeResult);
          if (DEBUG) console.log('Signal data result = ', signalData);
          if (signalData.length > 0) {
            if (DEBUG) console.log('Sending notification..');
            //const is = ichimokuScore.scoreSignal(signalData).then(is => console.log(is));
            //console.log(is)
            notify(signalData, timeRangeKey, symbol, obsSymbols);
            if (DEBUG) console.log('Notification sent.');
          } else {
            if (DEBUG) console.log('Signal data is empty - no need to send notification.');
          }

          let signalMmd  = prepareSignalMmd(analyzeResult);
          if (DEBUG) console.log('Signal data mmd result = ', signalMmd);
          if (signalMmd.length > 0) {
            if (DEBUG) console.log('Sending notification..');
            //const is = ichimokuScore.scoreSignal(signalData).then(is => console.log(is));
            //console.log(is)
            notifyMMD(signalMmd, timeRangeKey, symbol, []);
            if (DEBUG) console.log('Notification sent.');
          } else {
            if (DEBUG) console.log('Signal data is empty - no need to send notification.');
          }

        }
      }
    }
  } catch (e) {
    //telegramMessageRequest(testChannelId, e)
    console.error(e);
  }
  console.log("before exit")
  await sleep(10000);
  console.log("after 10 s sleep exit")
  process.exit(0)
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// execute main function at start
main();
