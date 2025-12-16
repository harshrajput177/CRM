const fs = require("fs");
const path = require("path");
const FileModel = require("../Model/FileSchema");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const pdf = require("pdf-parse");
const Papa = require("papaparse");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Save basic file info in DB
    const fileData = new FileModel({
      filename: req.file.originalname,
      filepath: req.file.path,
      filetype: req.file.mimetype,
      filesize: req.file.size,
    });

    await fileData.save();


    if (
      req.file.mimetype === "text/csv" ||
      req.file.originalname.endsWith(".csv")
    ) {
      const results = [];
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => results.push(row))
        .on("end", () => {
          return res.json({ success: true, file: fileData, csvData: results });
        });
      return;
    }

    if (
      req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      req.file.mimetype === "application/vnd.ms-excel" ||
      req.file.originalname.endsWith(".xls") ||
      req.file.originalname.endsWith(".xlsx")
    ) {
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const parsedData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      return res.json({ success: true, file: fileData, excelData: parsedData });
    }

    // --- PDF File Parsing ---
    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdf(dataBuffer);
      return res.json({ success: true, file: fileData, pdfText: pdfData.text });
    }

    // Other file types
    return res.json({ success: true, file: fileData });
  } catch (err) {
    console.error("Error in uploadFile:", err);
    res.status(500).json({ error: err.message });
  }
};

const getAllFiles = async (req, res) => {
  try {
    const files = await FileModel.find();
    if (files.length === 0) return res.json({ files: [], parsedData: [] });

    const latestFile = files[files.length - 1]; // Latest file
    const filePath = path.join(__dirname, "..", latestFile.filepath);

    // Check if file actually exists
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return res.status(404).json({
        error: "File not found on server. It may have been deleted.",
        files,
        parsedData: [],
      });
    }

    // If CSV file
    if (latestFile.filename.endsWith(".csv")) {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => results.push(row))
        .on("end", () => {
          return res.json({ files, parsedData: results });
        });
      return;
    }

    
    if (
      latestFile.filename.endsWith(".xlsx") || latestFile.filename.endsWith(".xls")
    ) {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const parsedData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      return res.json({ files, parsedData });
    }

    return res.json({ files, parsedData: [] });
  } catch (err) {
    console.error("Error in getAllFiles:", err);
    res.status(500).json({ error: err.message });
  }
};


const deleteFileById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ File DB se nikaalo
    const file = await FileModel.findById(id);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found in database",
      });
    }

    // 2️⃣ File ka actual path banao
    const filePath = path.join(__dirname, "..", file.filepath);

    // 3️⃣ Server se file delete karo (agar exist karti hai)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.warn("⚠ File not found on disk:", filePath);
    }

    // 4️⃣ DB se record delete
    await FileModel.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting file:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting file",
    });
  }
};



const getLeadsByFileId = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await FileModel.findById(fileId);
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const filePath = path.join(__dirname, "..", file.filepath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File missing on server" });
    }

    let leads = [];

    if (file.filename.endsWith(".csv")) {
      const csvData = fs.readFileSync(filePath, "utf8");
      const parsed = Papa.parse(csvData, { header: true });
      leads = parsed.data;
    }

    if (file.filename.endsWith(".xlsx") || file.filename.endsWith(".xls")) {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      leads = xlsx.utils.sheet_to_json(sheet);
    }

    res.json({ success: true, leads });

  } catch (error) {
    console.error("Error reading file data:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


module.exports = { uploadFile, getAllFiles,  getLeadsByFileId, deleteFileById };
 