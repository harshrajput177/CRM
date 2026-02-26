const User = require("../Model/Login-Ag-Ad");
const AssignedLead = require("../Model/Assignlead");
const LeadStatus = require("../Model/LeadStatus");
const Notification = require("../Model/Notification");
const Session = require("../Model/WorkSession"); // working session model

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔥 1️⃣ Assigned Leads delete
    await AssignedLead.deleteMany({ agentId: id });

    // 🔥 2️⃣ Resolved + FollowUp delete
    await LeadStatus.deleteMany({ agentId: id });

    // 🔥 3️⃣ Notifications delete
    await Notification.deleteMany({ agentId: id });

    // 🔥 4️⃣ Working Sessions delete
    await Session.deleteMany({ agentId: id });

    // 🔥 5️⃣ Finally Agent delete
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Agent and all related data deleted"
    });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = deleteUser;