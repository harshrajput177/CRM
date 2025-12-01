const express = require("express");
const { startWorkSession, endWorkSession, getAgentSessions } = require("../Controller/WorkSessionCon");

const router = express.Router();

router.post("/start-session", startWorkSession);
router.post("/end-session", endWorkSession);
router.get("/sessions/:agentId", getAgentSessions);


module.exports = router;

