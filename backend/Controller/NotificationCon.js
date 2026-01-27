const Notification = require("../Model/Notification");
const LeadStatus = require("../Model/LeadStatus");

const getUpcomingNotifications = async (req, res) => {
  try {
    const { agentId } = req.params;

    const notifications = await Notification.find({ agentId })
      .sort({ followUpDate: 1 })
      .lean();

    // 🔥 Attach lead data from LeadStatus
    const finalNotifications = await Promise.all(
      notifications.map(async (n) => {
        const leadStatus = await LeadStatus.findOne({
          agentId,
          leadId: n.leadId,
        }).lean();

        return {
          ...n,
          contactName: leadStatus?.lead?.Name || "",
          contactNumber: leadStatus?.lead?.Mobile || "",
        };
      })
    );

    res.json({
      success: true,
      notifications: finalNotifications,
    });
  } catch (err) {
    console.error("Notification fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Fix It from notification
 * action = "follow" | "close"
 */
const fixLeadFromNotification = async (req, res) => {
  try {
    const { agentId, leadId, action } = req.body;

    if (!agentId || !leadId || !action) {
      return res.status(400).json({
        message: "agentId, leadId & action required",
      });
    }

    // 🔍 Find existing lead status (must exist)
    const leadStatus = await LeadStatus.findOne({ agentId, leadId });

    if (!leadStatus) {
      return res.status(404).json({
        message: "Lead status not found",
      });
    }

    // 🔁 FOLLOW UP
    if (action === "follow") {
      // ❗ followUp date already exists (notification bana tab hi)
      leadStatus.dispose = "Follow Up";
      // followUp ko touch nahi karna
    }

    // ❌ CLOSE
    if (action === "close") {
      leadStatus.dispose = "Closed";
      leadStatus.followUp = null;
    }

    await leadStatus.save();

    // 🔕 Notification remove (kaam ho gaya)
    await Notification.deleteMany({ agentId, leadId });

    res.status(200).json({
      success: true,
      message:
        action === "follow"
          ? "Lead moved to Follow-Up"
          : "Lead moved to Closed",
    });
  } catch (err) {
    console.error("Fix lead error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { getUpcomingNotifications ,  fixLeadFromNotification};
