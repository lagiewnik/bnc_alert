const express = require('express')
const router = express.Router()
const alertController = require('../controllers/alertController')
let bodyParser = require('body-parser');

router.use(bodyParser.json());

console.log("router exec")
//alert routes #TODO
router.post('/:id', alertController.alert_create)
router.delete('/:id', alertController.alert_delete )
router.get('/',alertController.alert_getAll)


module.exports = router;
