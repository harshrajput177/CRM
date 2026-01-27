const express = require("express");
const {
  getUpcomingNotifications,
  fixLeadFromNotification
} = require("../Controller/NotificationCon");

const router = express.Router();

// 🔔 Upcoming follow-up notifications
router.get("/notifications/:agentId", getUpcomingNotifications);


router.post("/notifications/fix", fixLeadFromNotification);

module.exports = router;

