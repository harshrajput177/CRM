// Routes/Admin/Routes.js
const express = require("express");
const { registerAdmin } = require("../Controller/AddAdmin/AddAdmin");
const { loginAdmin } = require("../Controller/AddAdmin/AddAdmin");

const router = express.Router();

// Register an agent
router.post("/Admin-register", registerAdmin);
router.post("/Admin-login", loginAdmin);

module.exports = router;