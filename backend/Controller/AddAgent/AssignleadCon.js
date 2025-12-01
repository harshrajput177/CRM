const AssignedLead = require("../../Model/Assignlead");
const mongoose = require("mongoose");

const assignLeadsToAgent = async (req, res) => {
  const { agentId, leads, fileId } = req.body;

  // console.log("Incoming Body:", req.body);

  if (!agentId || !fileId || !Array.isArray(leads)) {
    return res.status(400).json({ message: "agentId, fileId & leads required" });
  }

  try {
    let record = await AssignedLead.findOne({ agentId });
    if (!record) record = new AssignedLead({ agentId, leads: [] });

    const existing = record.leads.map(l =>
      `${l.leadId}_${l.sourceFileId}`
    );

    const preparedLeads = leads.map(lead => {

      // ✅ HERE IS THE FIX
      const leadUniqueId = lead.id || lead.leadId || `${fileId}_${Date.now()}`;

      return {
        leadId: leadUniqueId,   // ✅ String unique id
        sourceFileId: fileId,   // ✅ File reference
        data: lead,
        assigned: true,
        assignedTo: agentId,
        assignedAt: new Date()
      };

    }).filter(l =>
      !existing.includes(`${l.leadId}_${l.sourceFileId}`)
    );

    if (!preparedLeads.length) {
      return res.json({ message: "Already assigned" });
    }

    record.leads.push(...preparedLeads);
    await record.save();

    res.status(201).json({ message: "Leads assigned successfully" });

  } catch (error) {
    console.error("Assign Leads Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllAssignedLeads = async (req, res) => {
  const data = await AssignedLead.find();
  res.json(data);
};

const getAssignedLeads = async (req, res) => {
  const { agentId } = req.params;
  const data = await AssignedLead.findOne({ agentId });
  res.json(data || []);
};


const getAssignedLeadsSummary = async (req, res) => {
  try {
    const summary = await AssignedLead.aggregate([
      {
        $lookup: {
          from: "users", // User collection name
          localField: "agentId",
          foreignField: "_id",
          as: "agentInfo"
        }
      },
      { $unwind: "$agentInfo" },
      {
        $project: {
          agentId: "$agentId",
          agentName: "$agentInfo.name",
          email: "$agentInfo.email",
          totalLeads: { $size: "$leads" },
          lastAssignedAt: { $max: "$leads.assignedAt" }
        }
      }
    ]);

    res.json(summary);
  } catch (error) {
    console.error("Summary Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = {
  assignLeadsToAgent,
  getAssignedLeads,
  getAllAssignedLeads,
  getAssignedLeadsSummary
};

