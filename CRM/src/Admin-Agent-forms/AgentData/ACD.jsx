import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AcdPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [todayCalls, setTodayCalls] = useState([]);
  const [todaySessions, setTodaySessions] = useState([]);
  const [acd, setAcd] = useState("0m 0s");
  const [totalWorkTime, setTotalWorkTime] = useState(0);



  const todayStr = new Date().toDateString();

  useEffect(() => {
    fetchTodayCalls();
    fetchTodaySessions();
  }, [id]);

  // 🔹 Fetch Today's Resolved Calls
  const fetchTodayCalls = async () => {
    const res = await axios.get(`${BASE_URL}/api/resolved-leads/${id}`);
    const todayLeads = res.data.data.filter(
      (l) => new Date(l.createdAt).toDateString() === todayStr
    );
    setTodayCalls(todayLeads);
  };

  // 🔹 Fetch Today's Working Sessions
  const fetchTodaySessions = async () => {
    const res = await axios.get(`${BASE_URL}/api/sessions/${id}`);

    const todaySessionData = res.data.filter(
      (s) => new Date(s.startTime).toDateString() === todayStr
    );

    setTodaySessions(todaySessionData);

    const totalSeconds = todaySessionData.reduce(
      (sum, s) => sum + (s.totalTime || 0),
      0
    );

    setTotalWorkTime(totalSeconds);
  };

  // 🔥 Calculate ACD
  useEffect(() => {
    if (todayCalls.length > 0 && totalWorkTime > 0) {
      const avg = totalWorkTime / todayCalls.length;
      setAcd(formatTime(avg));
    }
  }, [todayCalls, totalWorkTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📞 Average Call Duration (Today)</h2>

      <button className="backbtn" onClick={() => navigate("/allagents")}>
        Back
      </button>

      <br /><br />

      {/* 🔥 Summary Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div className="stat-box">
          <h3>{todayCalls.length}</h3>
          <p>Today's Calls</p>
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

      {/* 📋 Call Details */}
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
          {todayCalls.length === 0 ? (
            <tr>
              <td colSpan="4" align="center">No calls today</td>
            </tr>
          ) : (
            todayCalls.map((c) => (
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
