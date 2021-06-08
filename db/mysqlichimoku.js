const mysql = require('mysql');
require('dotenv').config()
var Promise = require('bluebird');
// First you need to create a connection to the database
// Be sure to replace 'user' and 'password' with the correct values
const tableich = "ichimokuSignals"

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "alerts"
});


con.connect((err) => {
  if(err){
    console.log('Error connecting to Db' + process.env.DB_HOST + process.env.DB_USER + process.env.DB_PASSWORD);
    return;
  }
  console.log('Connection established from mysqlichimoku');
});

// function getMySQL_connection() {
//     con.connect((err) => {
//         if(err){
//           console.log('Error connecting to Db');
//           return con;
//         }
//         console.log('Connection established');
//       });
// }



function getLastRecord(name)
{
    return new Promise(function(resolve, reject){
        var connection = con;

        var query_str =
            "SELECT * " +
            "FROM records ";

        var query_var = [name];

        var query = connection.query(query_str, query_var, function (err, rows, fields) {
            //if (err) throw err;
            if (err) {
                //throw err;
                console.log(err);
                logger.info(err);
                reject(err);
            }
            else {
                resolve(rows);
                //console.log(rows);
            }
        }); //var query = connection.query(query_str, function (err, rows, fields) {
    });
}

function create(content) {
    return new Promise(function(resolve, reject){
        var connection = con;
        const {trid, symbol,alertOn,currency,conditional,price1,price2,gotSend} = content
        

        var query_str =
        "INSERT INTO alerts (trid, symbol, alertOn, currency, conditional, price1, price2, gotSend)VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        var query_var = [trid, 
            symbol,
            alertOn,
            currency,
            conditional,
            Number.isNaN(parseFloat(price1))? null : parseFloat(price1),
            Number.isNaN(parseFloat(price2))? null : parseFloat(price2),
            gotSend];
        var query = connection.query(query_str, query_var, function (err, rows, fields) {
            //if (err) throw err;
            if (err) {
                //throw err;
                console.log(err);
                logger.info(err);
                reject(err);
            }
            else {
                console.log(fields)
                console.log(rows);
                resolve(rows);
                
            }
        });
    })
}

function getLastSignals()
{
    return new Promise(function(resolve, reject){
        var connection = con;

        var query_str =
            'select *, IF(symbol in (select * from symbols_observed), 1, 0) as observed from ichimokuSignals where (stopTime > (UNIX_TIMESTAMP()-3600)*1000) AND buyScore IS NOT NULL';

        var query_var = [];

        var query = connection.query(query_str, query_var, function (err, rows, fields) {
            //if (err) throw err;
            if (err) {
                //throw err;
                console.log(err);
                logger.info(err);
                reject(err);
            }
            else {
                resolve(rows);
                //console.log(rows);
            }
        }); //var query = connection.query(query_str, function (err, rows, fields) {
    });
}

function getLastAllSignals()
{
    //Zwraca sygnały ichimoku $ mmd + kolumnę czy jest observed (0/1)
    return new Promise(function(resolve, reject){
        var connection = con;

        var query_str =
            'select *, IF(symbol in (select * from symbols_observed), 1, 0) as observed from ichimokuSignals where (stopTime > (UNIX_TIMESTAMP()-3600)*1000)';

        var query_var = [];

        var query = connection.query(query_str, query_var, function (err, rows, fields) {
            //if (err) throw err;
            if (err) {
                //throw err;
                console.log(err);
                logger.info(err);
                reject(err);
            }
            else {
                resolve(rows);
                //console.log(rows);
            }
        }); //var query = connection.query(query_str, function (err, rows, fields) {
    });
}

function getLastObservedSignals()
{
    return new Promise(function(resolve, reject){
        var connection = con;

        var query_str =
            'select * from ichimokuSignals where ((period = "4h" AND stopTime > (UNIX_TIMESTAMP()-3600)*1000 ) OR (period = "1d" AND stopTime > (UNIX_TIMESTAMP()-3600)*1000 )) AND symbol in (select * from symbols_observed)';

        var query_var = [];

        var query = connection.query(query_str, query_var, function (err, rows, fields) {
            //if (err) throw err;
            if (err) {
                //throw err;
                console.log(err);
                logger.info(err);
                reject(err);
            }
            else {
                resolve(rows);
                //console.log(rows);
            }
        }); //var query = connection.query(query_str, function (err, rows, fields) {
    });
}
function replace(content) {
    return new Promise(function(resolve, reject){
        var connection = con;
        const symbol = content[0].symbol;
        const interval = content[0].interval;
        const startTime = content[0].startTime;
        const stopTime = content[0].stopTime;
        const CrossTenkanKijun = content[0].Signals.CrossTenkanKijun
        const crossVSKumo= content[0].Signals.crossVSKumo
        const CrossPriceKijun= content[0].Signals.CrossPriceKijun
        const crossPriceChikou= content[0].Signals.crossPriceChikou
        const kumoColor= content[0].Signals.kumoColor
        const priceVsKumo= content[0].Signals.priceVsKumo
        const Signal3Line= content[0].Signals.Signal3Line
        const ChikouSpanVsPrice= content[0].Signals.ChikouSpanVsPrice

        // var query_str =
        // "REPLACE INTO ichimokuSignals (symbol, period, startTime, stopTime, CrossTenkanKijun, crossVSKumo, CrossPriceKijun, crossPriceChikou, kumoColor, priceVsKumo, Signal3Line, ChikouSpanVsPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        var query_str = "INSERT INTO ichimokuSignals (symbol, period, startTime, stopTime, CrossTenkanKijun, crossVSKumo, CrossPriceKijun, crossPriceChikou, kumoColor, priceVsKumo, Signal3Line, ChikouSpanVsPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE symbol=?, period=?, startTime=?, stopTime=?, CrossTenkanKijun=?, crossVSKumo=?, CrossPriceKijun=?, crossPriceChikou=?, kumoColor=?, priceVsKumo=?, Signal3Line=?, ChikouSpanVsPrice=?;"

        var query_var = [symbol, interval, startTime, stopTime, CrossTenkanKijun, crossVSKumo, CrossPriceKijun, crossPriceChikou, kumoColor, priceVsKumo, Signal3Line, ChikouSpanVsPrice, symbol, interval, startTime, stopTime, CrossTenkanKijun, crossVSKumo, CrossPriceKijun, crossPriceChikou, kumoColor, priceVsKumo, Signal3Line, ChikouSpanVsPrice];
        var query = connection.query(query_str, query_var, function (err, rows, fields) {
            //if (err) throw err;
            if (err) {
                //throw err;
                console.log(err);
                //logger.info(err);
                reject(err);
            }
            else {
                console.log("REPLACE db")
                console.log(fields)
                console.log(rows);
                resolve(rows);
                
            }
        });
    })
}


function checkSignalWasSend(content) {
    return new Promise(function(resolve, reject){
        var connection = con;
        const symbol = content[0].symbol;
        const interval = content[0].interval;
        const startTime = content[0].startTime;
        const stopTime = content[0].stopTime;
        const CrossTenkanKijun = content[0].Signals.CrossTenkanKijun
        const crossVSKumo= content[0].Signals.crossVSKumo
        const CrossPriceKijun= content[0].Signals.CrossPriceKijun
        const crossPriceChikou= content[0].Signals.crossPriceChikou
        const kumoColor= content[0].Signals.kumoColor
        const priceVsKumo= content[0].Signals.priceVsKumo
        const Signal3Line= content[0].Signals.Signal3Line
        const ChikouSpanVsPrice= content[0].Signals.ChikouSpanVsPrice

        
        var query_str ="SELECT count(*) as count FROM ichimokuSignals WHERE (symbol = ? AND period = ? AND startTime = ? AND stopTime = ? AND CrossTenkanKijun=? AND crossVSKumo=? AND CrossPriceKijun=? AND crossPriceChikou=? AND kumoColor=? AND priceVsKumo=? AND Signal3Line=? AND ChikouSpanVsPrice=? AND SendAlert=?)";
        var query_var = [symbol, interval, startTime, stopTime, CrossTenkanKijun, crossVSKumo, CrossPriceKijun, crossPriceChikou, kumoColor, priceVsKumo, Signal3Line, ChikouSpanVsPrice, 1];

        var query = connection.query(query_str, query_var, function (err, rows, fields) {
            //if (err) throw err;
            if (err) {
                //throw err;
                console.log(err);
                //logger.info(err);
                reject(err);
            }
            else {
                console.log(fields)
                console.log(rows);
                resolve(rows);
                
            }
        });
    })
}
function updateSendSignalStatus(content){
    return new Promise(function(resolve, reject){
        var connection = con;
        
        const symbol = content[0].symbol;
        const interval = content[0].interval;
        const startTime = content[0].startTime;
        const stopTime = content[0].stopTime;
        const nowData = new Date();
        
        var query_str =
        "UPDATE ichimokuSignals SET SendAlert = 1, SendDate = ? WHERE symbol = ? AND period = ? AND startTime = ? AND stopTime = ?";
        var query_var = [nowData, symbol, interval, startTime, stopTime];
        var query = connection.query(query_str, query_var, function (err, rows, fields) {
            //if (err) throw err;
            if (err) {
                //throw err;
                console.log(err);
                logger.info(err);
                reject(err);
            }
            else {
                console.log("UPDATE sendSignal" + symbol + " " + interval + " " + startTime + " " + stopTime)
                console.log(fields)
                console.log(rows);
                resolve(rows);
                
            }
        });
    })
  }

function updateBuySellScore(content,buyScore,sellScore){
    return new Promise(function(resolve, reject){
        var connection = con;
        
        const symbol = content[0].symbol;
        const interval = content[0].interval;
        const startTime = content[0].startTime;
        const stopTime = content[0].stopTime;
        
        var query_str =
        "UPDATE ichimokuSignals SET buyScore = ?, sellScore = ? WHERE symbol = ? AND period = ? AND startTime = ? AND stopTime = ?";
        var query_var = [buyScore, sellScore, symbol, interval, startTime, stopTime];
        var query = connection.query(query_str, query_var, function (err, rows, fields) {
            //if (err) throw err;
            if (err) {
                //throw err;
                console.log(err);
                logger.info(err);
                reject(err);
            }
            else {
                console.log("UPDATE sendSignal" + symbol + " " + interval + " " + startTime + " " + stopTime)
                console.log(fields)
                console.log(rows);
                resolve(rows);
                
            }
        });
    })
  }

function update(content){
    return new Promise(function(resolve, reject){
        var connection = con;
        const {trid, newGotSend} = content
        
        var query_str =
        "UPDATE alerts SET gotSend = ? WHERE trid = ?";
        var query_var = [newGotSend, trid];
        var query = connection.query(query_str, query_var, function (err, rows, fields) {
            //if (err) throw err;
            if (err) {
                //throw err;
                console.log(err);
                logger.info(err);
                reject(err);
            }
            else {
                console.log(fields)
                console.log(rows);
                resolve(rows);
                
            }
        });
    })
  }
function getRecordCount(symbol, interval, startTime, stopTime) {
    return new Promise(function(resolve, reject){
        var connection = con;
        var query_str =
        "SELECT count(*) FROM ichimokuSignals WHERE (symbol = ? AND period = ? AND startTime = ? AND stopTime = ?)";
        var query_var = [symbol, interval, startTime, stopTime];
        console.log(query_var)
        var query = connection.query(query_str, query_var, function (err, rows, fields) {
            //if (err) throw err;
            if (err) {
                //throw err;
                console.log(err);
                //logger.info(err);
                reject(err);
            }
            else {
                console.log(fields)
                console.log(rows);
                resolve(JSON.parse(JSON.stringify(rows)));
                
            }
        });
    }) 
}

function getAll() {
    return new Promise(function(resolve, reject){
        var connection = con;
        var query_str =
        "SELECT * FROM ichimokuSignals";
        var query_var = [];
        console.log(query_var)
        var query = connection.query(query_str, query_var, function (err, rows, fields) {
            //if (err) throw err;
            if (err) {
                //throw err;
                console.log(err);
                //logger.info(err);
                reject(err);
            }
            else {
                console.log(fields)
                console.log(rows);
                resolve(JSON.parse(JSON.stringify(rows)));
                
            }
        });
    }) 
  }
function deleteRow(trid) {
    return new Promise(function(resolve, reject){
        var connection = con;
        var query_str =
        "DELETE FROM alerts WHERE trid = ?";
        var query_var = [trid];
        console.log(query_var)
        var query = connection.query(query_str, query_var, function (err, rows, fields) {
            //if (err) throw err;
            if (err) {
                //throw err;
                console.log(err);
                //logger.info(err);
                reject(err);
            }
            else {
                console.log(fields)
                console.log(rows);
                resolve(rows);
                
            }
        });
    })
  }

function deleteSignalObserved(symbol) {
    return new Promise(function(resolve, reject){
        var connection = con;
        var query_str =
        "DELETE FROM symbols_observed WHERE symbol = ?";
        var query_var = [symbol];
        console.log(query_var)
        var query = connection.query(query_str, query_var, function (err, rows, fields) {
            //if (err) throw err;
            if (err) {
                //throw err;
                console.log(err);
                //logger.info(err);
                reject(err);
            }
            else {
                console.log(fields)
                console.log(rows);
                resolve(rows);
                
            }
        });
    })
  }

// content = [
//     {
//       symbol: 'ZIOMEKUSDT',
//       interval: '1d',
//       startTime: 1617235200000,
//       stopTime: 1617321599999,
//       Signals: {
//         CrossTenkanKijun:6,
//         crossVSKumo: 3,
//         CrossPriceKijun: 3,
//         crossPriceChikou: 3,
//         kumoColor: 3,
//         priceVsKumo: 3,
//         Signal3Line: 3,
//         ChikouSpanVsPrice: 3
//       }
//     }
//   ]
//   checkSignalWasSend(content).then(row=> {
//       console.log("wiersze juz istniejace: " + row[0].count)
//       if(row[0].count == 0){
//         console.log("do db i wyslij")
//         replace(content)
//         updateSendSignalStatus(content)
//       } 
// })
  //replace(content)
  //updateSendSignalStatus(content)
// create({trid:3512556532,symbol:"ETHUSDT",alertOn:"ltt",currency:"USD",condition:"condition",price1:188448.23,price2:300333.12333,gotSend:1}).then(row=>{
//     console.log(row)
// })

//update({trid:3512556532, newGotSend:9}).then(row=>console.log(row))
//deleteRow(9123).then(x=>console.log("DELETE: "))
//getAll().then(res=>console.log(res))

// //getLastRecord('ziom')
//     .then(function(rows){
//         console.log(rows)
//         if (rows.length > 2) {
//             console.log("action");
//         }
//     })
//     .error(function(e){console.log("Error handler " + e)})
//     .catch(function(e){console.log("Catch handler " + e)});

// con.end((err) => {
//   // The connection is terminated gracefully
//   // Ensures all remaining queries are executed
//   // Then sends a quit packet to the MySQL server.
//   console.log("connection close")
// });
////getRecordCount("BTCSUSDT", "1d", 1616457600000, 1616543999999)
//getAll()
// //replace([
//     {
//       "symbol": "ETHUSDT",
//       "interval": "4h",
//       "startTime": 1616716855000,
//       "stopTime": 1616803199999,
//       "Signals": {
//         "CrossTenkanKijun": 0,
//         "crossVSKumo": 0,
//         "CrossPriceKijun": 10,
//         "crossPriceChikou": 8,
//         "kumoColor": 5,
//         "priceVsKumo": 10,
//         "Signal3Line": 5,
//         "ChikouSpanVsPrice": 9
//       }
//     }
//   ])
getLastSignals().then(x=>console.log(x))

console.log(getLastSignals())
module.exports = {
    getAll,
    deleteRow,
    create,
    update,
    replace,
    getLastSignals,
    getLastObservedSignals,
    getLastAllSignals,
    checkSignalWasSend,
    updateSendSignalStatus,
    updateBuySellScore,
    deleteSignalObserved
}