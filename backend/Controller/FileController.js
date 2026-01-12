const fs = require("fs");
const path = require("path");
const FileModel = require("../Model/FileSchema");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const pdf = require("pdf-parse");
const Papa = require("papaparse");

/* ======================
   UPLOAD FILE
====================== */
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ schema ke according
    const fileUrl = `uploads/${req.file.filename}`;

    const fileData = new FileModel({
      filename: req.file.originalname,
      fileUrl: fileUrl,
      filetype: req.file.mimetype,
      filesize: req.file.size,
    });

    await fileData.save();

    return res.json({
      success: true,
      file: fileData,
    });

  } catch (err) {
    console.error("❌ Error in uploadFile:", err);
    return res.status(500).json({ message: "Upload failed" });
  }
};

/* ======================
   GET ALL FILES
====================== */
const getAllFiles = async (req, res) => {
  try {
    // 👉 sirf valid fileUrl wale records
    const files = await FileModel.find({
      fileUrl: { $exists: true, $ne: null }
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      files
    });

  } catch (err) {
    console.error("❌ Error in getAllFiles:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================
   GET LEADS BY FILE ID
====================== */
const getLeadsByFileId = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await FileModel.findById(fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // ✅ schema based check
    if (typeof file.fileUrl !== "string") {
      return res.json({
        success: true,
        leads: [],
        warning: "File URL missing in database",
      });
    }

    const filePath = path.resolve(file.fileUrl);

    if (!fs.existsSync(filePath)) {
      return res.json({
        success: true,
        leads: [],
        warning: "File not found on server",
      });
    }

    let leads = [];

    // CSV
    if (file.filename.endsWith(".csv")) {
      const csvData = fs.readFileSync(filePath, "utf8");
      const parsed = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
      });
      leads = parsed.data;
    }

    // EXCEL
    else if (
      file.filename.endsWith(".xlsx") ||
      file.filename.endsWith(".xls")
    ) {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      leads = xlsx.utils.sheet_to_json(sheet);
    }

    return res.json({
      success: true,
      leads,
    });

  } catch (error) {
    console.error("❌ Error reading file data:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ======================
   DELETE FILE
====================== */
const deleteFileById = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await FileModel.findById(id);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // ✅ schema based delete
    if (typeof file.fileUrl === "string") {
      const filePath = path.resolve(file.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await FileModel.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "File deleted successfully",
    });

  } catch (error) {
    console.error("❌ Error deleting file:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting file",
    });
  }
};

module.exports = {
  uploadFile,
  getAllFiles,
  getLeadsByFileId,
  deleteFileById,
};

 