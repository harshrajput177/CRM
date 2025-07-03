import React from "react";
import "./LandingCom_1.css";
import performanceChart from "../../Images/Landingp1.svg"; // Replace with actual image path
import pieChart from "../../Images/Landingp2.svg"; // Replace with actual image path
import customerTable from "../../Images/Landingp3.svg"; // Replace with actual image path

const HeroSection = () => {
  return (
    <div>
      <div className="Tesg-hero-section">
        <div className="hero-content">
          <h1>Your All-in-One CRM to Close Deals Faster</h1>
          <p>
            Effortlessly manage leads, track progress, and connect with customers
            using tools like VoIP calling, analytics, and customizable
            workflows—all in one platform.
          </p>
          <div className="hero-buttons">
            <button className="demo-button">Get a demo</button>
            <button className="free-button">Get Started Free</button>
          </div>
        </div>
        <div className="black_circle_Image">
          <div className="balck-circle-shadow"></div>
        <div className="hero-graphics">
          <div className="graphic">
            <img src={performanceChart} alt="Sales Performance" />
          </div>
          <div className="graphic">
            <img src={pieChart} alt="March 2023 Analytics" />
          </div>
            <img src={customerTable} alt="All Customers"  className="last-img" />
        </div>
      </div>
      </div>
  <div className="hero-wave">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 180">
    <defs>
      <linearGradient id="heroGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: "#DDDDE6", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#9AC9E4", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      fill="url(#heroGradient1)"
      fillOpacity="1"
      d="M0,160L60,133.3C120,107,240,53,360,32C480,11,600,21,720,53.3C840,85,960,139,1080,144C1200,149,1320,107,1380,85.3L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
    ></path>
  </svg>
</div>

<div className="hero-wave_2">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 180">
    <defs>
      <linearGradient id="heroGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: "rgb(242, 242, 242)", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "rgb(225, 240, 244)", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path
      fill="url(#heroGradient2)"
      fillOpacity="1"
        d="M0,160L60,133.3C120,107,240,53,360,32C480,11,600,21,720,53.3C840,85,960,139,1080,144C1200,149,1320,107,1380,85.3L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
    ></path>
  </svg>
</div>

    
    </div>
  );
};

export default HeroSection;



// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
//   <path fill="#f3f4f5" fill-opacity="1" d="M0,160L60,133.3C120,107,240,53,360,32C480,11,600,21,720,53.3C840,85,960,139,1080,144C1200,149,1320,107,1380,85.3L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
// </svg>