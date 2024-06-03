const { Transaksi, TransaksiDetail } = require('../Models/transaksiModel');
const { Kost, detailKost } = require('../Models/kostModel');
const jwt = require('jsonwebtoken');
const midtransClient = require('midtrans-client');
const User = require('../Models/userModel');
require('dotenv').config();

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

const createTransaksi = async (req, res) => {
  const { id_kost } = req.body;

  const getKost = await Kost.findOne({ where: { id: id_kost } });
  const detail = await detailKost.findOne({ where: { id_kost } });
  const pemilik = await User.findOne({ where: { id: getKost.id_user } });

  const total = detail.harga_sewa;
  const name = 'fian';
  const email = 'fian@gmail.com';
  const transaction_id = Date.now();
  const payload = {
    transaction_details: {
      order_id: transaction_id,
      gross_amount: total,
    },
    item_details: [
      {
        id: id_kost,
        price: detail.harga_sewa,
        quantity: 1,
        name: getKost.nama_kost,
        category: detail.tipe_kost,
        merchant_name: pemilik.fullname,
      },
    ],
    customer_detail: {
      first_name: name,
      email: email,
    },
  };

  const token = await snap.createTransactionRedirectUrl(payload);
  return res.status(200).json({ token });
};

module.exports = {
  createTransaksi,
};
