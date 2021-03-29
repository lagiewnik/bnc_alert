const { json } = require('body-parser');
var fs = require('fs');
const { toNamespacedPath } = require('path');
const filePath = './config/alerts.json';
const Promise = require('bluebird')

const mysqlcon = require('../db/mysqldao.js')

const alert_getAll = (req, resp) => {
    // const alerts_repo = new AlertsRepo(dao)
    var data;
    var datadb;

    // try {
    //     data = JSON.parse(fs.readFileSync(filePath));
    // } catch (err) {
    //     console.log(err)
    //     // handle your file not found (or other error) here
    // }
    // console.log("alerty z pliku pobranie")
    // console.log(data)

    // try {
    //     alerts_repo.getAll().then(dbd=>{datadb=dbd;
    //         resp.render("AlertGenerator", {alerts: datadb})
    //         console.log("Po promisie")
    //         console.log(datadb)});
    // } catch (err) {
    //     console.log(err)
    //     // handle your file not found (or other error) here
    // }
    console.log("alerty z DB pobranie:")
    console.log(datadb)
    //z mysql
    try {
            mysqlcon.getAll().then(dbd=>{datadb=dbd;
            resp.render("AlertGenerator", {alerts: datadb})
            console.log("Po promisie")
            console.log(datadb)});
    } catch (err) {
        console.log(err)
        // handle your file not found (or other error) here
    }

    console.log("alerty z DB pobranie:")
    console.log(datadb)
    //resp.render("AlertGenerator", {alerts: data})
}

const alert_create = (req, resp) => {
    // const alerts_repo = new AlertsRepo(dao)
    console.log("create exec")
    console.log(req.body)
    // var fileContent
    // try {
    //     fileContent = JSON.parse(fs.readFileSync(filePath));
    // } catch (err) {
    //     console.log("JSON parse")
    //     console.log(err)
    //     // handle your file not found (or other error) here
    // }
    // console.log(fileContent)
    // fileContent.push(req.body)
    // console.log(fileContent)

    //fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2))
    //alerts_repo.create(req.body).then(status=>console.log(status))
    mysqlcon.create(req.body).then(status=>console.log(status))
    resp.json({redirect: '/'})
}

const alert_delete = (req, resp) => {
    //console.log(req)
    //const data;
    // const alerts_repo = new AlertsRepo(dao)
    var fileContent 
    const idDelete = req.params.id
    // try {
    //     fileContent = JSON.parse(fs.readFileSync(filePath));
    // } catch (err) {
    //     console.log("JSON parse")
    //     console.log(err)
    //     // handle your file not found (or other error) here
    // }
    // var tmp = []
    // console.log("Id delete" + idDelete)

    // console.log("wyswietl plik aktualny")
    // console.log(fileContent)
    // fileContent.forEach(element => {
    //     if(element.trid != idDelete){
    //         console.log("Zostaw w alertach" + element.trid)
    //         tmp.push(element)
    //     } 
    // });
    // console.log(tmp)
    // try {
    //     alerts_repo.delete(idDelete).then(dbd=>{
    //         console.log(dbd)
    //         resp.json({redirect: '/'})
    //     });
    // } catch (err) {
    //     console.log(err)
    //     // handle your file not found (or other error) here
    // }

    try {
            mysqlcon.deleteRow(idDelete).then(dbd=>{
            console.log(dbd)
            resp.json({redirect: '/'})
        });
    } catch (err) {
        console.log(err)
        // handle your file not found (or other error) here
    }
    // fs.writeFileSync(filePath, JSON.stringify(tmp), null, 2)
    // fs.writeFileSync('./config/alerts2.json', JSON.stringify(fileContent), null, 2)
    //resp.json({redirect: '/'})
}


//alert_getAll()
module.exports = {
    alert_delete,
    alert_create,
    alert_getAll
}