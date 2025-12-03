import React, { useState, useEffect } from "react";
import "../Dashboard/Dashboard.css";
import unassigned from "../Images/Inbox.png";
import assigned from "../Images/User.png";
import closassigned from "../Images/Checkmark.png";
import tesgpic from "../Images/Tesg-logo.png";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ViewInArRoundedIcon from "@mui/icons-material/ViewInArRounded";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import DashboardIcon from "@mui/icons-material/Dashboard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [time, setTime] = useState(0); // seconds
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId"));
  const [isPaused, setIsPaused] = useState(false); // 🔹 Stop/Resume state
  const [assignedCount, setAssignedCount] = useState(0);
  const agentId = localStorage.getItem("agentId");
  const [followUpCount, setFollowUpCount] = useState(0);
  const [closedLeadCount, setClosedLeadCount] = useState(0);




  const navigate = useNavigate();


  const BASE_URL = import.meta.env.VITE_BASE_URL;


  useEffect(() => {
  const agentId = localStorage.getItem("agentId");
  if (!sessionId && agentId) {
    axios
      .post(`${BASE_URL}/api/start-session`
, { agentId })
      .then((res) => {
        setSessionId(res.data.sessionId);
        localStorage.setItem("sessionId", res.data.sessionId);

        if (!localStorage.getItem("startTime")) {
          localStorage.setItem("startTime", Date.now());
        }
      })
      .catch((err) => console.error("Session start error:", err));
  }

  // Load saved time
  const savedTime = localStorage.getItem("workingTime");
  if (savedTime) setTime(parseInt(savedTime, 10));

  const timer = setInterval(() => {
    if (!isPaused) {
      const startTime = parseInt(localStorage.getItem("startTime"), 10);
      if (startTime) {
        const elapsed =
          Math.floor((Date.now() - startTime) / 1000) +
          parseInt(localStorage.getItem("pausedTime") || 0, 10);
        setTime(elapsed);
        localStorage.setItem("workingTime", elapsed);
      }
    }
  }, 1000);

  return () => clearInterval(timer);
}, []); // 👈 empty array, run only once on mount




useEffect(() => {
  const fetchAssignedCount = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/assigned-leads/${agentId}`

      );

      console.log("Assigned Leads Response:", res.data);

      // ✅ REAL DATA SOURCE
      const leadsArray = res.data.leads || [];

      setAssignedCount(Array.isArray(leadsArray) ? leadsArray.length : 0);

    } catch (error) {
      console.error("Error fetching assigned leads:", error);
      setAssignedCount(0);
    }
  };

  if (agentId) fetchAssignedCount();
}, [agentId]);




useEffect(() => {
  const fetchFollowUpCount = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/all-lead-status`
);

      const filtered = res.data.data.filter(
        (item) =>
          item.agentId === agentId && 
          item.followUp && 
          item.followUp !== ""
      );

      setFollowUpCount(filtered.length);
    } catch (error) {
      console.error("Error fetching follow up data:", error);
    }
  };

  fetchFollowUpCount();
}, [agentId]);



useEffect(() => {
  const fetchClosedLeads = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/all-lead-status`);

      const closed = res.data.data.filter(
        (item) =>
          item.agentId === agentId &&
          item.dispose === "Interested"
      );

      setClosedLeadCount(closed.length);
    } catch (error) {
      console.error("Error fetching closed leads:", error);
    }
  };

  fetchClosedLeads();
}, [agentId]);




  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLogout = () => {
    axios
      .post(`${BASE_URL}/api/end-session`
, { sessionId })
      .then((res) => {
        console.log("Session ended:", res.data);
        localStorage.removeItem("sessionId");
        localStorage.removeItem("startTime");
        localStorage.removeItem("workingTime");
        localStorage.removeItem("pausedTime");
        navigate("/");
      })
      .catch((err) => console.error("Error ending session:", err));
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleNavClick = (navItem) => setActiveNav(navItem);

  // 🔹 Stop/Resume logic
  const handleStopResume = () => {
    if (!isPaused) {
      // Stop timer
      setIsPaused(true);
      // Save paused time
      localStorage.setItem("pausedTime", time);
    } else {
      // Resume timer
      setIsPaused(false);
      // Reset startTime to now
      localStorage.setItem("startTime", Date.now());
    }
  };

  return (
    <div className={`Tesg-dashboard ${darkMode ? "dark" : "light"}`}>
      <aside className="Dashboard-tesg-sidebar">
        <div className="Dashboard-tesg-logo">
          <img src={tesgpic} alt="" className="Dashboard-tesg-logo-img" />
        </div>
        <nav className="left-nav-dashboard">
          <ul>
            <li
              className={`dashboardlist ${
                activeNav === "Dashboard" ? "active" : ""
              }`}
              onClick={() => handleNavClick("Dashboard")}
            >
              <DashboardIcon
                className={`nav-icon ${
                  activeNav === "Dashboard" ? "active-icon" : ""
                }`}
              />
              Dashboard
            </li>
            <li
              className={`spacelist ${activeNav === "Leads" ? "active" : ""}`}
              onClick={() => handleNavClick("Leads")}
            >
              <div>
                <ViewInArRoundedIcon
                  className={`nav-icon ${
                    activeNav === "Leads" ? "active-icon" : ""
                  }`}
                />
                Leads
              </div>
              <div>
                <ExpandMoreOutlinedIcon />
              </div>
            </li>
            <li
              className={`spacelist ${activeNav === "Agents" ? "active" : ""}`}
              onClick={() => handleNavClick("Agents")}
            >
              <div>
                <AccountBoxOutlinedIcon
                  className={`nav-icon ${
                    activeNav === "Agents" ? "active-icon" : ""
                  }`}
                />
                Agents
              </div>
              <div>
                <ExpandMoreOutlinedIcon />
              </div>
            </li>
            <li
              className={`spacelist ${
                activeNav === "CallTracking" ? "active" : ""
              }`}
              onClick={() => handleNavClick("CallTracking")}
            >
              <div>
                <SupportAgentIcon
                  className={`nav-icon ${
                    activeNav === "CallTracking" ? "active-icon" : ""
                  }`}
                />
                Call Tracking
              </div>
              <div>
                <ExpandMoreOutlinedIcon />
              </div>
            </li>
            <li
              className={`spacelist ${activeNav === "Reports" ? "active" : ""}`}
              onClick={() => handleNavClick("Reports")}
            >
              <div>
                <AssessmentIcon
                  className={`nav-icon ${
                    activeNav === "Reports" ? "active-icon" : ""
                  }`}
                />
                Reports & Analytics
              </div>
              <div>
                <ExpandMoreOutlinedIcon />
              </div>
            </li>
            <li
              className={`spacelist ${
                activeNav === "Settings" ? "active" : ""
              }`}
              onClick={() => handleNavClick("Settings")}
            >
              <div>
                <SettingsIcon
                  className={`nav-icon ${
                    activeNav === "Settings" ? "active-icon" : ""
                  }`}
                />
                Setting
              </div>
              <div>
                <ExpandMoreOutlinedIcon />
              </div>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="Dashboard-tesg-content">
        <header className="Dashboard-tesg-topbar">
          <div className="Dashboard-search-container">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              className="Dashboard-tesg-search-bar"
            />
          </div>

          <div className="Dashboard-tesg-profile">
            <p>Time: {formatTime(time)}</p>
      <button className="btn-logout" onClick={handleStopResume}>
        {isPaused ? "Resume" : "Stop"}
      </button>
      <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <section className="Dashboard-tesg-summary-cards">
          <div
            className="Dashboard-tesg-card"
            onClick={() => navigate("/CallLead")}
          >
            <div className="sky-circle">
              <img src={unassigned} alt="" className="Dashboard-tesg-image" />
            </div>
            <span>Start Call</span>
          </div>

          <div className="Dashboard-tesg-card"  onClick={() => navigate("/FollowUpSheet")}>
            <div className="sky-circle">
              <img src={unassigned} alt="" className="Dashboard-tesg-image" />
            </div>
            <span >
              Follow Up<h3>{followUpCount}</h3>
            </span>
          </div>

          <div className="Dashboard-tesg-card"   onClick={() => navigate("/Show_total_leads")}>
            <div className="sky-circle">
              <img src={assigned} alt="" className="Dashboard-tesg-image" />
            </div>
            <span>
              Assigned Lead<h3>{assignedCount}</h3>
            </span>
          </div>

          <div className="Dashboard-tesg-card"     onClick={() => navigate("/WorkSession")}>
            <div className="sky-circle">
              <img src={closassigned} alt="" className="Dashboard-tesg-image" />
            </div>
            <span>
                Call Duration  
            </span>
          </div>

          <div className="Dashboard-tesg-card"    onClick={() => navigate("/interested-leads")}>
            <div className="sky-circle">
              <img src={closassigned} alt="" className="Dashboard-tesg-image" />
            </div>
            <span>
              Closed Lead <h3>{closedLeadCount}</h3>
            </span>
          </div>

        </section>
      </main>
    </div>
  );
};

export default Dashboard;





