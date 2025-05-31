const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import the database connection function
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

// Middleware
app.use(cors({
  origin: "https://fieldmate-backend.onrender.com" 
}));

app.use(express.json()); // To parse JSON request bodies

// Routes
const journalRoutes = require('./routes/journalRoutes');
const userRoutes = require("./routes/userRoutes");
const attendanceRoutes = require('./routes/attendanceRoutes');
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require("./routes/companyRoutes");

app.use('/api/journal', journalRoutes);
app.use('/api', journalRoutes);
app.use('/api/users', userRoutes);
app.use("/api", userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use("/api", authRoutes);
app.use("/api", companyRoutes); 

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
