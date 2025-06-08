const Company = require("../models/companySchema");

// GET all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching companies." });
  }
};

// POST add new company
exports.addCompany = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Company name is required." });

  try {
    const existing = await Company.findOne({ name });
    if (existing) return res.status(409).json({ message: "Company already exists." });

    const newCompany = await Company.create({ name });
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(500).json({ message: "Failed to add company." });
  }
};

// PATCH update company
exports.updateCompany = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updated = await Company.findByIdAndUpdate(id, { name }, { new: true });
    if (!updated) return res.status(404).json({ message: "Company not found." });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update company." });
  }
};

// DELETE company
exports.deleteCompany = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Company.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Company not found." });

    res.json({ message: "Company deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete company." });
  }
};

// DELETE all companies
exports.deleteAllCompanies = async (req, res) => {
  try {
    await Company.deleteMany({});
    res.json({ message: "All companies deleted." });
  } catch (err) {
    console.error("Delete all error:", err);
    res.status(500).json({ message: "Failed to delete all companies." });
  }
};
