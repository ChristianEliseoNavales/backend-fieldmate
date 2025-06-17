const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  firstName: { type: String, required: true, unique: true },  
  lastName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  arrangement: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
