//import {ema, sma} from 'moving-averages'
const ema = require('moving-averages').ema
const sma = require('moving-averages').ma
const SMA = require('technicalindicators').SMA
const EMA = require('technicalindicators').EMA
const periodFast = 12;
const periodShort = 48;
const periodMiddle = 288;

let period = 2;
let values = [1,2,3,4,5,6];                    

//SMA.calculate({period : period, values : values})   

function sma_calculate(period, values) {
    //console.log(values)
    
    const sma_ta = SMA.calculate({period : period, values : values}).slice(-2)
    //const sma_mavg = sma(values , period).slice(-2)
    return sma_ta
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
    
    return {
    "ema_fast": ema_fast,
    "sma_fast": sma_fast,
    "ema_short": ema_short,
    "sma_short": sma_short,
    "ema_mid": ema_mid,
    "sma_mid": sma_mid
    }
}
console.log(mmd_calculate(values))
//console.log(sma_calculate(period, values))
//console.log(ema_calculate(period, values))
module.exports = {
    sma_calculate, ema_calculate, mmd_calculate
}