import React, { useEffect, useState } from "react";
import axios from "axios";

const DailyReport = () => {
  const [sessions, setSessions] = useState([]);
  const agentId = localStorage.getItem("agentId");

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

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Daily Work Sessions</h2>
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
