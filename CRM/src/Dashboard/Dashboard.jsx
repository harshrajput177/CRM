import React, { useState, useEffect, useRef } from "react";
import "../Dashboard/Dashboard.css";
import unassigned from "../Images/Inbox.png";
import assigned from "../Images/User.png";
import closassigned from "../Images/Checkmark.png";
import tesgpic from "../Images/Tesg-logo.png";
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
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId"));
  const [assignedCount, setAssignedCount] = useState(0);
  const agentId = localStorage.getItem("agentId");
  const [followUpCount, setFollowUpCount] = useState(0);
  const [closedLeadCount, setClosedLeadCount] = useState(0);
  const [todayFollowUps, setTodayFollowUps] = useState([]);
  const [activeFollowUp, setActiveFollowUp] = useState(null);
const [workingTime, setWorkingTime] = useState(0);
const [breakTime, setBreakTime] = useState(0);

const [isOnBreak, setIsOnBreak] = useState(
  localStorage.getItem("isOnBreak") === "true"
);




  const BASE_URL = import.meta.env.VITE_BASE_URL;


  const navigate = useNavigate();

  const notificationTimers = useRef([]);
  
useEffect(() => {
  if (!localStorage.getItem("workStartTime")) {
    localStorage.setItem("workStartTime", Date.now());
  }
}, []);


  useEffect(() => {
    const agentId = localStorage.getItem("agentId");
    if (!sessionId && agentId) {
      axios
        .post(`${BASE_URL}/api/start-session`
          , { agentId })
        .then((res) => {
          setSessionId(res.data.sessionId);
          localStorage.setItem("sessionId", res.data.sessionId);

         // ✅ WORK TIMER START (ONLY ONCE)
        if (!localStorage.getItem("workStartTime")) {
          localStorage.setItem("workStartTime", Date.now());
        }
      })
        .catch((err) => console.error("Session start error:", err));
    }

  }, []);




  useEffect(() => {
    const fetchAssignedCount = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/assigned-leads/${agentId}?view=all`
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
    const fetchTodayFollowUps = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/all-lead-status`);

        const now = Date.now();

        const myFollowUps = res.data.data.filter(item => {
          if (!item.followUp) return false;
          if (item.agentId !== agentId) return false;

          const followTime = new Date(item.followUp).getTime();

          console.log("⏰ Follow-up at:", new Date(followTime).toLocaleString());

          return followTime > now;
        });

        setTodayFollowUps(myFollowUps);
      } catch (err) {
        console.error("❌ Follow-up fetch error", err);
      }
    };

    if (agentId) fetchTodayFollowUps();
  }, [agentId]);



  useEffect(() => {
    // clear old timers
    notificationTimers.current.forEach(t => clearTimeout(t));
    notificationTimers.current = [];

    todayFollowUps.forEach((lead) => {
      const followTime = new Date(lead.followUp).getTime();
      const now = Date.now();
      const delay = followTime - now;

      console.log("⏳ Delay (ms):", delay);

      if (delay > 0) {
        const timer = setTimeout(() => {
          showFollowUpPopup(lead);
        }, delay);

        notificationTimers.current.push(timer);
      }
    });

    return () => {
      notificationTimers.current.forEach(t => clearTimeout(t));
    };
  }, [todayFollowUps]);

  const showFollowUpPopup = (lead) => {
    console.log("🔥 POPUP TRIGGERED");
    setActiveFollowUp(lead);
  };




  useEffect(() => {
    const fetchClosedLeads = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/all-lead-status`);

        const closed = res.data.data.filter(
          (item) =>
            item.agentId === agentId &&
            item.followUp === null   // ✅ ONLY THIS MATTERS
        );

        setClosedLeadCount(closed.length);
      } catch (error) {
        console.error("Error fetching closed leads:", error);
      }
    };

    fetchClosedLeads();
  }, [agentId]);



  useEffect(() => {
  // 🔴 Break me interval hi mat banao
  if (isOnBreak) return;

  const interval = setInterval(() => {
    const start = Number(localStorage.getItem("workStartTime"));
    const totalBreak = Number(localStorage.getItem("totalBreakTime")) || 0;

    if (!start) return;

    const elapsed =
      Math.floor((Date.now() - start) / 1000) - totalBreak;

    setWorkingTime(elapsed > 0 ? elapsed : 0);
  }, 1000);

  // 🔥 YAHI STOP HOTA HAI TIMER
  return () => clearInterval(interval);

}, [isOnBreak]); // ⚠️ YE DEPENDENCY SABSE IMPORTANT HAI



const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};


  const handleLogout = () => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      console.warn("No active session found");
      navigate("/");
      return;
    }

    axios
      .post(`${BASE_URL}/api/end-session`, { sessionId })
      .then((res) => {
        console.log("Session ended:", res.data);

        // 🧹 cleanup
        localStorage.removeItem("sessionId");
        localStorage.removeItem("agentId");
        localStorage.removeItem("token");
        localStorage.removeItem("workingTime");

        navigate("/");
      })
      .catch((err) => {
        console.error("Error ending session:", err);
        navigate("/");
      });
  };


  const handleNavClick = (navItem) => setActiveNav(navItem);


const handleStopResume = () => {
  if (isOnBreak) {
    endBreak();
  } else {
    startBreak();
  }
};




  useEffect(() => {
    const handleUnload = () => {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) return;

      const payload = new Blob(
        [JSON.stringify({ sessionId })],
        { type: "application/json" }
      );

      navigator.sendBeacon(
        `${BASE_URL}/api/end-session`,
        payload
      );

    };

    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, []);

useEffect(() => {
  const storedBreak = localStorage.getItem("isOnBreak") === "true";
  setIsOnBreak(storedBreak);
}, []);




  const startBreak = () => {
  localStorage.setItem("breakStartTime", Date.now());
  localStorage.setItem("isOnBreak", "true");

  const count = Number(localStorage.getItem("breakCount")) || 0;
  localStorage.setItem("breakCount", count + 1);

  setBreakTime(0);
  setIsOnBreak(true);
};

const endBreak = () => {
  const breakStart = Number(localStorage.getItem("breakStartTime"));
  const totalBreak = Number(localStorage.getItem("totalBreakTime")) || 0;

  if (breakStart) {
    const duration = Math.floor((Date.now() - breakStart) / 1000);
    localStorage.setItem("totalBreakTime", totalBreak + duration);
  }

  localStorage.removeItem("breakStartTime");
  localStorage.setItem("isOnBreak", "false");

  setBreakTime(0);
  setIsOnBreak(false);
};

useEffect(() => {
  if (!isOnBreak) return;

  const interval = setInterval(() => {
    const breakStart = Number(localStorage.getItem("breakStartTime"));
    if (!breakStart) return;

    const seconds =
      Math.floor((Date.now() - breakStart) / 1000);

    setBreakTime(seconds);
  }, 1000);

  return () => clearInterval(interval);
}, [isOnBreak]);





  return (
    <div className={"Tesg-dashboard"}>
      <aside className="Dashboard-tesg-sidebar">
        <div className="Dashboard-tesg-logo">
          <img src={tesgpic} alt="" className="Dashboard-tesg-logo-img" />
        </div>
        <nav className="left-nav-dashboard">
          <ul>
            <li
              className={`dashboardlist ${activeNav === "Dashboard" ? "active" : ""
                }`}
              onClick={() => handleNavClick("Dashboard")}
            >
              <DashboardIcon
                className={`nav-icon ${activeNav === "Dashboard" ? "active-icon" : ""
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
                  className={`nav-icon ${activeNav === "Leads" ? "active-icon" : ""
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
                  className={`nav-icon ${activeNav === "Agents" ? "active-icon" : ""
                    }`}
                />
                Agents
              </div>
              <div>
                <ExpandMoreOutlinedIcon />
              </div>
            </li>
            <li
              className={`spacelist ${activeNav === "CallTracking" ? "active" : ""
                }`}
              onClick={() => handleNavClick("CallTracking")}
            >
              <div>
                <SupportAgentIcon
                  className={`nav-icon ${activeNav === "CallTracking" ? "active-icon" : ""
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
                  className={`nav-icon ${activeNav === "Reports" ? "active-icon" : ""
                    }`}
                />
                Reports & Analytics
              </div>
              <div>
                <ExpandMoreOutlinedIcon />
              </div>
            </li>
            <li
              className={`spacelist ${activeNav === "Settings" ? "active" : ""
                }`}
              onClick={() => handleNavClick("Settings")}
            >
              <div>
                <SettingsIcon
                  className={`nav-icon ${activeNav === "Settings" ? "active-icon" : ""
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
 <div  className="working-time-duration">
   <p style={{fontSize:14, color:"grey", }}>Working Time: <br />{formatTime(workingTime)}</p>

{isOnBreak && (
  <p style={{ fontSize:14, color: "grey", fontWeight: "500" }}>
    Break Time: <br />{formatTime(breakTime)}
  </p>
)}
 </div>
          <div className="Dashboard-tesg-profile">

            <button className="Notifiaction-btn" onClick={() => navigate("/notifications")}>
              🔔
            </button>

            {activeFollowUp && (
              <div className="followup-container-popup">
                <div
                  className="followup-popupss"
                  onClick={() => {
                    setActiveFollowUp(null);
                    navigate("/FollowUpSheet");
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700 }}>
                    📞 Follow-up Reminder
                  </div>

                  <div style={{ fontSize: 12, marginTop: 6 }}>
                    {activeFollowUp.Name || "Lead"} – Call now
                  </div>

                  <div style={{ fontSize: 14, marginTop: 4, opacity: 0.9 }}>
                    ⏰{" "}
                    {new Date(activeFollowUp.followUp).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>

                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: "#93c5fd",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => {
                    setActiveFollowUp(null);

                    navigate("/FollowUpSheet", {
                      state: {
                        highlightLeadId: activeFollowUp._id
                      }
                    });
                  }}
                >
                  👉 Click to open Follow-Up
                </div>
              </div>
            )}



<button className="btn-logout" onClick={handleStopResume}>
  {isOnBreak ? "Resume" : "Break"}
</button>


    <button className="btn-logout" onClick={handleLogout}>
      Logout
    </button>
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

          <div className="Dashboard-tesg-card" onClick={() => navigate("/FollowUpSheet")}>
            <div className="sky-circle">
              <img src={unassigned} alt="" className="Dashboard-tesg-image" />
            </div>
            <span >
              Follow Up<h3>{followUpCount}</h3>
            </span>
          </div>

          <div className="Dashboard-tesg-card" onClick={() => navigate("/Show_total_leads")}>
            <div className="sky-circle">
              <img src={assigned} alt="" className="Dashboard-tesg-image" />
            </div>
            <span>
              Assigned Lead<h3>{assignedCount}</h3>
            </span>
          </div>

          <div className="Dashboard-tesg-card" onClick={() => navigate("/WorkSession")}>
            <div className="sky-circle">
              <img src={closassigned} alt="" className="Dashboard-tesg-image" />
            </div>
            <span>
              Call Duration
            </span>
          </div>

          <div className="Dashboard-tesg-card" onClick={() => navigate("/interested-leads")}>
            <div className="sky-circle">
              <img src={closassigned} alt="" className="Dashboard-tesg-image" />
            </div>
            <span>
              Closed Lead <h3>{closedLeadCount}</h3>
            </span>
          </div>


              <div className="Dashboard-tesg-card" onClick={() => navigate("")}>
            <div className="sky-circle">
              <img src= "" alt="" className="Dashboard-tesg-image" />
            </div>
            <span>
             Add Lead
            </span>
          </div>

        </section>
      </main>
    </div>
  );
};

export default Dashboard;





