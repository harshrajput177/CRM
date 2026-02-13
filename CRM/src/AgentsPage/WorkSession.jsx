import React, { useEffect, useState } from "react";
import axios from "axios";

const DailyReport = () => {
  const [sessions, setSessions] = useState([]);
  const agentId = localStorage.getItem("agentId");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (agentId) {
      axios
        .get(`${BASE_URL}/api/sessions/${agentId}`)
        .then((res) => setSessions(res.data))
        .catch((err) => console.error("Error fetching sessions:", err));
    }
  }, [agentId]);

  const formatTime = (seconds = 0) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ✅ TOTAL BREAK TIME
  const getTotalBreakTime = (breaks = []) =>
    breaks.reduce((sum, b) => sum + (b.duration || 0), 0);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Daily Report</h2>

      <table
        border="1"
        cellPadding="10"
        style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Working Time</th>
            <th>Total Break</th>
            <th>Break Count</th>
            <th>Break Details</th>
          </tr>
        </thead>

        <tbody>
          {sessions.map((s) => {
            const totalBreak = getTotalBreakTime(s.breaks);
            const breakCount = s.breaks?.length || 0;

            return (
              <tr key={s._id}>
                <td>{new Date(s.startTime).toLocaleDateString()}</td>

                <td>{new Date(s.startTime).toLocaleTimeString()}</td>

                <td>
                  {s.endTime
                    ? new Date(s.endTime).toLocaleTimeString()
                    : "In Progress"}
                </td>

                {/* ✅ Working Time */}
                <td>{formatTime(s.totalTime)}</td>

                {/* ✅ Total Break Time */}
                <td>{formatTime(totalBreak)}</td>

                {/* ✅ Break Count */}
                <td>{breakCount}</td>

                {/* ✅ Break Details */}
                <td>
                  {s.breaks && s.breaks.length > 0 ? (
                    s.breaks.map((b, i) => (
                      <div key={i} style={{ fontSize: 12 }}>
                        Break {i + 1}: {formatTime(b.duration)}
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: 12, color: "gray" }}>
                      No Breaks
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DailyReport;
