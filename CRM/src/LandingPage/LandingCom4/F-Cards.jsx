import React from "react";
import "../../Styles-CSS/LandingPage-CSS/F-Cards.css";

const F_Card = ({ title, icon, features }) => {
  return (
    <div className=" LandingCom4_feature-card">
      <div className="LandingCom4_feature-icon">{icon}</div>
      <h3>{title}</h3>
      <ul>
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <button className="LandingCom4_learn-more-button">Learn More</button>
    </div>
  );
};

export default F_Card;
