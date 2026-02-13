const express = require("express");
const router = express.Router();

const {
  startBreak,
  endBreak
} = require("../Controller/BreakController");

// 🛑 START BREAK
router.post("/session/start-break", startBreak);

// ▶️ END BREAK
router.post("/session/end-break", endBreak);

module.exports = router;
