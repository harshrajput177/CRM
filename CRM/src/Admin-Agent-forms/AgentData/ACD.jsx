import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Styles-CSS/ACD.css"

const AcdPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [calls, setCalls] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [acd, setAcd] = useState("0m 0s");
  const [totalWorkTime, setTotalWorkTime] = useState(0);

  // ✅ Selected Date (default = today)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const selectedDateStr = new Date(selectedDate).toDateString();

  // 🔁 Fetch data whenever agent or date changes
  useEffect(() => {
    fetchCallsByDate();
    fetchSessionsByDate();
  }, [id, selectedDate]);

  // 📞 Fetch resolved calls (date-wise)
  const fetchCallsByDate = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/resolved-leads/${id}`);

      const filteredCalls = res.data.data.filter(
        (c) =>
          new Date(c.createdAt).toDateString() === selectedDateStr
      );

      setCalls(filteredCalls);
    } catch (err) {
      console.error("Calls fetch error:", err);
      setCalls([]);
    }
  };

  // ⏱ Fetch working sessions (date-wise)
  const fetchSessionsByDate = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/sessions/${id}`);

      const filteredSessions = res.data.filter(
        (s) =>
          new Date(s.startTime).toDateString() === selectedDateStr
      );

      setSessions(filteredSessions);

      const totalSeconds = filteredSessions.reduce(
        (sum, s) => sum + (s.totalTime || 0),
        0
      );

      setTotalWorkTime(totalSeconds);
    } catch (err) {
      console.error("Sessions fetch error:", err);
      setTotalWorkTime(0);
    }
  };

  // 🔥 Calculate ACD (date-wise)
  useEffect(() => {
    if (calls.length > 0 && totalWorkTime > 0) {
      const avgSeconds = totalWorkTime / calls.length;
      setAcd(formatTime(avgSeconds));
    } else {
      setAcd("0m 0s");
    }
  }, [calls, totalWorkTime]);

  // ⏰ Time formatter
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div style={{ padding: "20px" }}>
     <div  className="ACD-NAV">
       <h2>📞 Average Call Duration (Date Wise)</h2>

      <button className="backbtn" onClick={() => navigate("/allagents")}>
        Back
      </button>
     </div>

      <br /><br />

      {/* 📅 Date Picker */}
      <div className="date-filter">
  <label>Select Date:</label>
  <input
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
  />
</div>


      <br /><br />

      {/* 🔥 Summary Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div className="stat-box">
          <h3>{calls.length}</h3>
          <p>Total Calls</p>
        </div>

        <div className="stat-box">
          <h3>{formatTime(totalWorkTime)}</h3>
          <p>Total Working Time</p>
        </div>

        <div className="stat-box">
          <h3>{acd}</h3>
          <p>ACD</p>
        </div>
      </div>

      {/* 📋 Call Details Table */}
      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Dispose</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {calls.length === 0 ? (
            <tr>
              <td colSpan="4" align="center">
                No calls on selected date
              </td>
            </tr>
          ) : (
            calls.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.dispose}</td>
                <td>{c.remark}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AcdPage;
