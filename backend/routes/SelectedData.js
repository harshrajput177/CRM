const express = require("express");
const router = express.Router();
const {
  saveSelectedData,
  getSelectedDataByFileId,
} = require("../Controller/selectedColumn");

router.post("/selectData-Post", saveSelectedData);
router.get("/selectedData-Get/:fileId", getSelectedDataByFileId);

module.exports = router;


