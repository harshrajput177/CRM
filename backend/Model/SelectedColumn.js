const mongoose = require("mongoose");

const columnDataSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "File", // assuming your file schema is named "File"
    unique: true, 
  },
  selectedColumns: {
    type: [String],
    required: true,
  },
  filteredData: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("ColumnData", columnDataSchema);

