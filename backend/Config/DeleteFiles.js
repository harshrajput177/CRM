const mongoose = require("mongoose");
const connectDB = require("./db"); // tumhara connectDB file

// Models import karo
const Lead = require("../Model/LeadStatus");
const WorkSession = require("../Model/WorkSession");
const AssignedLead = require("../Model/Assignlead");
const LeadStatus = require("../Model/SelectedColumn");

const clearData = async () => {
  try {
    await connectDB();

    await Lead.deleteMany({});
    await WorkSession.deleteMany({});
    await AssignedLead.deleteMany({});
    await LeadStatus.deleteMany({});

    console.log("🔥 All leads & work session data deleted successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Error deleting data:", error);
    process.exit(1);
  }
};

clearData();
