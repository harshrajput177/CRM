const mongoose = require("mongoose");
const AssignedLead = require("../Model/Assignlead");
const LeadStatus = require("../Model/LeadStatus");
const Notification = require("../Model/Notification");

const saveLeadStatus = async (req, res) => {
  try {
    const { agentId, leadId, remark, dispose, followUp, manualLead } = req.body;

    if (!agentId || !leadId) {
      return res
        .status(400)
        .json({ message: "agentId and leadId required" });
    }

    // 🔍 Check existing status
    let existing = await LeadStatus.findOne({ agentId, leadId });

    let leadData = {};

    // 🔒 Snapshot only first time (important)
    if (!existing) {

      if (manualLead) {
        // ✅ Manual Lead Snapshot
        leadData = {
          Name: manualLead.Name,
          Mobile: manualLead.Mobile,
          Gender: manualLead.Gender,
          State: manualLead.State,
          District: manualLead.District,
        };
      } else {
        // ✅ Assigned Lead Snapshot
        const assigned = await AssignedLead.findOne(
          { agentId, "leads.leadId": String(leadId) },
          { "leads.$": 1 }
        );

        leadData = assigned?.leads?.[0]?.data || {};
      }
    } else {
      // 🟢 Agar already exist karta hai to wahi snapshot use karo
      leadData = existing.lead || {};
    }

    const updateFields = {};
    if (remark !== undefined) updateFields.remark = remark;
    if (dispose !== undefined) updateFields.dispose = dispose;
    if (followUp !== undefined) updateFields.followUp = followUp;

    // 🔔 FollowUp Notification Logic
    if (followUp) {
      const followUpDate = new Date(followUp);

      const alreadyExists = await Notification.findOne({
        agentId,
        leadId,
        followUpDate,
      });

      if (!alreadyExists) {
        await Notification.create({
          agentId,
          leadId,
          contactName: leadData?.Name || "Unknown",
          contactNumber: leadData?.Mobile || "N/A",
          followUpDate,
        });
      }
    }

    // 💾 Save / Update LeadStatus
    const saved = await LeadStatus.findOneAndUpdate(
      { agentId, leadId },
      {
        $set: updateFields,
        $setOnInsert: {
          lead: leadData,  // 🔥 snapshot preserved forever
          agentId,
          leadId,
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      data: saved,
    });

  } catch (err) {
    console.error("Save lead status error:", err);
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
    const statusId = req.params.id;
    const { remark, dispose, followUp } = req.body;

    if (!statusId) {
      return res.status(400).json({ message: "Status ID is required" });
    }

    const updatedLead = await LeadStatus.findByIdAndUpdate(
      statusId,
      {
        $set: {
          remark,
          dispose,
          followUp,
        }
        // ❌ lead ko haath hi nahi lagaya
      },
      { new: true }
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

const getMyFollowUps = async (req, res) => {
  try {
    const { agentId } = req.query;

    if (!agentId) {
      return res.status(400).json({ message: "agentId required" });
    }

    const now = new Date();

    // 🔔 Sirf future follow-ups
    const followUps = await Notification.find({
      agentId,
      followUpDate: { $gte: now },
    })
      .sort({ followUpDate: 1 }) // nearest first
      .limit(20);

    const formatted = followUps.map(n => ({
      leadId: n.leadId,
      name: n.contactName,
      phone: n.contactNumber,
      followUp: n.followUpDate,
    }));

    res.status(200).json({
      success: true,
      followUps: formatted,
    });

  } catch (err) {
    console.error("Get my followups error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




const getResolvedLeadsByAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { type } = req.query;

    // 🔹 Base query (ALL leads of agent)
    let query = { agentId };

    // 🔹 Explicit filters (ONLY if type provided)
  if (type === "followup") {
  query.followUp = { $ne: null };
}

    if (type === "closed") {
      query.followUp = null;
    }

    const resolvedStatuses = await LeadStatus.find(query)
      .sort({ createdAt: -1 });

    const finalLeads = resolvedStatuses.map(status => {
      const lead = status.lead || {};
      return {
        _id: status._id,
        leadId: status.leadId,
        name: lead.Name || lead.name || "N/A",
        phone: lead.Phone || lead.Mobile || "-",
        dispose: status.dispose,
        remark: status.remark,
        followUp: status.followUp,
        createdAt: status.createdAt
      };
    });

    res.status(200).json({
      total: finalLeads.length,
      data: finalLeads
    });

  } catch (err) {
    console.error("Resolved Leads Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { saveLeadStatus , getAllLeadStatus,  updateLeadStatus, getMyFollowUps, getResolvedLeadsByAgent};
