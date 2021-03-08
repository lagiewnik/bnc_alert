const { response } = require('express')
const express = require('express')
const alertRoutes = require('./routes/connectRoutes')
var bodyParser = require('body-parser'); 


const app = express()
//register view engine:
app.set('view engine', 'ejs')
app.set('views', 'views')

//midddleware for static files
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))

app.listen(process.env.PORT||3000)
// app.use( (req, resp) => {
//     resp.render('AlertGenerator')
// })

app.use('/', alertRoutes)
    