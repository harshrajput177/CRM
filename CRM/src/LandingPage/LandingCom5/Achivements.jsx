import React from "react";
import "../LandingCom5/Achievement.css";

const Achievement = () => {
  const achievements = [
    { percentage: "114%", description: "Boost Online Visibility", icon: "📈" },
    { percentage: "55%", description: "Seal More Agreements", icon: "🤝" },
    { percentage: "50%", description: "Boost Customer Satisfaction", icon: "⭐" },
  ];

  return (
    <div className="Comp-achievements-container">
      <h2>What You Can Achieve in Just 1 Year with Our CRM:</h2>
      <div className="achievements-grid">
        {achievements.map((item, index) => (
          <div key={index} className="achievement-card">
            <div className="achievement-icon">{item.icon}</div>
            <h3>{item.percentage}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
      <p className="cta-text">
        Streamline Operations, Boost Sales, and Elevate Customer Experiences with Our CRM!
      </p>
      <button className="cta-button">Get Started Free</button>
    </div>
  );
};

export default Achievement;
