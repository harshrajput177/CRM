const mongoose = require("mongoose")
const AssignedLead = require("../Model/Assignlead");
const LeadStatus = require("../Model/LeadStatus");

const saveLeadStatus = async (req, res) => {
  try {
    const { agentId, leadId, remark, dispose, followUp } = req.body;

    if (!agentId || !leadId || !dispose) {
      return res.status(400).json({
        message: "agentId, leadId and dispose are required",
      });
    }

    // 🔥 STEP 1: get actual lead data from AssignedLead
    const assigned = await AssignedLead.findOne(
      { agentId, "leads.leadId": String(leadId) },
      { "leads.$": 1 }
    );

    const leadData = assigned?.leads?.[0]?.data || {};

    // 🔥 STEP 2: save lead status WITH lead snapshot
    const saved = await LeadStatus.create({
      agentId,
      leadId,
      lead: leadData,      // ✅ THIS FIXES EVERYTHING
      remark,
      dispose,
      followUp,
    });

    // ❌ Remove ONLY that lead when closed
    if (dispose === "Not Interested") {
      await AssignedLead.updateOne(
        {
          agentId,
          "leads.leadId": String(leadId),
        },
        {
          $pull: {
            leads: { leadId: String(leadId) }
          }
        }
      );
    }

    res.json({
      success: true,
      message: "Lead status saved successfully",
      data: saved,
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

    // 1️⃣ Get resolved lead statuses
    const resolvedStatuses = await LeadStatus.find({
      agentId: agentId,
      $or: [
        { dispose: { $exists: true, $ne: "" } },
        { remark: { $exists: true, $ne: "" } },
        { followUp: { $exists: true, $ne: null } }
      ]
    }).sort({ createdAt: -1 });

    // 2️⃣ Get assigned leads of agent
    const assigned = await AssignedLead.findOne({ agentId });

    // Safety check
    if (!assigned) {
      return res.json({ totalResolved: 0, data: [] });
    }

    // 3️⃣ Merge data
    const finalLeads = resolvedStatuses.map(status => {
      const matchedLead = assigned.leads.find(
        l => String(l.leadId) === String(status.leadId)
      );

      return {
        _id: status._id,
        leadId: status.leadId,
        name: matchedLead?.data?.Name || "N/A",
        phone: matchedLead?.data?.Phone || "-",
        email: matchedLead?.data?.Email || "-",
        dispose: status.dispose,
        remark: status.remark,
        followUp: status.followUp,
        createdAt: status.createdAt
      };
    });

    res.status(200).json({
      totalResolved: finalLeads.length,
      data: finalLeads
    });

  } catch (error) {
    console.error("Resolved Leads Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




module.exports = { saveLeadStatus , getAllLeadStatus,  updateLeadStatus, getResolvedLeadsByAgent};
