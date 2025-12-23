import React, { useEffect, useState } from 'react';
import '../../../Styles-CSS/HRM-CSS/HRM-das.css';
import img1 from '../../../Images/GWI-LOGO.png'
import { useNavigate } from "react-router-dom";

import {
  FaUsers,
  FaUserCheck,
  FaTasks,
  FaCheckCircle,
  FaUserFriends,
  FaDollarSign,
  FaBriefcase,
  FaUserTie,
  FaCog,
  FaChevronDown,
  FaChevronUp
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
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);


  const toggleDropdown = (key) => {
    setShowDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const navigate = useNavigate();


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
          <ul>
            <li
              onClick={() => toggleDropdown('hrm')}
              className={`dropdown-toggle ${showDropdowns.hrm ? 'active' : ''}`}
            >
              <span className='all-drop'>           <span className='icon-text-only'>  <FaUserTie className="HRM-sidebaricon" /> Dashboard</span>
                {showDropdowns.hrm ? <FaChevronUp className="dropdown-icon" /> : <FaChevronDown className="dropdown-icon" />}
              </span>
              {showDropdowns.hrm && (
                <ul className="dropdown">
                  <li onClick={(e) => { e.stopPropagation(); setActivePage('dashboard'); }}>HRM Dashboard</li>
                  <li onClick={(e) => { e.stopPropagation(); setActivePage('addEmployee'); }}>Add Employee</li>
                  <li onClick={(e) => e.stopPropagation()}>Designations</li>
                  <li onClick={(e) => e.stopPropagation()}>Employee leaves</li>
                  <li onClick={(e) => e.stopPropagation()}>Admin leaves</li>
                  <li onClick={(e) => e.stopPropagation()}>Holidays</li>
                  <li onClick={(e) => e.stopPropagation()}>Time Sheet</li>
                  <li onClick={(e) => e.stopPropagation()}>Schedule</li>
                  <li onClick={(e) => e.stopPropagation()}>Overtime</li>
                  <li onClick={(e) => e.stopPropagation()}>Warning</li>
                </ul>
              )}
            </li>

            <li onClick={() => toggleDropdown('department')} className={`dropdown-toggle ${showDropdowns.department ? 'active' : ''}`}>
              <span className='all-drop'>  <span className='icon-text-only'>   <FaUserFriends className="HRM-sidebaricon" /> Department</span>       
                     {showDropdowns.department ? <FaChevronUp className="dropdown-icon" /> : <FaChevronDown className="dropdown-icon" />}</span>


              {showDropdowns.department && (
                <ul className="dropdown">

                  <li onClick={(e) => e.stopPropagation()}>Designations</li>
                  <li onClick={(e) => e.stopPropagation()}>Employee leaves</li>
                  <li onClick={(e) => e.stopPropagation()}>Admin leaves</li>
                  <li onClick={(e) => e.stopPropagation()}>Holidays</li>
                  <li onClick={(e) => e.stopPropagation()}>Time Sheet</li>
                  <li onClick={(e) => e.stopPropagation()}>Schedule</li>
                  <li onClick={(e) => e.stopPropagation()}>Overtime</li>
                  <li onClick={(e) => e.stopPropagation()}>Warning</li>
                </ul>
              )}
            </li>




            <li onClick={() => toggleDropdown('Leaves')} className={`dropdown-toggle ${showDropdowns.Leaves ? 'active' : ''}`}>
              <span className='all-drop'>  <span className='icon-text-only'>   <FaUserFriends className="HRM-sidebaricon" /> Leaves</span>     
                       {showDropdowns.Leaves ? <FaChevronUp className="dropdown-icon" /> : <FaChevronDown className="dropdown-icon" />}</span>


              {showDropdowns.Leaves && (
                <ul className="dropdown">

                  <li onClick={(e) => e.stopPropagation()}>Designations</li>
                  <li onClick={(e) => e.stopPropagation()}>Employee leaves</li>
                  <li onClick={(e) => e.stopPropagation()}>Admin leaves</li>
    
                </ul>
              )}
            </li>





            <li onClick={() => toggleDropdown('payroll')} className={`dropdown-toggle ${showDropdowns.payroll ? 'active' : ''}`}>
              <span className='all-drop'>  <span className='icon-text-only'>   <FaDollarSign className="HRM-sidebaricon" />   Payroll</span>              {showDropdowns.payroll ? <FaChevronUp className="dropdown-icon" /> : <FaChevronDown className="dropdown-icon" />}</span>


              {showDropdowns.payroll && (
                <ul className="dropdown">

                  <li onClick={(e) => e.stopPropagation()}>Designations</li>
                  <li onClick={(e) => e.stopPropagation()}>Employee leaves</li>
                  <li onClick={(e) => e.stopPropagation()}>Admin leaves</li>
                  <li onClick={(e) => e.stopPropagation()}>Holidays</li>
        
                </ul>
              )}
            </li>

            <li onClick={() => toggleDropdown('attendance')} className={`dropdown-toggle ${showDropdowns.attendance ? 'active' : ''}`}>
              <span className='all-drop'>  <span className='icon-text-only'><FaCheckCircle className="HRM-sidebaricon" />Employe Attendence</span>              {showDropdowns.department ? <FaChevronUp className="dropdown-icon" /> : <FaChevronDown className="dropdown-icon" />}</span>

              {showDropdowns.attendance && (
                <ul className="dropdown">

                  <li onClick={(e) => e.stopPropagation()}>Designations</li>
                  <li onClick={(e) => e.stopPropagation()}>Employee leaves</li>
                  <li onClick={(e) => e.stopPropagation()}>Admin leaves</li>
                  <li onClick={(e) => e.stopPropagation()}>Holidays</li>
   
                </ul>
              )}
            </li>


            <li onClick={() => toggleDropdown('setting')} className="dropdown-toggle">
              <span className='icon-text-only'> <FaCog className="HRM-sidebaricon" /> Setting</span>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="HRM-main-content">
        <header className="navbar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <h2>Hello 👋</h2>
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
                <div className="HRMdas-card"
                  onClick={() => navigate("/selectlead")}>
                  <FaTasks className="icon" />
                  Select Title Lead

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
                  Total Agent: 151
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
    </div>
  );
}

export default HRM;
