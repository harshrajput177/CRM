const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require("path");
const dotenv = require("dotenv");
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const authRoutes = require("./routes/LoginRoute");
const adminauthroute = require("./routes/adminRoute");
const connectDB = require('./Config/db');
const fileRoutes = require("./routes/FileRouter");
const selectedColumnsRoutes = require("./routes/SelectedData");
const asignleadRoutes = require("./routes/Assignlead");
const cookieParser = require("cookie-parser");
const leadStatusRoutes = require("./routes/LeadStatusRout")
const WorkSessionRoute = require("./routes/WorkSessionRoute");

const app = express();
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Middleware
app.use(bodyParser.json());



dotenv.config();
connectDB();

app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin); // Allow all origins dynamically
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.use(express.json());

// ✅ VERY IMPORTANT: uploads folder publicly serve karo
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("Server running");
});

app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 

app.use("/api", authRoutes);
app.use("/api",adminauthroute);

app.use("/api", asignleadRoutes);

app.use("/api", fileRoutes); 
app.use("/api", selectedColumnsRoutes);

app.use("/api", leadStatusRoutes);

app.use("/api", WorkSessionRoute);

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });


// Function to process Excel or CSV file
const processFile = (filePath, fileType) => {
  if (fileType === 'csv') {
      // Parse CSV file
      const csvData = fs.readFileSync(filePath, 'utf-8');
      const rows = csvData.split('\n'); // Split by rows
      const headers = rows[0].split(','); // Split headers
      const data = rows.slice(1).map(row => {
          const values = row.split(',');
          return headers.reduce((acc, header, index) => {
              acc[header.trim()] = values[index]?.trim();
              return acc;
          }, {});
      });
      return data;
  } else {
      // Parse Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      return sheetData;
  }
};






// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));














