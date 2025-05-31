const otpSchema = require("../models/otpSchema.js");
const admin = require("../config/firebase-admin.js"); // ✅ Correct import


const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  console.log("Reset password for:", email);

  try {
    const user = await admin.auth().getUserByEmail(email);
    console.log("Firebase UID found:", user.uid);

    await admin.auth().updateUser(user.uid, { password: newPassword });
    console.log("Password updated");

    // Clean up OTP
    await otpSchema.deleteOne({ email });
    console.log("OTP entry deleted");

    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.error("❌ Reset password failed:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

module.exports = { resetPassword };
