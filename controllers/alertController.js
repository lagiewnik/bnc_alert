const { json } = require('body-parser');
var fs = require('fs');
const { toNamespacedPath } = require('path');
const filePath = './config/alerts.json';

const alert_getAll = (req, resp) => {
    var data;

    try {
        data = JSON.parse(fs.readFileSync(filePath));
    } catch (err) {
        console.log(err)
        // handle your file not found (or other error) here
    }
    console.log(data)
    resp.render("AlertGenerator", {alerts: data})
}

const alert_create = (req, resp) => {
    console.log("create exec")
    console.log(req.body)
    var fileContent
    try {
        fileContent = JSON.parse(fs.readFileSync(filePath));
    } catch (err) {
        console.log("JSON parse")
        console.log(err)
        // handle your file not found (or other error) here
    }
    console.log(fileContent)
    fileContent.push(req.body)
    console.log(fileContent)

    fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2))
    resp.json({redirect: '/'})
}

const alert_delete = (req, resp) => {
    //console.log(req)
    //const data;
    var fileContent 
    const idDelete = req.params.id
    try {
        fileContent = JSON.parse(fs.readFileSync(filePath));
    } catch (err) {
        console.log("JSON parse")
        console.log(err)
        // handle your file not found (or other error) here
    }
    var tmp = []
    console.log("Id delete" + idDelete)

    console.log("wyswietl plik aktualny")
    console.log(fileContent)
    fileContent.forEach(element => {
        if(element.trid != idDelete){
            console.log("Zostaw w alertach" + element.trid)
            tmp.push(element)
        } 
    });
    console.log(tmp)

    fs.writeFileSync(filePath, JSON.stringify(tmp), null, 2)
    fs.writeFileSync('./config/alerts2.json', JSON.stringify(fileContent), null, 2)
    resp.json({redirect: '/'})
}


//alert_getAll()
module.exports = {
    alert_delete,
    alert_create,
    alert_getAll
}