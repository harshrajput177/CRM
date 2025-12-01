const ColumnData = require("../Model/SelectedColumn");
const mongoose = require("mongoose");

const saveSelectedData = async (req, res) => {
  try {
    const { columns, data, fileId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: "Invalid fileId" });
    }

    const updatedEntry = await ColumnData.findOneAndUpdate(
      { fileId },
      {
        selectedColumns: columns,
        filteredData: data,
        updatedAt: new Date(),
      },
      {
        new: true,
        upsert: true, // Create if not found
      }
    );

    return res.status(200).json({ message: "Saved successfully", _id: updatedEntry._id });
  } catch (err) {
    console.error("Error saving selected data:", err);
    res.status(500).json({ error: "Server error" });
  }
};



const getSelectedDataByFileId = async (req, res) => {
  try {
    const { fileId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: "Invalid fileId" });
    }

    const selectedData = await ColumnData.findOne({
      fileId: new mongoose.Types.ObjectId(fileId),
    });

    if (!selectedData) {
      return res.status(404).json({ error: "No data found" });
    }

    res.json(selectedData);
  } catch (err) {
    console.error("Error in getSelectedDataByFileId:", err);
    res.status(500).json({ error: "Server error" });
  }
};





module.exports = {
  saveSelectedData,
  getSelectedDataByFileId,
};

