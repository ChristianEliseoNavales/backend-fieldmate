const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true }, // Will store hashed OTP
  createdAt: { type: Date, default: Date.now },
  attempts: { type: Number, default: 0 }, // Track failed attempts
});

module.exports = mongoose.models.Otp || mongoose.model("Otp", otpSchema);
