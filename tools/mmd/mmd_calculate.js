//import {ema, sma} from 'moving-averages'
//const ema = require('moving-averages').ema
//const sma = require('moving-averages').ma
const SMA = require('technicalindicators').SMA
const EMA = require('technicalindicators').EMA
const RSI = require('technicalindicators').RSI
const stochRSI = require('technicalindicators').StochasticRSI
const periodFast = 12;
const periodShort = 48;
const periodMiddle = 288;
const periodRSI = 14
//settings for stochRSI
const rsiPeriod = 14
const stochasticPeriod  = 14
const kPeriod = 3
const dPeriod = 3

let period = 2;
let values = [1,2,3,4,5,6];                    

//SMA.calculate({period : period, values : values})   

function sma_calculate(period, values) {
    //console.log(values)
    
    const sma_ta = SMA.calculate({period : period, values : values}).slice(-2)
    //const sma_mavg = sma(values , period).slice(-2)
    return sma_ta
}

function rsi_calculate(period, values) {
    //console.log(values)
    
    const rsi_ta = RSI.calculate({period : period, values : values}).slice(-2)
    
    //const sma_mavg = sma(values , period).slice(-2)
    return rsi_ta
}

function stochrsi_calculate(rsiPeriod, stochasticPeriod, kPeriod, dPeriod, values) {
    //console.log(values)
     //values: number[];
    // rsiPeriod: number;
    // stochasticPeriod: number;
    // kPeriod: number;
    // dPeriod: number;
    const stochrsi_ta = stochRSI.calculate({rsiPeriod : rsiPeriod, stochasticPeriod: stochasticPeriod, kPeriod: kPeriod, dPeriod: dPeriod, values : values}).slice(-2)
    
    //const sma_mavg = sma(values , period).slice(-2)
    return stochrsi_ta
}

function ema_calculate(period, values) {
    //console.log(values)
    const ema_ta = EMA.calculate({period : period, values : values}).slice(-2)
    //const ema_mavg = ema(values , period).slice(-2)
    return ema_ta
}

function mmd_calculate(values) {
    //const fast_perriod_extended = -periodFast-15
    //const fast_values = values.slice(fast_perriod_extended)
    let ema_fast = (ema_calculate(periodFast, values))
    let ema_short = ema_calculate(periodShort, values)
    let ema_mid = ema_calculate(periodMiddle, values)
    let sma_fast = sma_calculate(periodFast, values)
    let sma_short = sma_calculate(periodShort, values)
    let sma_mid = sma_calculate(periodMiddle, values)
    let rsi = rsi_calculate(periodRSI, values )
    let stochrsi = stochrsi_calculate(rsiPeriod, stochasticPeriod, kPeriod, dPeriod, values)
    
    return {
    "ema_fast": ema_fast,
    "sma_fast": sma_fast,
    "ema_short": ema_short,
    "sma_short": sma_short,
    "ema_mid": ema_mid,
    "sma_mid": sma_mid,
    "rsi": rsi,
    "stochrsi" : stochrsi

    }
}
console.log(mmd_calculate(values))
//console.log(sma_calculate(period, values))
//console.log(ema_calculate(period, values))
module.exports = {
    sma_calculate, ema_calculate, mmd_calculate
}