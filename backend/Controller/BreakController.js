const mongoose = require("mongoose");
const Session = require("../Model/Break");

exports.startBreak = async (req, res) => {
  try {
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ message: "agentId required" });
    }

    // 1️⃣ Find active break session for agent
    let session = await Session.findOne({
      agentId: new mongoose.Types.ObjectId(agentId),
      endTime: null
    });

    // 2️⃣ If no session exists → create one (🔥 THIS IS IMPORTANT)
    if (!session) {
      session = await Session.create({
        agentId: new mongoose.Types.ObjectId(agentId),
        startTime: new Date(),
        breaks: []
      });

      console.log("✅ Break session created:", session._id);
    }

    // 3️⃣ Prevent double break
    const lastBreak = session.breaks.at(-1);
    if (lastBreak && !lastBreak.breakEnd) {
      return res.status(400).json({ message: "Break already running" });
    }

    // 4️⃣ Start break
    session.breaks.push({
      breakStart: new Date()
    });

    await session.save();

    res.json({
      success: true,
      message: "Break started",
      breakSessionId: session._id // frontend ko bhej sakte ho
    });

  } catch (error) {
    console.error("Start break error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.endBreak = async (req, res) => {
  try {
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ message: "agentId required" });
    }

    // 1️⃣ Find active break session
    const session = await Session.findOne({
      agentId: new mongoose.Types.ObjectId(agentId),
      endTime: null
    });

    if (!session) {
      return res.status(400).json({ message: "No active break session found" });
    }

    const lastBreak = session.breaks.at(-1);
    if (!lastBreak || lastBreak.breakEnd) {
      return res.status(400).json({ message: "No active break found" });
    }

    // 2️⃣ End break
    lastBreak.breakEnd = new Date();
    lastBreak.duration = Math.floor(
      (lastBreak.breakEnd - lastBreak.breakStart) / 1000
    );

    await session.save();

    res.json({
      success: true,
      message: "Break ended",
      duration: lastBreak.duration
    });

  } catch (error) {
    console.error("End break error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
