// server/models/akunModel.js
const mongoose = require("mongoose");

const akunSchema = new mongoose.Schema({
  namaAkun: { type: String, required: true },
  saldoAwal: { type: Number, required: true }, // tanpa immutable
});

module.exports = mongoose.model("Akun", akunSchema);
