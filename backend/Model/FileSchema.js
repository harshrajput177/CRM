const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  filename: String,
  fileUrl: String,
  filetype: String,
  filesize: Number,
}, { timestamps: true });

module.exports = mongoose.model("File", FileSchema);
