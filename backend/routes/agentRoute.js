// Routes/AgentRoutes.js
const express = require("express");
const { registerAgent } = require("../Controller/AddAgent/AddAgent");

const router = express.Router();

// Register an agent
router.post("/Agent-register", registerAgent);

module.exports = router;
