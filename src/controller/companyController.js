const Company = require("../models/companySchema");
const User = require("../models/userSchema");

// GET all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching companies." });
  }
};

// Check if a company is referenced by any users
exports.checkCompanyReferences = async (req, res) => {
  const { companyName } = req.params;

  try {
    const usersWithCompany = await User.find({ company: companyName });
    res.json({
      isReferenced: usersWithCompany.length > 0,
      userCount: usersWithCompany.length,
      users: usersWithCompany.map(user => ({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }))
    });
  } catch (err) {
    res.status(500).json({ message: "Server error checking company references." });
  }
};

// Get all companies with their reference status
exports.getCompaniesWithReferences = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    const companiesWithReferences = await Promise.all(
      companies.map(async (company) => {
        const usersWithCompany = await User.find({ company: company.name });
        return {
          ...company.toObject(),
          isReferenced: usersWithCompany.length > 0,
          userCount: usersWithCompany.length
        };
      })
    );
    res.json(companiesWithReferences);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching companies with references." });
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
    // Find the company first to get its current name
    const company = await Company.findById(id);
    if (!company) return res.status(404).json({ message: "Company not found." });

    // Check if the company is referenced by any users
    const usersWithCompany = await User.find({ company: company.name });
    if (usersWithCompany.length > 0) {
      return res.status(409).json({
        message: "Cannot edit company. This company is currently assigned to users.",
        isReferenced: true,
        userCount: usersWithCompany.length,
        users: usersWithCompany.map(user => ({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }))
      });
    }

    const updated = await Company.findByIdAndUpdate(id, { name }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update company." });
  }
};

// DELETE company
exports.deleteCompany = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the company first to get its name
    const company = await Company.findById(id);
    if (!company) return res.status(404).json({ message: "Company not found." });

    // Check if the company is referenced by any users
    const usersWithCompany = await User.find({ company: company.name });
    if (usersWithCompany.length > 0) {
      return res.status(409).json({
        message: "Cannot delete company. This company is currently assigned to users.",
        isReferenced: true,
        userCount: usersWithCompany.length,
        users: usersWithCompany.map(user => ({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }))
      });
    }

    const deleted = await Company.findByIdAndDelete(id);
    res.json({ message: "Company deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete company." });
  }
};

// DELETE all companies (only unreferenced ones)
exports.deleteAllCompanies = async (req, res) => {
  try {
    // Get all companies
    const allCompanies = await Company.find();

    // Get all unique company names from users
    const referencedCompanies = await User.distinct('company');

    // Filter companies that are not referenced
    const companiesToDelete = allCompanies.filter(company =>
      !referencedCompanies.includes(company.name)
    );

    if (companiesToDelete.length === 0) {
      return res.status(409).json({
        message: "Cannot delete any companies. All companies are currently assigned to users.",
        totalCompanies: allCompanies.length,
        referencedCompanies: referencedCompanies.length
      });
    }

    // Delete only unreferenced companies
    const companyIdsToDelete = companiesToDelete.map(company => company._id);
    const deleteResult = await Company.deleteMany({ _id: { $in: companyIdsToDelete } });

    res.json({
      message: `${deleteResult.deletedCount} unreferenced companies deleted successfully.`,
      deletedCount: deleteResult.deletedCount,
      totalCompanies: allCompanies.length,
      remainingCompanies: allCompanies.length - deleteResult.deletedCount,
      referencedCompanies: referencedCompanies.length
    });
  } catch (err) {
    console.error("Delete all error:", err);
    res.status(500).json({ message: "Failed to delete companies." });
  }
};
