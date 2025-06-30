const Transaksi = require("../models/transaksiModel");
const Akun = require("../models/akunModel");

exports.createTransaksi = async (req, res) => {
  const { akunId, jumlah, kategori, jenis, tanggal } = req.body;

  try {
    const akun = await Akun.findById(akunId);
    if (!akun) return res.status(404).json({ message: "Akun tidak ditemukan." });

    const transaksi = new Transaksi({ akunId, jumlah, kategori, jenis, tanggal });
    await transaksi.save();

    // Update saldo akun
    if (jenis === "pendapatan") {
      akun.saldoAwal += jumlah;
    } else if (jenis === "pengeluaran") {
      akun.saldoAwal -= jumlah;
    }

    await akun.save();

    res.status(201).json({ message: "Transaksi berhasil disimpan dan saldo diperbarui.", transaksi });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menyimpan transaksi." });
  }
};
