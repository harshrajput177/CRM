const express = require("express");
const { adminLogin } = require("../Controller/LoginController/AdminController");

const router = express.Router();

router.post("/admin-login", adminLogin);

module.exports = router;
