const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  leadId: {
    type: String,        // ✅ STRING because CSV id is string
    required: true
  },

  sourceFileId: {
    type: String,        // ✅ STRING
    required: true
  },

  data: {
    type: Object,
    required: true
  },

  assigned: {
    type: Boolean,
    default: true
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  assignedAt: {
    type: Date,
    default: Date.now
  },
  
  status: {
  type: String,
  enum: ["open", "followup", "closed"],
  default: "open"
}

});

const assignedLeadSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  leads: [leadSchema]
});

module.exports = mongoose.model("AssignedLead", assignedLeadSchema);



