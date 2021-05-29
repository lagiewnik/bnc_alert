const mysql = require('mysql');
require('dotenv').config()
var Promise = require('bluebird');
// First you need to create a connection to the database
// Be sure to replace 'user' and 'password' with the correct values


const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "alerts"
});

con.connect((err) => {
  if(err){
    console.log('Error connecting to Db for:' + process.env.DB_HOST + " " + process.env.DB_USER + "" +  process.env.DB_PASSWORD);
    return;
  }
  console.log('Connection established');
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
                //logger.info(err);
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

function create_observed_symbol(symbol) {
    return new Promise(function(resolve, reject){
        var connection = con;
        //var symbol = symbol
        var query_str =
        "INSERT INTO symbols_observed ( symbol)VALUES (?)";
        console.log("query: "+query_str)
        console.log(symbol)
        var query_var = [ 
            symbol
            ];
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

function getAll() {
    return new Promise(function(resolve, reject){
        var connection = con;
        var query_str =
        "SELECT * FROM alerts";
        var query_var = [];
        console.log(query_var)
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
                resolve(JSON.parse(JSON.stringify(rows)));
                
            }
        });
    }) 
  }

function getObservedSymbols() {
    return new Promise(function(resolve, reject){
        var connection = con;
        var query_str =
        "SELECT * FROM symbols_observed";
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


module.exports = {
    getAll,
    deleteRow,
    create,
    update,
    create_observed_symbol,
    getObservedSymbols
}