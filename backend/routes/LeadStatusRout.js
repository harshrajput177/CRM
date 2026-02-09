const express = require("express");
const { saveLeadStatus, getAllLeadStatus, updateLeadStatus, getResolvedLeadsByAgent, getMyFollowUps } = require("../Controller/LeadStatusCon");

const router = express.Router();

// Save remark, dispose, follow up
router.post("/save-lead-status", saveLeadStatus);
router.get("/all-lead-status", getAllLeadStatus);
router.put("/update-lead-status/:id", updateLeadStatus);
router.get("/resolved-leads/:agentId", getResolvedLeadsByAgent);
router.get("/my-followups", getMyFollowUps);


module.exports = router;
