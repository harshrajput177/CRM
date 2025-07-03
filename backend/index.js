const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const Form = require('./Model/AddLead');
const agentRoutes = require("./routes/agentRoute");
const adminRoutes = require("./routes/adminRoute");
const connectDB = require('./Config/db');

const app = express();
app.use(express.json());
// Middleware
app.use(bodyParser.json());
app.use(cors());

dotenv.config();
connectDB();

app.use("/api/Agent", agentRoutes);
app.use("/api/Admin", adminRoutes);


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


// API to handle Excel and CSV uploads
app.post('/upload-file', upload.single('file'), (req, res) => {
  try {
      const filePath = req.file.path;
      const fileType = req.file.mimetype === 'text/csv' ? 'csv' : 'excel';

      // Process the file based on its type
      const fileData = processFile(filePath, fileType);

      // Clean up the file after processing
      fs.unlinkSync(filePath);

      res.json({ data: fileData, type: fileType });
  } catch (error) {
      res.status(500).json({ message: 'Error processing the file', error });
  }
});







// Routes
app.post('/api/form/post', async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});




app.get('/api/form/get', async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/form/:id', async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(form);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/form/delete/:id', async (req, res) => {
  try {
    const deletedForm = await Form.findByIdAndDelete(req.params.id);
    if (!deletedForm) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
