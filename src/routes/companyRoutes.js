const express = require("express");
const router = express.Router();
const {
  getAllCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
  deleteAllCompanies,
  checkCompanyReferences,
  getCompaniesWithReferences,
} = require("../controller/companyController");

const authenticate = require("../middleware/authMiddleware");

router.get("/companies", getAllCompanies);
router.get("/companies/with-references", getCompaniesWithReferences);
router.get("/companies/:companyName/references", checkCompanyReferences);
router.post("/companies", authenticate, addCompany);
router.patch("/companies/:id", authenticate, updateCompany);
router.delete("/companies/deleteAll",authenticate, deleteAllCompanies);
router.delete("/companies/:id", authenticate, deleteCompany);

module.exports = router;
