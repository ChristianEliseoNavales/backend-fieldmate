const User = require("../models/userSchema");

const allowRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.user.email });
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied: role not allowed" });
      }
      req.user.role = user.role; // attach role to req
      next();
    } catch (err) {
      console.error("Role middleware error:", err);
      res.status(500).json({ message: "Server error validating role" });
    }
  };
};

module.exports = allowRoles;
