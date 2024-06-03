const express = require('express');
const router = express.Router();
const transaksiController = require('../Controller/transaksiController');

router.get('/', transaksiController.getAllTransaksi);
router.get('/:id', transaksiController.getTransaksiById);
router.post('/', transaksiController.createTransaksi);
router.put('/:id', transaksiController.updateTransaksi);
router.delete('/:id', transaksiController.deleteTransaksi);

module.exports = router;
