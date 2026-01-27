const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  leadId: {
    type: String,
    required: true,
  },

  // 🔥 SNAPSHOT DATA
  contactName: String,
  contactNumber: String,

  title: String,
  message: String,

  followUpDate: {
    type: Date,
    required: true,
  },

  isRead: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);

