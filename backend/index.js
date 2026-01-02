const express = require('express');
const cors = require('cors');
const path = require("path");
const dotenv = require("dotenv");
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/LoginRoute");
const adminauthroute = require("./routes/adminRoute");
const connectDB = require('./Config/db');
const fileRoutes = require("./routes/FileRouter");
const selectedColumnsRoutes = require("./routes/SelectedData");
const asignleadRoutes = require("./routes/Assignlead");
const leadStatusRoutes = require("./routes/LeadStatusRout");
const WorkSessionRoute = require("./routes/WorkSessionRoute");

dotenv.config();
connectDB();

const app = express();

/* 🔥 BODY LIMITS (ONLY ONCE) */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/* 🔥 CORS */
app.use(cors({
  origin: ["http://localhost:5173",  "https://crm-backend-fo3o.onrender.com"],
  credentials: true
}));

/* Static */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* Cookies */
app.use(cookieParser());

/* Routes */
app.use("/api", authRoutes);
app.use("/api", adminauthroute);
app.use("/api", asignleadRoutes);
app.use("/api", fileRoutes);
app.use("/api", selectedColumnsRoutes);
app.use("/api", leadStatusRoutes);
app.use("/api", WorkSessionRoute);

/* Test */
app.get("/", (req, res) => {
  res.send("Server running");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));















