const express = require("express");
const router = express.Router();
const {
  registerUser,
  checkUserExists,
  getUserByEmail,
  getAllUsers,
} = require("../controller/userController");

router.post("/register", registerUser);
router.post("/checkUserExists", checkUserExists);
router.get("/users", getAllUsers); // 🔐 protected
router.get("/user", getUserByEmail); // 🔐 protected

module.exports = router;
