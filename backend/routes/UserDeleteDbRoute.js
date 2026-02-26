const express = require("express");
const deleteUser = require("../Controller/UserDeleteDbCon");
const router = express.Router();

router.delete("/userDb/:id", deleteUser)

module.exports = router;