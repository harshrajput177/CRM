const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  uploadFile,
  getAllFiles,
  getLeadsByFileId,
  deleteFileById
} = require("../Controller/FileController");

const router = express.Router();

/* =======================
   MULTER CONFIG (INLINE)
======================= */

// storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // ⚠️ make sure uploads folder exists
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  }
});

// file filter (optional but safe)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV or Excel files allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

/* =======================
   ROUTES
======================= */

// ✅ Upload file
router.post("/upload", upload.single("file"), uploadFile);

// ✅ Get all files
router.get("/files", getAllFiles);

// ✅ Get leads by fileId
router.get("/files/:fileId/leads", getLeadsByFileId);

// ✅ Delete file
router.delete("/files/:id", deleteFileById);

module.exports = router;

