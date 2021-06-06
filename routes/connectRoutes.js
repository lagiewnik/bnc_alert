const express = require('express')
const router = express.Router()
const alertController = require('../controllers/alertController')

let bodyParser = require('body-parser');

router.use(bodyParser.json());

console.log("router exec")
//alert routes #TODO
router.post('/:id', alertController.alert_create)
router.post('/signals/:symbol',alertController.add_observed_symbol)
router.delete('/:id', alertController.alert_delete )
router.delete('/signalsobserved/:symbol',alertController.signal_observed_delete)
router.get('/',alertController.alert_getAll)
router.get('/signalsobserved',alertController.signal_getObserved)
router.get('/signals',alertController.signal_getAll)
router.get('/arbitration', alertController.arbitration)
router.get('/mmdall', alertController.mmdall)



module.exports = router;
