const express = require("express");
const { startWorkSession, endWorkSession, getAgentSessions, getAttendanceByDate } = require("../Controller/WorkSessionCon");

const router = express.Router();

router.post("/start-session", startWorkSession);
router.post("/end-session", endWorkSession);
router.get("/sessions/:agentId", getAgentSessions);
router.get("/attendance/:date", getAttendanceByDate);

module.exports = router;

