const mongoose = require("mongoose");

const workSessionSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  totalTime: { type: Number, default: 0 } // seconds
});

module.exports = mongoose.model("WorkSession", workSessionSchema);
