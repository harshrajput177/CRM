const mongoose = require("mongoose");

const breakSchema = new mongoose.Schema({
  breakStart: Date,
  breakEnd: Date,
  duration: Number
});

const sessionSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ya Agent
      required: true
    },
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: Date,
    totalTime: Number,
    breaks: [breakSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);

