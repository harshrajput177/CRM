import React, { useEffect, useState } from 'react';
import '../../../Styles-CSS/HRM-CSS/HRM-das.css';
import img1 from '../../../Images/GWI-LOGO.png'
import { useNavigate } from "react-router-dom";
import axios from "axios";


import {
  FaUsers,
  FaUserCheck,
  FaCheckCircle,
  FaUserFriends,
  FaDollarSign,
} from 'react-icons/fa';


function HRM() {
  const [showDropdowns, setShowDropdowns] = useState({
    hrm: false,
    department: false,
    Leaves: false,
    payroll: false,
    attendance: false,
    setting: false
  });

  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [secondsWorked, setSecondsWorked] = useState(0); // ⬅ Work timer
  const [onBreak, setOnBreak] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);
const [attendance, setAttendance] = useState([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);


  const toggleDropdown = (key) => {
    setShowDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const navigate = useNavigate();

  const handleLogout = () =>{
    navigate("/")
  }


  const handleDateHover = async (dateStr) => {
  setHoverDate(dateStr);

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


  // Timer effect
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
        <div className="logo"><img src={img1} alt="" className='gwi-image' /></div>
        <nav className="HRM-sidebar-nav">
 
        </nav>
      </aside>

      <div className="HRM-main-content">
        <header className="navbar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <h2>Hello 👋</h2>
          </div>

               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <button  className='button-logout'   onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="dashboard-scrollable">
          {activePage === 'dashboard' && (
            <>
              <div className="stats">
                <div className="HRMdas-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/all-files")}>
                  <FaUsers className="icon" />

                  Select File
                </div>
                <div className="HRMdas-card"   onClick={() => navigate("/leads")}>
                  <FaDollarSign className="icon" />
                 Total Leads
                </div>
            
                <div
                  className="HRMdas-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/droplead")}
                >
                  <FaCheckCircle className="icon" />
                  Drop File
                </div>
                <div className="HRMdas-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/allagents")}>
                   <FaUserFriends className="icon" />
                  Total Agent
                </div>
                <div className="HRMdas-card" onClick={() => navigate("/leadtable")}>
                      <FaUserCheck className="icon" />
                  Assign Lead
                </div>
              </div>
            </>
          )}

          {activePage === 'addEmployee' && <EmployeeDirectory />}
        </div>
      </div>

      {/* ================= CALENDAR + ATTENDANCE ================= */}
<div className="attendance-wrapper">
  <h3>📅 Attendance Calendar</h3>

  <div className="calendar-grid">
    {Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      const dateStr = `2026-01-${String(day).padStart(2, "0")}`;

      return (
        <div
          key={day}
          className="calendar-day"
          onMouseEnter={() => handleDateHover(dateStr)}
        >
          {day}
        </div>
      );
    })}
  </div>

  {/* ================= USER STATUS PANEL ================= */}
  {hoverDate && (
    <div className="attendance-panel">
      <h4>👥 Users on {hoverDate}</h4>

      {attendance.length === 0 ? (
        <p>No data</p>
      ) : (
        attendance.map((u, i) => (
          <div key={i} className={`user-row ${u.status}`}>
            <span>{u.name}</span>
            <span>
              {u.status === "online" ? "🟢 Online" : "🔴 Offline"}
            </span>
          </div>
        ))
      )}
    </div>
  )}
</div>

    </div>
  );
}

export default HRM;
