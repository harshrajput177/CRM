import React, { useEffect, useState } from "react";
import axios from "axios";

const DailyReport = () => {
  const [sessions, setSessions] = useState([]);
  const agentId = localStorage.getItem("agentId");
  const [totalBreakTime, setTotalBreakTime] = useState(0);
const [breakCount, setBreakCount] = useState(0);


  const BASE_URL = import.meta.env.VITE_BASE_URL;


  useEffect(() => {
    if (agentId) {
      axios
        .get(`${BASE_URL}/api/sessions/${agentId}`
)
        .then((res) => setSessions(res.data))
        .catch((err) => console.error("Error fetching sessions:", err));
    }
  }, [agentId]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };


  useEffect(() => {
  const storedBreakTime = Number(localStorage.getItem("totalBreakTime")) || 0;
  const storedBreakCount = Number(localStorage.getItem("breakCount")) || 0;

  setTotalBreakTime(storedBreakTime);
  setBreakCount(storedBreakCount);
}, []);


  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Daily Work Sessions</h2>
      <div style={{ marginBottom: "20px", background: "#f3f4f6", padding: "15px", borderRadius: "8px" }}>
  <h3>🛑 Break Summary (Today)</h3>
  <p><b>Total Break Time:</b> {formatTime(totalBreakTime)}</p>
  <p><b>Breaks Taken Today:</b> {breakCount}</p>
</div>

      <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s._id}>
              <td>{new Date(s.startTime).toLocaleDateString()}</td>
              <td>{new Date(s.startTime).toLocaleTimeString()}</td>
              <td>
                {s.endTime ? new Date(s.endTime).toLocaleTimeString() : "In Progress"}
              </td>
              <td>{formatTime(s.totalTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyReport;
