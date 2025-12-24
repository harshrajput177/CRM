const AssignedLead = require("../../Model/Assignlead");

/* ✅ Unicode-safe stable hash (SAME AS FRONTEND) */
const generateLeadHash = (lead) => {
  const str = JSON.stringify(lead);
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // 32bit integer
  }

  return String(hash);
};

const assignLeadsToAgent = async (req, res) => {
  const { agentId, leads, fileId } = req.body;

  if (!agentId || !fileId || !Array.isArray(leads)) {
    return res
      .status(400)
      .json({ message: "agentId, fileId & leads required" });
  }

  try {
    let record = await AssignedLead.findOne({ agentId });
    if (!record) record = new AssignedLead({ agentId, leads: [] });

    /* ✅ Existing leads check (leadId + fileId) */
    const existingKeys = new Set(
      record.leads.map(
        l => `${l.leadId}_${l.sourceFileId}`
      )
    );

    const preparedLeads = leads
      .map((lead) => {
        const leadHash = generateLeadHash(lead);

        return {
          leadId: leadHash,                // ✅ HASH ID
          sourceFileId: String(fileId),
          data: lead,
          assigned: true,
          assignedTo: agentId,
          assignedAt: new Date(),
          status: "open"
        };
      })
      .filter(l => {
        const key = `${l.leadId}_${l.sourceFileId}`;
        return !existingKeys.has(key);     // ✅ prevent duplicates
      });

    if (!preparedLeads.length) {
      return res.json({ message: "No new leads to assign" });
    }

    record.leads.push(...preparedLeads);
    await record.save();

    res.status(201).json({
      message: "Leads assigned successfully",
      count: preparedLeads.length
    });

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

