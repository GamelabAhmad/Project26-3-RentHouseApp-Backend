const express = require('express');
const transaksiController = require('../Controller/transaksiController');
const verify = require('../middleware/verify');
const router = express.Router();

router.post('/', transaksiController.createTransaksi);

module.exports = router;
