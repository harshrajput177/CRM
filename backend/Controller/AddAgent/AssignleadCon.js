const AssignedLead = require("../../Model/Assignlead");


// 🔥 SAME LOGIC FRONTEND + BACKEND
const normalizeMobile = (mobile) =>
  String(mobile || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/\.0$/, "")
    .replace(/^(\+91)/, "");


const assignLeadsToAgent = async (req, res) => {
  const { agentId, leads, fileId } = req.body;

  if (!agentId || !fileId || !Array.isArray(leads)) {
    return res.status(400).json({
      message: "agentId, fileId & leads required",
    });
  }

  try {
    let record = await AssignedLead.findOne({ agentId });
    if (!record) record = new AssignedLead({ agentId, leads: [] });

    /**
     * 🔥 Existing keys
     * - old hash based
     * - old raw mobile
     * - new normalized mobile
     */
    const existingKeys = new Set(
      record.leads.map((l) =>
        `${String(l.leadId)}_${String(l.sourceFileId)}`
      )
    );

    const preparedLeads = leads
      .map((lead) => {
        const normalizedMobile = normalizeMobile(lead.Mobile);
        if (!normalizedMobile) return null;

        return {
          leadId: normalizedMobile,        // ✅ ALWAYS NORMALIZED
          sourceFileId: String(fileId),
          data: lead,
          assigned: true,
          assignedTo: agentId,
          assignedAt: new Date(),
          status: "open",
        };
      })
      .filter(Boolean)
      .filter((l) => {
        const key = `${l.leadId}_${l.sourceFileId}`;
        return !existingKeys.has(key); // ✅ prevent duplicates
      });

    if (!preparedLeads.length) {
      return res.json({
        message: "No new leads to assign",
      });
    }

    record.leads.push(...preparedLeads);
    await record.save();

    return res.status(201).json({
      message: "Leads assigned successfully",
      count: preparedLeads.length,
    });

  } catch (err) {
    console.error("Assign error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};


const getAllAssignedLeads = async (req, res) => {
  const data = await AssignedLead.find();
  res.json(data);
};


const getAssignedLeads = async (req, res) => {
  try {
    const { agentId } = req.params;

    const assigned = await AssignedLead.findOne({ agentId });

    if (!assigned) {
      return res.json({ leads: [] });
    }


  res.json({
  agentId: assigned.agentId,
  leads: assigned.leads   // 🔥 ALWAYS ALL
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

