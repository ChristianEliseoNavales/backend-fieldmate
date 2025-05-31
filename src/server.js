const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import the database connection function
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // Connect to MongoDB

const allowedOrigins = [
  "http://localhost:3000", // your local frontend URL
  "https://your-frontend.onrender.com" // production frontend URL
];

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like Postman) or if origin is in allowedOrigins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
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
