// server/app.js
require("dotenv").config({ path: __dirname + "/.env" });
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const path = require("path");
app.use(express.static(path.join(__dirname, "..")));

// Koneksi MongoDB
console.log("MONGO_URI =", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const akunRoutes = require("./routes/akun");
app.use("/api/akun", akunRoutes);

const transaksiRoutes = require("./routes/transaksi");
app.use("/api/transaksi", transaksiRoutes);
