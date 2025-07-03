import React from "react";
import "../../Styles-CSS/LandingPage-CSS/FeatureCards.css";

const FeatureCard = ({ icon, title, description }) => (
  <div className="Com2-feature-card">
     <img src={icon} alt="" />
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default FeatureCard;
