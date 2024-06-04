const express = require('express');
const router = express.Router();
const transaksiController = require('../Controller/transaksiController');

router.get('/', transaksiController.getAllTransaksiPending);
router.get('/:id', transaksiController.getTransaksiByIdUser);
router.post('/', transaksiController.createTransaksi);
router.put('/:id', transaksiController.updateTransaksi);

module.exports = router;
