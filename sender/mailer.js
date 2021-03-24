var nodemailer = require("nodemailer");
require('dotenv').config()

// Use Smtp Protocol to send Email
var smtpTransport = nodemailer.createTransport({
    host: process.env.SENDER_HOST,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SENDER_USER, // generated ethereal user
      pass: process.env.SENDER_PSWD // generated ethereal password
    },
  });

var mail = {
    from: process.env.SENDER_USER,
    to: process.env.EMAIL_RECEIVER,
    subject: "",
    text: "",
    html: ""
}

function fillTemplate(param) {
    switch (param.conditional) {
        case 'Greater Than': 
        mail.subject= param.symbol + " Cena wzrosła powyżej: " + param.price1 + ". Cena aktualna: " + param.currentPrice
        mail.text= param.symbol + " Cena wzrosła powyżej: " + param.price1 + ". Cena aktualna: " + param.currentPrice
        break

        case 'Less Than':
            mail.subject= param.symbol + " Cena spadła poniżej: " + param.price1 + ". Cena aktualna: " + param.currentPrice
            mail.text= param.symbol + "  Cena spadła poniżej: " + param.price1 + ". Cena aktualna: " + param.currentPrice
        break
        case 'Inside Channel':
            mail.subject= param.symbol + " Cena weszła w zakres: " + param.price1 + " i " + param.price2 +". Cena aktualna: " + param.currentPrice
            mail.text= param.symbol + " Cena weszła w zakres: " + param.price1 + " i " + param.price2 +". Cena aktualna: " + param.currentPrice
        break
        case 'Outside Channel':
            mail.subject= param.symbol + " Cena poza zakresem: " + param.price1 + " i " + param.price2 +". Cena aktualna: " + param.currentPrice
            mail.text= param.symbol + " Cena poza zakresem: " + param.price1 + " i " + param.price2 +". Cena aktualna: " + param.currentPrice
        break
        default:
                console.log("Nieprawidłowwa wartość wyboru rodzaju filtra")
    }
}



function sendEmail(param) {
    
    fillTemplate(param)
    smtpTransport.sendMail(mail, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
    
        smtpTransport.close();
    });
}


module.exports = {
    sendEmail
}