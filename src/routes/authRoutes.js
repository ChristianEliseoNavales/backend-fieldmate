const express = require("express");
const { sendOtp } = require("../controller/sendOtp.js");
const { verifyOtp } = require("../controller/verifyOtp.js");
const { resetPassword } = require("../controller/resetPassword.js");

const router = express.Router();

router.post("/auth/request-otp", sendOtp);
router.post("/auth/verify-otp", verifyOtp);
router.post("/auth/reset-password", resetPassword);

module.exports = router;
