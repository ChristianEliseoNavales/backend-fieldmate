const express = require("express");
const router = express.Router();
const {
  getAllCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
} = require("../controller/companyController");

const authenticate = require("../middleware/authMiddleware");

router.get("/companies", getAllCompanies);
router.post("/companies", authenticate, addCompany);
router.patch("/companies/:id", authenticate, updateCompany);
router.delete("/companies/:id", authenticate, deleteCompany);

module.exports = router;
