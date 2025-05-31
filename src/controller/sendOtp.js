const { sendEmail } = require("../utils/mailer.js");
const otpSchema = require("../models/otpSchema.js");
const crypto = require("crypto");

const sendOtp = async (req, res) => {
  const { email } = req.body;

  // ✅ Generate OTP first
  const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Hash the OTP
    const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex");

    // Save or update OTP entry
    await otpSchema.findOneAndUpdate(
      { email },
      {
        otp: hashedOtp,
        attempts: 0,
        createdAt: new Date(),
      },
      { upsert: true }
    );

    // ✅ Now send the plain (unhashed) OTP via email
    await sendEmail(email, "Fieldmate (Forgot Password)", rawOtp);

    res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    console.error("Failed to send OTP:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

module.exports = { sendOtp };
