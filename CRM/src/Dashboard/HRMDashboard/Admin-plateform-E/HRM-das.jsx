import React, { useEffect, useState } from 'react';
import '../../../Styles-CSS/HRM-CSS/HRM-das.css';
import img1 from '../../../Images/GWI-LOGO.png';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AttendanceCalendar from "./Calender";

import {
  FaUsers,
  FaUserCheck,
  FaCheckCircle,
  FaUserFriends,
  FaDollarSign,
} from 'react-icons/fa';

function HRM() {
  const [activePage, setActivePage] = useState('dashboard');
  const [secondsWorked, setSecondsWorked] = useState(0);
  const [onBreak, setOnBreak] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [loadingUserId, setLoadingUserId] = useState(null);

  const [hoverDate, setHoverDate] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [hoveredUserIndex, setHoveredUserIndex] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };


  const fetchUserDetails = async (agentId) => {
    if (userDetails[agentId]) return; // already fetched

    setLoadingUserId(agentId);

    try {
      const [
        assignedRes,
        followUpRes,
        closedRes,
        sessionRes
      ] = await Promise.all([
        axios.get(`${BASE_URL}/api/assigned-leads/${agentId}?view=all`),
        axios.get(`${BASE_URL}/api/resolved-leads/${agentId}`),
        axios.get(`${BASE_URL}/api/resolved-leads/${agentId}?type=closed`),
        axios.get(`${BASE_URL}/api/sessions/${agentId}`)
      ]);

      const totalDays = new Set(
        sessionRes.data.map(s =>
          new Date(s.loginTime).toDateString()
        )
      ).size;

      setUserDetails(prev => ({
        ...prev,
        [agentId]: {
          totalLeads: assignedRes.data.length,
          followUps: followUpRes.data.length,
          closedLeads: closedRes.data.length,
          totalDays
        }
      }));
    } catch (err) {
      console.error("User detail fetch error", err);
    } finally {
      setLoadingUserId(null);
    }
  };


  // 🔥 DATE HOVER HANDLER
  const handleDateHover = async (dateStr) => {
    if (hoverDate === dateStr) return; // repeat call guard

    setHoverDate(dateStr);
    setHoveredUserIndex(null);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/attendance/${dateStr}`
      );
      setAttendance(res.data || []);
    } catch (err) {
      console.error("Attendance fetch error", err);
      setAttendance([]);
    }
  };

  // ⏱ Timer (unchanged)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!onBreak) {
        setSecondsWorked(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onBreak]);

  return (
    <div className="app-container">
      <aside className="HRM-sidebar">
        <div className="logo">
          <img src={img1} alt="logo" className="gwi-image" />
        </div>
      </aside>

      <div className="HRM-main-content">
        <header className="navbar">
          <h2>Hello 👋</h2>
          <button className="button-logout" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <div className="dashboard-scrollable">
          {activePage === 'dashboard' && (
            <div className="stats">
              <div className="HRMdas-card" onClick={() => navigate("/all-files")}>
                <FaUsers className="icon" />
                Select File
              </div>

              <div className="HRMdas-card" onClick={() => navigate("/leads")}>
                <FaDollarSign className="icon" />
                Total Leads
              </div>

              <div className="HRMdas-card" onClick={() => navigate("/droplead")}>
                <FaCheckCircle className="icon" />
                Drop File
              </div>

              <div className="HRMdas-card" onClick={() => navigate("/allagents")}>
                <FaUserFriends className="icon" />
                Total Agent
              </div>

              <div className="HRMdas-card" onClick={() => navigate("/leadtable")}>
                <FaUserCheck className="icon" />
                Assign Lead
              </div>
            </div>
          )}

          {/* 📅 Calendar + User Panel */}
          <div className="AttendanceCalendar-with-User">
            <AttendanceCalendar handleDateHover={handleDateHover} />

      {hoverDate && (
  <div className="attendance-panel">
    <h4>📅 {hoverDate} – Agents</h4>

    {attendance.length === 0 ? (
      <p>No data</p>
    ) : (
      attendance.map((u, i) => {
        const isHovered = hoveredUserIndex === i;
        const details = userDetails[u.id];

        return (
          <div
            key={u.id || i}   // ✅ safe key
            className="user-row"
            onMouseEnter={() => {
              setHoveredUserIndex(i);
              fetchUserDetails(u.id);
            }}
            onMouseLeave={() => setHoveredUserIndex(null)}
          >
            {/* 👤 BASIC INFO */}
            <div className="user-basic">
              <strong>{u.name}</strong>
              <span>
                {u.status === "online" ? "🟢 Online" : "🔴 Offline"}
              </span>
            </div>

            {/* 📊 DETAILS (ONLY ON USER HOVER) */}
            {isHovered && (
              <div className="user-details">
                {loadingUserId === u.id && !details ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    <p>📂 Total Leads: {details?.totalLeads ?? 0}</p>
                    <p>📞 Follow Ups: {details?.followUps ?? 0}</p>
                    <p>✅ Closed: {details?.closedLeads ?? 0}</p>
                    <p>📅 Total Days: {details?.totalDays ?? 0}</p>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })
    )}
  </div>
)}

          </div>
        </div>
      </div>
    </div>
  );
}

export default HRM;
