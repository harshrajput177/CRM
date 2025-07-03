import React, { useState } from 'react';
import '../Dashboard/Dashboard.css';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import unassigned from '../Images/Inbox.png';
import assigned from '../Images/User.png'
import closassigned from '../Images/Checkmark.png'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import tesgpic from '../Images/Tesg-logo.png';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DashboardBar from './PICHART/DashboardBar';
import leaderImg from '../Images/leaderImg.png';

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('Dashboard');  // Track active nav item

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    // Switch styling
  }));

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleNavClick = (navItem) => {
    setActiveNav(navItem);  // Set clicked item as active
  };

  return (
    <div className={`Tesg-dashboard ${darkMode ? 'dark' : 'light'}`}>
      <aside className="Dashboard-tesg-sidebar">
        <div className="Dashboard-tesg-logo">
          <img src={tesgpic} alt="" className='Dashboard-tesg-logo-img' />
        </div>
        {/* //navbar  */}
        <nav className='left-nav-dashboard'>
          <ul>
            <li
              className={` dashboardlist ${activeNav === 'Dashboard' ? 'active' : ''}`}
              onClick={() => handleNavClick('Dashboard')}
            >
              <DashboardIcon className={`nav-icon ${activeNav === 'Dashboard' ? 'active-icon' : ''}`} />
              Dashboard
            </li>
            <li
              className={` spacelist ${activeNav === 'Leads' ? 'active' : ''}`}
              onClick={() => handleNavClick('Leads')}
            >
             <div>
             <ViewInArRoundedIcon className={`nav-icon ${activeNav === 'Leads' ? 'active-icon' : ''}`} />
             Leads
             </div>
              <div>
              <ExpandMoreOutlinedIcon />
              </div>
            </li>
            <li
              className={` spacelist ${activeNav === 'Agents' ? 'active' : ''}`}
              onClick={() => handleNavClick('Agents')}
            >
             <div>
             <AccountBoxOutlinedIcon className={`nav-icon ${activeNav === 'Agents' ? 'active-icon' : ''}`} />
             Agents
             </div>
              <div>
              <ExpandMoreOutlinedIcon />
              </div>
            </li>
            <li
              className={` spacelist ${activeNav === 'CallTracking' ? 'active' : ''}`}
              onClick={() => handleNavClick('CallTracking')}
            >
             <div>
             <SupportAgentIcon className={`nav-icon ${activeNav === 'CallTracking' ? 'active-icon' : ''}`} />
             Call Tracking
             </div>
             <div>
             <ExpandMoreOutlinedIcon />
             </div>
            </li>
            <li
              className={` spacelist ${activeNav === 'Reports' ? 'active' : ''}`}
              onClick={() => handleNavClick('Reports')}
            >
             <div>
             <AssessmentIcon className={`nav-icon ${activeNav === 'Reports' ? 'active-icon' : ''}`} />
             Reports & Analytics
             </div>
              <div>
              <ExpandMoreOutlinedIcon />
              </div>
            </li>
            <li
              className={` spacelist ${activeNav === 'Settings' ? 'active' : ''}`}
              onClick={() => handleNavClick('Settings')}
            >
              <div>
              <SettingsIcon className={`nav-icon ${activeNav === 'Settings' ? 'active-icon' : ''}`} />
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
            <div><NotificationsIcon /></div>
            <AccountCircleIcon className='Admin-dashboard-profile' />
          </div>
          {/* <FormControlLabel  
             control={<MaterialUISwitch  sx={{ m: 1 }} defaultChecked />}
          /> */}
        </header>
        <section className="Dashboard-tesg-summary-cards">
          <div className="Dashboard-tesg-card">
            <div className='sky-circle'><img src={unassigned} alt="" className="Dashboard-tesg-image" /></div>
            <span>Unassigned <h3>350</h3></span>
          </div>
          <div className="Dashboard-tesg-card">
            <div className='sky-circle'>
              <img src={assigned} alt="" className="Dashboard-tesg-image" />
            </div>
            <span>Assigned <h3>450</h3></span>
          </div>
          <div className="Dashboard-tesg-card">
            <div className='sky-circle'>
              <img src={closassigned} alt="" className="Dashboard-tesg-image" />
            </div>
            <span>Closed <h3>3500</h3></span>
          </div>
        </section>


        <section className="Dashboard-tesg-table-section">
  <table>
    <thead className='head-of-table'>
      <tr>
        <th className='head-thl'>Teammates</th>
        <th>Assigned</th>
        <th>Dialed</th>
        <th>Pending</th>
        <th>Follow-Up</th>
        <th>Converted</th>
        <th>Notes</th>
        <th className='head-thr'>Feedback</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="teammate-cell">
          <img src={leaderImg} alt="" className='agent-img-table' />
          Nimi Martins
        </td>
        <td>34</td>
        <td>34</td>
        <td>34</td>
        <td>34</td>
        <td>34</td>
        <td>Awaiting response</td>
        <td>Follow up on document</td>
      </tr>
      <tr>
        <td className="teammate-cell">
          <img src={leaderImg} alt="" className='agent-img-table' />
          Nimi Martins
        </td>
        <td>34</td>
        <td>34</td>
        <td>34</td>
        <td>34</td>
        <td>34</td>
        <td>Awaiting response</td>
        <td>Follow up on document</td>
      </tr>
      <tr>
        <td className="teammate-cell">
          <img src={leaderImg} alt="" className='agent-img-table' />
          Priya Shah
        </td>
        <td>34</td>
        <td>34</td>
        <td>34</td>
        <td>34</td>
        <td>34</td>
        <td>Feedback from demo</td>
        <td>Check feedback</td>
      </tr>
    </tbody>
  </table>
</section>
        <DashboardBar />
      </main>
   
    </div>

  );
};

export default Dashboard;



