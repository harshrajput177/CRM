import React from "react";
import "../LandingCom3/LandingCom_3.css";
import girlimage from '../../Images/young-businesswoman-smiling-camera 1.svg';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MovingIcon from '@mui/icons-material/Moving';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PollIcon from '@mui/icons-material/Poll';

function LandingCom3() {
  return (
    <div className="component-third">
      {/* Top SVG Wave */}
      <div className="wave-second">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <defs>
            <linearGradient id="topWaveGradient" x1="0%" y1="0%" x2="100%">
              <stop offset="0%" style={{ stopColor: "#DDDDE6", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#b3daf0", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            fill="url(#topWaveGradient)"
            fillOpacity="1"
            d="M0,224L80,240C160,256,320,288,480,277.3C640,267,800,213,960,186.7C1120,160,1280,160,1360,160L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Main Content */}
      <div className="Compontent-third-page-app">
        <header className="Compontent-third-page-header">
          <h1>Seamlessly Unify Marketing, HR, Sales, MIS Automation on a Single, Powerful CRM Platform</h1>
          <p>
            Boost productivity with seamless integration of marketing, sales, HR, and analytics,
            empowering your team to access real-time data, track performance, and make smarter decisions from
            one centralized platform.
          </p>
          <div className="Compontent-third-page-buttons">
            <button className="Compontent-third-page-primary">Get a Quote</button>
            <button className="Compontent-third-page-secondary">Get Started Free</button>
          </div>
        </header>
        <main className="Compontent-third-page-main-content">
          <div className="Compontent-third-section">
            <div className="Compontent-third-page-icons">
              <div  className="top-icons">
              <div className="icon">
                <MovingIcon />
                <p>Sales Automation</p>
              </div>
              <div className="icon">
                <PersonSearchIcon />
                <p>HR Automation</p>
              </div>
              </div>
               <div className="bottom-icons">
               <div className="icon">
                <VolumeUpIcon />
                <p>Marketing Automation</p>
              </div>
              <div className="icon">
                <PollIcon />
                <p>MIS Automation</p>
              </div>
               </div>
            </div>
            <img
              src={girlimage}
              alt="Person smiling"
              className="center-image"
            />
            <div className="assign-lead">
              <p>Assign Lead</p>
            </div>
          </div>
        </main>
      </div>

  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
  <defs>
    <linearGradient id="reversedWaveGradient" x1="0%" y1="0%" x2="100%">
      <stop offset="0%" style={{ stopColor: "#b3daf0" , stopOpacity: 1 }} />
      <stop offset="100%" style={{ stopColor: "#DDDDE6", stopOpacity: 1 }} />
    </linearGradient>
  </defs>
  <path
    fill="url(#reversedWaveGradient)"
    fillOpacity="1"
    d="M0,224L80,240C160,256,320,288,480,277.3C640,267,800,213,960,186.7C1120,160,1280,160,1360,160L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
      transform="rotate(180, 720, 160)"
  ></path>
  </svg>

     
    </div>
  );
}

export default LandingCom3;
