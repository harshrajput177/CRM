const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadFile, getAllFiles, getLeadsByFileId } = require("../Controller/FileController");

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("file"), uploadFile);
router.get("/files", getAllFiles);
router.get("/files/:fileId/leads", getLeadsByFileId);

module.exports = router;
