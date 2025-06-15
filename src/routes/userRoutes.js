const express = require("express");
const router = express.Router();
const {
  registerUser,
  checkUserExists,
  getUserByEmail,
  getAllUsers,
} = require("../controller/userController");

const { validate, registerSchema } = require("../middleware/joiValidator");

router.post("/register", validate(registerSchema), registerUser);
router.post("/checkUserExists", checkUserExists);
router.get("/users", getAllUsers); // 🔐 protected
router.get("/user", getUserByEmail); // 🔐 protected

module.exports = router;
