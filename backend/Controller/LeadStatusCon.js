const mongoose = require("mongoose")
const LeadStatus = require("../Model/LeadStatus");
const AssignedLead = require("../Model/Assignlead");

const saveLeadStatus = async (req, res) => {
  try {
    const { agentId, lead, remark, dispose, followUp } = req.body;

    // ✅ HARD VALIDATION
    if (!agentId || !lead || !lead.leadId) {
      return res.status(400).json({
        message: "agentId and lead.leadId are required",
      });
    }

    // 1️⃣ Save LeadStatus with PROPER lead object
    await LeadStatus.create({
      agentId,
      lead: {
        leadId: lead.leadId,   // 🔥 THIS IS KEY
        data: lead.data
      },
      remark,
      dispose,
      followUp,
    });

    // 2️⃣ If NOT INTERESTED → remove from AssignedLead
    if (dispose === "Not Interested") {
      await AssignedLead.updateOne(
        { agentId },
        {
          $pull: {
            leads: { leadId: lead.leadId }
          }
        }
      );
    }

    return res.json({
      success: true,
      message: "Lead closed & removed from assigned list",
    });

  } catch (err) {
    console.error("saveLeadStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};






const getAllLeadStatus = async (req, res) => {
  try {
    const allStatus = await LeadStatus.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({
      message: "All lead follow-up records fetched successfully",
      data: allStatus,
    });
  } catch (error) {
    console.error("Error fetching lead status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


const updateLeadStatus = async (req, res) => {
  try {
    const leadId = req.params.id;
    const { remark, dispose, followUp } = req.body;

    if (!leadId) {
      return res.status(400).json({ message: "Lead ID is required" });
    }

    const updatedLead = await LeadStatus.findByIdAndUpdate(
      leadId,
      {
        remark,
        dispose,
        followUp,
      },
      { new: true } // return updated record
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });

  } catch (error) {
    console.error("Error updating lead status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getResolvedLeadsByAgent = async (req, res) => {
  try {
    const { agentId } = req.params;

    const resolvedLeads = await LeadStatus.find({
      agentId: new mongoose.Types.ObjectId(agentId)
    }).sort({ createdAt: -1 });

    res.status(200).json({
      totalResolved: resolvedLeads.length,
      data: resolvedLeads
    });

  } catch (error) {
    console.error("Resolved Leads Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { saveLeadStatus , getAllLeadStatus,  updateLeadStatus, getResolvedLeadsByAgent};
