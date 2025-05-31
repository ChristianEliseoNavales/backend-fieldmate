const otpSchema = require("../models/otpSchema.js");
const crypto = require("crypto");

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await otpSchema.findOne({ email });
    if (!record) return res.status(400).json({ message: "OTP not found" });

    // Check expiration
    const now = new Date();
    const otpAge = (now - record.createdAt) / 1000;
    if (otpAge > 300) return res.status(400).json({ message: "OTP expired" });

    // Check max attempts
    // Check if attempts are maxed and not yet expired
    if (record.attempts >= 3) {
      const ageSeconds = (Date.now() - record.createdAt) / 1000;
      if (ageSeconds < 600) { // 10-minute lockout
        return res.status(403).json({ message: "Too many attempts. Try again later." });
      } else {
        // Reset if 10 minutes passed
        await otpSchema.updateOne({ email }, { attempts: 0 });
      }
    }


    // Compare hashed OTP
    const hashedInput = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashedInput !== record.otp) {
      await otpSchema.updateOne({ email }, { $inc: { attempts: 1 } });
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    // Success ✅
    await otpSchema.deleteOne({ email }); // Optional: delete after use
    res.status(200).json({ message: "OTP verified" });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: "Server error during verification" });
  }
};

module.exports = { verifyOtp };
