const express = require("express");
const router = express.Router();
const Transaksi = require("../models/transaksiModel");
const Akun = require("../models/akunModel");

router.get("/", async (req, res) => {
  try {
    const transaksi = await Transaksi.find().populate("akunId", "namaAkun");
    res.json(transaksi);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil transaksi." });
  }
});

// Buat transaksi baru
router.post("/", async (req, res) => {
  const { akunId, jumlah, kategori, jenis, tanggal } = req.body;

  if (!akunId || !jumlah || !kategori || !jenis) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  try {
    const akun = await Akun.findById(akunId);
    if (!akun) return res.status(404).json({ message: "Akun tidak ditemukan." });

    // Hitung saldo akhir terlebih dahulu
    let saldoAkhir = akun.saldoAwal;

    if (jenis === "pendapatan") {
      saldoAkhir += jumlah;
    } else if (jenis === "pengeluaran") {
      saldoAkhir -= jumlah;
    }

    // Simpan transaksi
    const transaksi = new Transaksi({
      akunId,
      jumlah,
      kategori,
      jenis,
      tanggal,
      saldoAkhir,
    });
    await transaksi.save();

    // Update saldo akun
    akun.saldoAwal = saldoAkhir;
    await akun.save();

    res.status(201).json({ message: "Transaksi berhasil dicatat.", transaksi });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mencatat transaksi." });
  }
});

module.exports = router;
