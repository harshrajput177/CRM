const express = require("express");
const {
  assignLeadsToAgent,
  getAssignedLeads,
  getAllAssignedLeads,
  getAssignedLeadsSummary
} = require("../Controller/AddAgent/AssignleadCon");

const router = express.Router();

// POST - assign leads to agent
router.post("/assign-leads", assignLeadsToAgent);

// GET - specific agent assigned leads
router.get("/assigned-leads/:agentId", getAssignedLeads);

// ✅ GET - ALL assigned leads (ADMIN VIEW)
router.get("/assigned-leads", getAllAssignedLeads);

router.get("/assigned-leads-summary", getAssignedLeadsSummary);


module.exports = router;
