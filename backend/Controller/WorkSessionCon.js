const WorkSession = require("../Model/WorkSession");
const User = require("../Model/Login-Ag-Ad");

exports.startWorkSession = async (req, res) => {
  try {
    const { agentId } = req.body;
    const activeSession = await WorkSession.findOne({
      agentId,
      endTime: null,
    });

    if (activeSession) {
      return res.status(200).json({
        message: "Active session already running",
        sessionId: activeSession._id,
      });
    }

    // ✅ Create new session only if no active session exists
    const newSession = new WorkSession({
      agentId,
      startTime: new Date(),
      endTime: null,
      totalTime: 0,
    });

    await newSession.save();

    res.status(200).json({
      message: "Work session started",
      sessionId: newSession._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Error starting session", error: err.message });
  }
};



exports.endWorkSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    console.log("End Session API called", req.body);

    const session = await WorkSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.endTime = new Date();
    session.totalTime =
      (session.endTime.getTime() - session.startTime.getTime()) / 1000; // seconds

    await session.save();

    res.status(200).json({
      message: "Work session ended",
      totalTime: session.totalTime,
    });
  } catch (err) {
    res.status(500).json({ message: "Error ending session", error: err.message });
  }
};


exports.getAgentSessions = async (req, res) => {
  try {
    const { agentId } = req.params;

    const sessions = await WorkSession.find({ agentId }).sort({ startTime: -1 });

    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sessions", error: err.message });
  }
};


exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params; // "2026-01-27"

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    // 1️⃣ Us date ke sessions
    const sessions = await WorkSession.find({
      startTime: { $gte: start, $lte: end },
    }).populate("agentId", "name");

    // 2️⃣ Sab agents
    const agents = await User.find(
      { role: "user" },
      { name: 1 }
    );

    // 3️⃣ Online agents set
    const onlineSet = new Set(
      sessions
        .filter(s => s.endTime === null)
        .map(s => String(s.agentId._id))
    );

    // 4️⃣ Final response
    const result = agents.map(a => ({
      name: a.name,
      status: onlineSet.has(String(a._id)) ? "online" : "offline",
    }));

    res.status(200).json(result);

  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({ message: "Error fetching attendance" });
  }
};

