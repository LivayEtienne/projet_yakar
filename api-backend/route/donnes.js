const express = require('express');
const router = express.Router();


const stuffCtrl = require('../controller/donnes');

router.get('/', stuffCtrl.getAllDonnes );
router.post('/',  stuffCtrl.createDonne);
router.get('/:id',  stuffCtrl.getOneDonne);
router.put('/:id',  stuffCtrl.modifyDonne);
router.delete('/:id',  stuffCtrl.deleteDonne);


module.exports = router;


