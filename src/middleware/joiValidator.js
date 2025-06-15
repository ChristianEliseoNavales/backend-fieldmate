const Joi = require("joi");

// Middleware generator
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Register schema
const registerSchema = Joi.object({
  uid: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  role: Joi.string().valid("Student", "Coordinator", "Admin").required(),
  company: Joi.string().required(),
  arrangement: Joi.string().valid("On-site", "Remote", "Hybrid").required(),
});

// Login schema (if needed)
const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).required(),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
};
