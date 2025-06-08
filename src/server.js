const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); 

const allowedOrigins = [
  "http://localhost:5173",
  "https://fieldmate-frontend.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(express.json()); 

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
