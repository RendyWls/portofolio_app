const mongoose = require("mongoose");

const transaksiSchema = new mongoose.Schema({
  akunId: { type: mongoose.Schema.Types.ObjectId, ref: "Akun", required: true },
  jumlah: { type: Number, required: true },
  kategori: { type: String, required: true },
  jenis: { type: String, enum: ["pendapatan", "pengeluaran"], required: true },
  tanggal: { type: Date, default: Date.now },
  saldoAkhir: { type: Number },
});

module.exports = mongoose.model("Transaksi", transaksiSchema);
