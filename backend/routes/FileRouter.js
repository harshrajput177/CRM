const express = require("express");
const upload = require("../Middleware/Upload");
const { uploadFile, getAllFiles, getLeadsByFileId, deleteFileById } = require("../Controller/FileController");

const router = express.Router();

// Routes
router.post("/upload", upload.single("file"), uploadFile);
router.get("/files", getAllFiles);
router.get("/files/:fileId/leads", getLeadsByFileId);
router.delete("/files/:id", deleteFileById);

module.exports = router;
