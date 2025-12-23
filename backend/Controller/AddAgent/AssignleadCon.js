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

  const filtered = data.map(doc => ({
    ...doc.toObject(),
    leads: doc.leads.filter(lead => lead.status !== "closed")
  }));

  res.json(filtered);
};



const getAssignedLeads = async (req, res) => {
  try {
    const { agentId } = req.params;

    const assigned = await AssignedLead.findOne({ agentId });

    if (!assigned) {
      return res.json({ leads: [] });
    }

    // ❌ closed leads hata do
    const filteredLeads = assigned.leads.filter(
      lead => lead.status !== "closed"
    );

    res.json({
      agentId: assigned.agentId,
      leads: filteredLeads
    });

  } catch (error) {
    console.error("Error fetching assigned leads:", error);
    res.status(500).json({ message: "Server error" });
  }
};



const getAssignedLeadsSummary = async (req, res) => {
  try {
    const summary = await AssignedLead.aggregate([
      {
        $lookup: {
          from: "users", 
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
  getAssignedLeadsSummary,

};

