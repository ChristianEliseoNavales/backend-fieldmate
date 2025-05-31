const express = require("express");
const router = express.Router();
const {
  getAllCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
} = require("../controller/companyController");

router.get("/companies", getAllCompanies);
router.post("/companies", addCompany);
router.patch("/companies/:id", updateCompany);
router.delete("/companies/:id", deleteCompany);

module.exports = router;
