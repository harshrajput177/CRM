import React, { useState } from 'react';
import '../../Styles-CSS/HRM-CSS/HRM-das.css';

import {
  FaUsers,
  FaUserCheck,
  FaTasks,
  FaCheckCircle,
  FaUserFriends,
  FaDollarSign,
  FaBriefcase,
  FaUserTie,
  FaPhone,
  FaChartBar,
  FaCog,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import EmployeeDirectory from './All-Employes';

function HRM() {
  const [showDropdowns, setShowDropdowns] = useState({
    hrm: false,
    department: false,
    leaves: false,
    payroll: false,
    attendance: false,
    setting: false
  });

  const [activePage, setActivePage] = useState('dashboard');

  const toggleDropdown = (key) => {
    setShowDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="app-container">
      <aside className="HRM-sidebar">
        <div className="logo">Anez</div>
        <nav className="HRM-sidebar-nav">
          <ul>
            <li
              onClick={() => toggleDropdown('hrm')}
              className={`dropdown-toggle ${showDropdowns.hrm ? 'active' : ''}`}
            >
              <FaUserTie className="HRM-sidebaricon" /> HRM
              {showDropdowns.hrm ? <FaChevronUp className="dropdown-icon" /> : <FaChevronDown className="dropdown-icon" />}
              {showDropdowns.hrm && (
                <ul className="dropdown">
                  <li onClick={() => setActivePage('dashboard')}>Dashboard</li>
                  <li onClick={() => setActivePage('addEmployee')}>Add Employee</li>
                  <li>Designations</li>
                  <li>Biometric Attendance</li>
                  <li>Office Loan</li>
                  <li>Employee leaves</li>
                  <li>Admin leaves</li>
                  <li>Holidays</li>
                  <li>Time Sheet</li>
                  <li>Schedule</li>
                  <li>Overtime</li>
                  <li>Warning</li>
                </ul>
              )}
            </li>

            <li onClick={() => toggleDropdown('department')} className="dropdown-toggle">
              <FaUserFriends className="HRM-sidebaricon" /> Department
            </li>
            <li onClick={() => toggleDropdown('leaves')} className="dropdown-toggle">
              <FaBriefcase className="HRM-sidebaricon" /> Leaves
            </li>
            <li onClick={() => toggleDropdown('payroll')} className="dropdown-toggle">
              <FaDollarSign className="HRM-sidebaricon" /> PayRoll
            </li>
            <li onClick={() => toggleDropdown('attendance')} className="dropdown-toggle">
              <FaTasks className="HRM-sidebaricon" /> Employe Attendence
            </li>
            <li onClick={() => toggleDropdown('setting')} className="dropdown-toggle">
              <FaCog className="HRM-sidebaricon" /> Setting
            </li>
          </ul>
        </nav>
      </aside>

      <div className="HRM-main-content">
        <header className="navbar">
          <h2>Hello Harsh 👋</h2>
          <div className="navbar-right">
            <input type="text" placeholder="Search Here . . ." />
            <div className="profile">Jhon Smith ●</div>
          </div>
        </header>

        <div className="dashboard-scrollable">
          {activePage === 'dashboard' && (
            <>
              <div className="stats">
                <div className="HRMdas-card">
                  <FaUsers className="icon" />
                  Total Employee: 313
                </div>
                <div className="HRMdas-card">
                  <FaUserCheck className="icon" />
                  On Leave Employee: 55
                </div>
                <div className="HRMdas-card">
                  <FaTasks className="icon" />
                  Today's Working Employee: 55
                </div>
                <div className="HRMdas-card">
                  <FaCheckCircle className="icon" />
                  Completed Project: 150
                </div>
                <div className="HRMdas-card">
                  <FaUserFriends className="icon" />
                  Total Client: 151
                </div>
                <div className="HRMdas-card">
                  <FaDollarSign className="icon" />
                  Pay roll
                </div>
                <div className="HRMdas-card">
                  <FaBriefcase className="icon" />
                  Leave Applied
                </div>
                <div className="HRMdas-card">
                  <FaBriefcase className="icon" />
                  Leave Pending
                </div>
              </div>

              <div className="schedule-calendar">
                <div className="schedule">
                  <h3>Meeting Schedule</h3>
                  <ul>
                    <li>Project Kickoff - June 1, 2024 - 10:00 AM</li>
                    <li>Weekly Team Sync - June 5, 2024 - 02:00 PM</li>
                    <li>Client Presentation - June 10, 2024 - 11:00 AM</li>
                    <li>Monthly Review - June 15, 2024 - 03:00 PM</li>
                    <li>Weekly Review - June 20, 2024 - 11:00 AM</li>
                  </ul>
                </div>
                <div className="calendar">
                  <h3>Calendar</h3>
                  <p>[Calendar Placeholder]</p>
                </div>
              </div>

              <div className="schedule-calendar joiningDate">
                <div className="schedule">
                  <h3>Joininig Date of everyEmployee</h3>
                  <ul>
                    <li>Project Kickoff </li>
                    <li>Weekly Team Sync </li>
                    <li>Client Presentation </li>
                    <li>Monthly Review </li>
                    <li>Weekly Review </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {activePage === 'addEmployee' && <EmployeeDirectory />}
        </div>
      </div>
    </div>
  );
}

export default HRM;
