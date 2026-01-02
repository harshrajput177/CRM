const mongoose = require("mongoose");

const leadStatusSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

    leadId: {
      type: String,
      required: true,
      index: true, // fast query
    },


      lead: {
    type: Object,      // pura snapshot
    default: {},
  },

  
    
  remark: {
    type: String,
    default: "",
  },
  dispose: {
    type: String,
    enum: ["", "Ringing", "Interested", "Not Interested", "Other"],
    default: "",
  },
  followUp: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

module.exports = mongoose.model("LeadStatus", leadStatusSchema);
