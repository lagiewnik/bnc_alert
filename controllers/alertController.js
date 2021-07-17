const { json } = require('body-parser');
var fs = require('fs');
const { toNamespacedPath } = require('path');
const filePath = './config/alerts.json';
const Promise = require('bluebird')

const mysqlcon = require('../db/mysqldao.js')
const mysqlsignal = require('../db/mysqlichimoku.js')
const mysqlmmd = require('../db/mysqlmmd.js')

const arbitration = (req, resp) => {
    try {resp.render("ArbitrageView")} 
    catch (err) {
    //console.log(err)
    // handle your file not found (or other error) here
}
const add_ebserved_symbol = (req, resp) => {

}

}
const alert_getAll = (req, resp) => {
    // const alerts_repo = new AlertsRepo(dao)
    var data;
    var datadb;

  
    //console.log("alerty z DB pobranie:")
    //console.log(datadb)
    //z mysql
    try {
            mysqlcon.getAll().then(dbd=>{datadb=dbd;
            resp.render("AlertGenerator", {alerts: datadb})
            //console.log("Po promisie")
            //console.log(datadb)
        });
    } catch (err) {
        console.log(err)
        // handle your file not found (or other error) here
    }

    //console.log("alerty z DB pobranie:")
    //console.log(datadb)
    //resp.render("AlertGenerator", {alerts: data})
}

const alert_create = (req, resp) => {
    // const alerts_repo = new AlertsRepo(dao)
    //console.log("create exec")
    //console.log(req.body)
    // var fileContent
    // try {
    //     fileContent = JSON.parse(fs.readFileSync(filePath));
    // } catch (err) {
    //     //console.log("JSON parse")
    //     //console.log(err)
    //     // handle your file not found (or other error) here
    // }
    // //console.log(fileContent)
    // fileContent.push(req.body)
    // //console.log(fileContent)

    //fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2))
    //alerts_repo.create(req.body).then(status=>//console.log(status))
    mysqlcon.create(req.body).then(status=>console.log(status))
    resp.json({redirect: '/'})
}

const add_observed_symbol = (req, resp) => {
    // const alerts_repo = new AlertsRepo(dao)
    //console.log("observed symbol adding exec")
    //console.log(req.headers.referer)
    // var fileContent
    // try {
    //     fileContent = JSON.parse(fs.readFileSync(filePath));
    // } catch (err) {
    //     //console.log("JSON parse")
    //     //console.log(err)
    //     // handle your file not found (or other error) here
    // }
    // //console.log(fileContent)
    // fileContent.push(req.body)
    // //console.log(fileContent)

    //fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2))
    //alerts_repo.create(req.body).then(status=>//console.log(status))
    mysqlcon.create_observed_symbol(req.body.symbol).then(status=>console.log(status))
    //resp.redirect(req.headers.referer);
    resp.json({redirect: req.headers.referer})
}

const alert_delete = (req, resp) => {
    ////console.log(req)
    //const data;
    // const alerts_repo = new AlertsRepo(dao)
    var fileContent 
    const idDelete = req.params.id
    // try {
    //     fileContent = JSON.parse(fs.readFileSync(filePath));
    // } catch (err) {
    //     //console.log("JSON parse")
    //     //console.log(err)
    //     // handle your file not found (or other error) here
    // }
    // var tmp = []
    // //console.log("Id delete" + idDelete)

    // //console.log("wyswietl plik aktualny")
    // //console.log(fileContent)
    // fileContent.forEach(element => {
    //     if(element.trid != idDelete){
    //         //console.log("Zostaw w alertach" + element.trid)
    //         tmp.push(element)
    //     } 
    // });
    // //console.log(tmp)
    // try {
    //     alerts_repo.delete(idDelete).then(dbd=>{
    //         //console.log(dbd)
    //         resp.json({redirect: '/'})
    //     });
    // } catch (err) {
    //     //console.log(err)
    //     // handle your file not found (or other error) here
    // }

    try {
            mysqlcon.deleteRow(idDelete).then(dbd=>{
            //console.log(dbd)
            resp.json({redirect: '/'})
        });
    } catch (err) {
        //console.log(err)
        // handle your file not found (or other error) here
    }
    // fs.writeFileSync(filePath, JSON.stringify(tmp), null, 2)
    // fs.writeFileSync('./config/alerts2.json', JSON.stringify(fileContent), null, 2)
    //resp.json({redirect: '/'})
}

const signal_observed_delete = (req, resp) => {
    
    var fileContent 
    const symbol = req.params.symbol
    

    try {
            mysqlsignal.deleteSignalObserved(symbol).then(dbd=>{
            //console.log(dbd)
            resp.json({redirect: req.headers.referer})
        });
    } catch (err) {
        //console.log(err)
        // handle your file not found (or other error) here
    }
    
}

const signals_getAll = (req, resp) => {
    
    // const alerts_repo = new AlertsRepo(dao)
    const fileContent = fs.readFileSync(__dirname+"/signalresources.json");
    const iconFolder = "signalicon/64/"
    const signalresources = JSON.parse(fileContent);
    ////console.log(signalresources)
    var data;
    mysqlsignal.getLastAllSignals().then(data => {
        ////console.log(data)
        data.sort(function (a, b) {
            if (a.buyScore > b.buyScore) {
                return -1;
            }
            if (a.buyScore < b.buyScore) {
                return 1;
            }
            return 0;
        }
        )
        let webdata = []
        data.map(function (d) {
            const CrossTenkanKijun_img_id = d.CrossTenkanKijun
            const crossVSKumo_img_id = d.crossVSKumo
            const m = new Date(d.startTime + 7200000 )
            const mstop = new Date(d.stopTime + 7200000)
            const msend = new Date(d.SendDate + 14400000)
            webdata.push({
                "button_function":d.observed=='1'?"delete":"add",
                "symbol":d.symbol,
                "period":d.period,
                "startTime":m.toISOString("pl-PL").slice(0,-5).replace("T"," "),
                "stopTime":mstop.toISOString("pl-PL").slice(0,-5).replace("T"," "),
                "CrossTenkanKijun":d.CrossTenkanKijun,
                "CrossTenkanKijun_img":signalresources.CrossTenkanKijun.hasOwnProperty(CrossTenkanKijun_img_id) ? iconFolder+signalresources.CrossTenkanKijun[CrossTenkanKijun_img_id]["img"]:"",
                "crossVSKumo":d.crossVSKumo,
                "crossVSKumo_img":signalresources.crossVSKumo.hasOwnProperty(crossVSKumo_img_id) ? iconFolder+signalresources.crossVSKumo[crossVSKumo_img_id]["img"]:"",
                "CrossPriceKijun":d.CrossPriceKijun,
                "CrossPriceKijun_img":signalresources.crossVSKumo.hasOwnProperty(d.CrossPriceKijun) ? iconFolder+signalresources.CrossPriceKijun[d.CrossPriceKijun]["img"]:"",
                "crossPriceChikou":d.crossPriceChikou,
                "crossPriceChikou_img":signalresources.crossPriceChikou.hasOwnProperty(d.crossPriceChikou) ? iconFolder+signalresources.crossPriceChikou[d.crossPriceChikou]["img"]:"",
                "kumoColor":d.kumoColor,
                "kumoColor_img":signalresources.kumoColor.hasOwnProperty(d.kumoColor) ? iconFolder+signalresources.kumoColor[d.kumoColor]["img"]:"",
                "priceVsKumo":d.priceVsKumo,
                "priceVsKumo_img":signalresources.priceVsKumo.hasOwnProperty(d.priceVsKumo) ? iconFolder+signalresources.priceVsKumo[d.priceVsKumo]["img"]:"",
                "Signal3Line":d.Signal3Line,
                "Signal3Line_img":signalresources.Signal3Line.hasOwnProperty(d.Signal3Line) ? iconFolder+signalresources.Signal3Line[d.Signal3Line]["img"]:"",
                "ChikouSpanVsPrice":d.ChikouSpanVsPrice,
                "ChikouSpanVsPrice_img":signalresources.ChikouSpanVsPrice.hasOwnProperty(d.ChikouSpanVsPrice) ? iconFolder+signalresources.ChikouSpanVsPrice[d.ChikouSpanVsPrice]["img"]:"",
                "buyScore":d.buyScore,
                "sellScore":d.sellScore,
                "sendDate":msend.toISOString("pl-PL").slice(0,-5).replace("T"," "),
                "FastVsShortMMD":d.FastVsShortMMD,
                "FastVsMiddleMMD":d.FastVsMiddleMMD,
                "ShortVsMiddleMMD":d.ShortVsMiddleMMD,
                "mmdBuyScore":d.mmdBuyScore,
                "mmdSellScore":d.mmdSellScore,
                "sendDateMMD":msend.toISOString("pl-PL").slice(0,-5).replace("T"," "),
                "stochRSI":d.stochRSI
            })
         })
         ////console.log(webdata)
        resp.render("AllView",{signals: webdata, observedsymbols: []})
    });
    
}


const ichimoku_getAll = (req, resp) => {
    
    // const alerts_repo = new AlertsRepo(dao)
    const fileContent = fs.readFileSync(__dirname+"/signalresources.json");
    const iconFolder = "signalicon/64/"
    const signalresources = JSON.parse(fileContent);
    ////console.log(signalresources)
    var data;
    mysqlsignal.getLastSignals().then(data => {
        ////console.log(data)
        data.sort(function (a, b) {
            if (a.buyScore > b.buyScore) {
                return -1;
            }
            if (a.buyScore < b.buyScore) {
                return 1;
            }
            return 0;
        }
        )
        let webdata = []
        data.map(function (d) {
            const CrossTenkanKijun_img_id = d.CrossTenkanKijun
            const crossVSKumo_img_id = d.crossVSKumo
            const m = new Date(d.startTime + 7200000 )
            const mstop = new Date(d.stopTime + 7200000)
            const msend = new Date(d.SendDate + 14400000)
            webdata.push({
                "button_function":"add",
                "symbol":d.symbol,
                "period":d.period,
                "startTime":m.toISOString("pl-PL").slice(0,-5).replace("T"," "),
                "stopTime":mstop.toISOString("pl-PL").slice(0,-5).replace("T"," "),
                "CrossTenkanKijun":d.CrossTenkanKijun,
                "CrossTenkanKijun_img":signalresources.CrossTenkanKijun.hasOwnProperty(CrossTenkanKijun_img_id) ? iconFolder+signalresources.CrossTenkanKijun[CrossTenkanKijun_img_id]["img"]:"",
                "crossVSKumo":d.crossVSKumo,
                "crossVSKumo_img":signalresources.crossVSKumo.hasOwnProperty(crossVSKumo_img_id) ? iconFolder+signalresources.crossVSKumo[crossVSKumo_img_id]["img"]:"",
                "CrossPriceKijun":d.CrossPriceKijun,
                "CrossPriceKijun_img":signalresources.crossVSKumo.hasOwnProperty(d.CrossPriceKijun) ? iconFolder+signalresources.CrossPriceKijun[d.CrossPriceKijun]["img"]:"",
                "crossPriceChikou":d.crossPriceChikou,
                "crossPriceChikou_img":signalresources.crossPriceChikou.hasOwnProperty(d.crossPriceChikou) ? iconFolder+signalresources.crossPriceChikou[d.crossPriceChikou]["img"]:"",
                "kumoColor":d.kumoColor,
                "kumoColor_img":signalresources.kumoColor.hasOwnProperty(d.kumoColor) ? iconFolder+signalresources.kumoColor[d.kumoColor]["img"]:"",
                "priceVsKumo":d.priceVsKumo,
                "priceVsKumo_img":signalresources.priceVsKumo.hasOwnProperty(d.priceVsKumo) ? iconFolder+signalresources.priceVsKumo[d.priceVsKumo]["img"]:"",
                "Signal3Line":d.Signal3Line,
                "Signal3Line_img":signalresources.Signal3Line.hasOwnProperty(d.Signal3Line) ? iconFolder+signalresources.Signal3Line[d.Signal3Line]["img"]:"",
                "ChikouSpanVsPrice":d.ChikouSpanVsPrice,
                "ChikouSpanVsPrice_img":signalresources.ChikouSpanVsPrice.hasOwnProperty(d.ChikouSpanVsPrice) ? iconFolder+signalresources.ChikouSpanVsPrice[d.ChikouSpanVsPrice]["img"]:"",
                "buyScore":d.buyScore,
                "sellScore":d.sellScore,
                "sendDate":msend.toISOString("pl-PL").slice(0,-5).replace("T"," "),
                "stochRSI":d.stochRSI
            })
         })
         ////console.log(webdata)
        resp.render("IchimokuView",{signals: webdata, observedsymbols: []})
    });
    // //console.log("sygnały z DB pobranie:")
    ////console.log(datadb)
    //z mysql
    //resp.render("IchimokuView",{signals: datadb})
    // try {
    //         mysqlcon.getAll().then(dbd=>{datadb=dbd;
    //         resp.render("AlertGenerator", {alerts: datadb})
    //         //console.log("Po promisie")
    //         //console.log(datadb)});
    // } catch (err) {
    //     //console.log(err)
    //     // handle your file not found (or other error) here
    // }

    // //console.log("alerty z DB pobranie:")
    // //console.log(datadb)
    //resp.render("AlertGenerator", {alerts: data})
}

const mmdall = (req, resp) => {
    
    // const alerts_repo = new AlertsRepo(dao)
    const fileContent = fs.readFileSync(__dirname+"/signalresources.json");
    const iconFolder = "signalicon/64/"
    const signalresources = JSON.parse(fileContent);
    ////console.log(signalresources)
    var data;
  
    mysqlmmd.getLastSignals().then(data => {
        ////console.log(data)
        data.sort(function (a, b) {
            if (a.mmdBuyScore > b.mmdBuyScore) {
                return -1;
            }
            if (a.mmdBuyScore < b.mmdBuyScore) {
                return 1;
            }
            return 0;
        }
        )
        let webdata = []
        data.map(function (d) {
            //console.log(d)
            const CrossTenkanKijun_img_id = d.CrossTenkanKijun
            const crossVSKumo_img_id = d.crossVSKumo
            const m = new Date(d.startTime + 7200000 )
            const mstop = new Date(d.stopTime + 7200000)
            const msend = new Date(d.SendDateMMD + 14400000)
            webdata.push({
                "button_function":"add",
                "symbol":d.symbol,
                "period":d.period,
                "startTime":m.toISOString("pl-PL").slice(0,-5).replace("T"," "),
                "stopTime":mstop.toISOString("pl-PL").slice(0,-5).replace("T"," "),
                "FastVsShortMMD":d.FastVsShortMMD,
                "FastVsMiddleMMD":d.FastVsMiddleMMD,
                "ShortVsMiddleMMD":d.ShortVsMiddleMMD,
                "mmdBuyScore":d.mmdBuyScore,
                "mmdSellScore":d.mmdSellScore,
                "sendDateMMD":msend.toISOString("pl-PL").slice(0,-5).replace("T"," "),
                "stochRSI":d.stochRSI
            })
         })
         //console.log(webdata)
         
        resp.render("MmdView",{signals: webdata, observedsymbols: []})
    });
    
}

const mmd_observed = (req, resp, ) => {
    
    // const alerts_repo = new AlertsRepo(dao)
    const fileContent = fs.readFileSync(__dirname+"/signalresources.json");
    const iconFolder = "signalicon/64/"
    const signalresources = JSON.parse(fileContent);
    ////console.log(signalresources)
    var data;
    var datadb = [{ "symbol": "DOGEUSDT", "period": "4h", "BuyScore": 4, "SellScore": 1 }];
    mysqlmmd.getLastObservedSignals().then(data => {
        ////console.log(data)
        data.sort(function (a, b) {
            if (a.mmdBuyScore > b.mmdBuyScore) {
                return -1;
            }
            if (a.mmdBuyScore < b.mmdBuyScore) {
                return 1;
            }
            return 0;
        }
        )
        let webdata = []
        data.map(function (d) {
            const CrossTenkanKijun_img_id = d.CrossTenkanKijun
            const crossVSKumo_img_id = d.crossVSKumo
            const m = new Date(d.startTime + 7200000 )
            const mstop = new Date(d.stopTime + 7200000)
            const msend = new Date(d.SendDateMMD + 14400000)
            webdata.push({
                "button_function":"delete",
                "symbol":d.symbol,
                "period":d.period,
                "startTime":m.toISOString("pl-PL").slice(0,-5).replace("T"," "),
                "stopTime":mstop.toISOString("pl-PL").slice(0,-5).replace("T"," "),
                "FastVsShortMMD":d.FastVsShortMMD,
                "FastVsMiddleMMD":d.FastVsMiddleMMD,
                "ShortVsMiddleMMD":d.ShortVsMiddleMMD,
                "mmdBuyScore":d.mmdBuyScore,
                "mmdSellScore":d.mmdSellScore,
                "sendDateMMD":msend.toISOString("pl-PL").slice(0,-5).replace("T"," "),
                "stochRSI":d.stochRSI
            })
         })
         ////console.log(webdata)
        resp.render("MmdView",{signals: webdata, observedsymbols: []})
    });
    
}

const ichimoku_getObserved = async (req, resp) => {
    
    // const alerts_repo = new AlertsRepo(dao)
    const fileContent = fs.readFileSync(__dirname+"/signalresources.json");
    const iconFolder = "signalicon/64/"
    const signalresources = JSON.parse(fileContent);
    ////console.log(signalresources)
    var dataasync = mysqlsignal.getLastObservedSignals()
    var symbolasync = mysqlcon.getObservedSymbols()
    var data = await dataasync
    var observedsymbols = await symbolasync
    //console.log(observedsymbols)
        ////console.log(data)
        data.sort(function (a, b) {
            if (a.buyScore > b.buyScore) {
                return -1;
            }
            if (a.buyScore < b.buyScore) {
                return 1;
            }
            return 0;
        }
        )
        let webdata = []
        data.map(function (d) {
            const CrossTenkanKijun_img_id = d.CrossTenkanKijun
            const crossVSKumo_img_id = d.crossVSKumo
            const m = new Date(d.startTime + 7200000 )
            const mstop = new Date(d.stopTime + 7200000)
            const msend = new Date(d.SendDate + 14400000)
            webdata.push({
                "button_function":"delete",
                "symbol":d.symbol,
                "period":d.period,
                "startTime":m.toISOString("pl-PL").slice(0,-5).replace("T"," "),
                "stopTime":mstop.toISOString("pl-PL").slice(0,-5).replace("T"," "),
                "CrossTenkanKijun":d.CrossTenkanKijun,
                "CrossTenkanKijun_img":signalresources.CrossTenkanKijun.hasOwnProperty(CrossTenkanKijun_img_id) ? iconFolder+signalresources.CrossTenkanKijun[CrossTenkanKijun_img_id]["img"]:"",
                "crossVSKumo":d.crossVSKumo,
                "crossVSKumo_img":signalresources.crossVSKumo.hasOwnProperty(crossVSKumo_img_id) ? iconFolder+signalresources.crossVSKumo[crossVSKumo_img_id]["img"]:"",
                "CrossPriceKijun":d.CrossPriceKijun,
                "CrossPriceKijun_img":signalresources.crossVSKumo.hasOwnProperty(d.CrossPriceKijun) ? iconFolder+signalresources.CrossPriceKijun[d.CrossPriceKijun]["img"]:"",
                "crossPriceChikou":d.crossPriceChikou,
                "crossPriceChikou_img":signalresources.crossPriceChikou.hasOwnProperty(d.crossPriceChikou) ? iconFolder+signalresources.crossPriceChikou[d.crossPriceChikou]["img"]:"",
                "kumoColor":d.kumoColor,
                "kumoColor_img":signalresources.kumoColor.hasOwnProperty(d.kumoColor) ? iconFolder+signalresources.kumoColor[d.kumoColor]["img"]:"",
                "priceVsKumo":d.priceVsKumo,
                "priceVsKumo_img":signalresources.priceVsKumo.hasOwnProperty(d.priceVsKumo) ? iconFolder+signalresources.priceVsKumo[d.priceVsKumo]["img"]:"",
                "Signal3Line":d.Signal3Line,
                "Signal3Line_img":signalresources.Signal3Line.hasOwnProperty(d.Signal3Line) ? iconFolder+signalresources.Signal3Line[d.Signal3Line]["img"]:"",
                "ChikouSpanVsPrice":d.ChikouSpanVsPrice,
                "ChikouSpanVsPrice_img":signalresources.ChikouSpanVsPrice.hasOwnProperty(d.ChikouSpanVsPrice) ? iconFolder+signalresources.ChikouSpanVsPrice[d.ChikouSpanVsPrice]["img"]:"",
                "buyScore":d.buyScore,
                "sellScore":d.sellScore,
                "sendDate":msend.toISOString("pl-PL").slice(0,-5).replace("T"," "),
                "stochRSI":d.stochRSI
            })
         })
        //console.log(observedsymbols)
        resp.render("IchimokuView",{signals: webdata, observedsymbols: observedsymbols})
    };
    // //console.log("sygnały z DB pobranie:")
    ////console.log(datadb)
    //z mysql
    //resp.render("IchimokuView",{signals: datadb})
    // try {
    //         mysqlcon.getAll().then(dbd=>{datadb=dbd;
    //         resp.render("AlertGenerator", {alerts: datadb})
    //         //console.log("Po promisie")
    //         //console.log(datadb)});
    // } catch (err) {
    //     //console.log(err)
    //     // handle your file not found (or other error) here
    // }

    // //console.log("alerty z DB pobranie:")
    // //console.log(datadb)
    //resp.render("AlertGenerator", {alerts: data})


//ichimoku_getAll()
//alert_getAll()
module.exports = {
    alert_delete,
    alert_create,
    alert_getAll,
    ichimoku_getAll,
    ichimoku_getObserved,
    arbitration,
    add_observed_symbol,
    signal_observed_delete,
    mmdall,
    mmd_observed,
    signals_getAll
}