const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://tesgorganicmarketing:madebyharshcallingcrm@cluster2.vytwmwj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2', {
    });
    console.log("✅ Successfully connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
