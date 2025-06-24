const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true, minlength: 6 },
  dateOfBirth: { type: Date, required: true },
  passwordHash: { type: String, required: true },

  // Tambahan untuk reset password
  resetToken: { type: String },
  resetTokenExpiry: { type: Number }, // gunakan timestamp (Date.now())
});

module.exports = mongoose.model("User", userSchema);
