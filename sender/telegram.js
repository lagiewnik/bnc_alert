const { Telegraf } = require('telegraf')
const fs = require('fs')
require('dotenv').config()

var msgText = ""
function fillTemplate(param) {
    switch (param.conditional) {
        case 'Greater Than': 
        msgText= param.symbol + " Cena wzrosła powyżej: " + param.price1 + ". Cena aktualna: " + param.currentPrice
        
        break

        case 'Less Than':
            msgText= param.symbol + " Cena spadła poniżej: " + param.price1 + ". Cena aktualna: " + param.currentPrice
           
        break
        case 'Inside Channel':
            msgText= param.symbol + " Cena weszła w zakres: " + param.price1 + " i " + param.price2 +". Cena aktualna: " + param.currentPrice
        break
        case 'Outside Channel':
            msgText= param.symbol + " Cena poza zakresem: " + param.price1 + " i " + param.price2 +". Cena aktualna: " + param.currentPrice
        break
        default:
                console.log("Nieprawidłowwa wartość wyboru rodzaju filtra")
    }
}

function sendTelegramMsg(option) {
    
    fillTemplate(option)
    
    console.log("bot token:" + process.env.BOT_TOKEN)
    const bot = new Telegraf(process.env.BOT_TOKEN)
    bot.telegram.sendMessage(process.env.TELEGRAM_CHANNEL_ID, msgText)
}

//sendTelegramMsg({"price1":"PLN12333"})
module.exports = {
    sendTelegramMsg
}