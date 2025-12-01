const express = require("express");
const { saveLeadStatus, getAllLeadStatus, updateLeadStatus, getResolvedLeadsByAgent } = require("../Controller/LeadStatusCon");

const router = express.Router();

// Save remark, dispose, follow up
router.post("/save-lead-status", saveLeadStatus);
router.get("/all-lead-status", getAllLeadStatus);
router.put("/update-lead-status/:id", updateLeadStatus);
router.get("/resolved-leads/:agentId", getResolvedLeadsByAgent);


module.exports = router;
