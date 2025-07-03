import React from "react";
import "../../Styles-CSS/LandingPage-CSS/AutomationCard.css";
import FeatureCard from "./F-Cards";

const Automation = () => {
  const automationData = [
    {
      title: "Marketing Automation",
      icon: "📣",
      features: [
        "Email Marketing Automation",
        "Lead Management",
        "Campaign Management",
        "Analytics and Reporting",
      ],
    },
    {
      title: "Sales Automation",
      icon: "🤝",
      features: [
        "Lead Management and Nurturing",
        "Sales Pipeline Management",
        "Contract and Account Management",
        "Task and Activity Automation",
      ],
    },
    {
      title: "HR Automation",
      icon: "🧑‍💼",
      features: [
        "Employee Onboarding",
        "Payroll & Compensation Management",
        "Attendance and Time Tracking",
        "Employee Data Management",
      ],
    },
    {
      title: "MIS Automation",
      icon: "📊",
      features: [
        "Centralized Data Management",
        "Automated Data Collection",
        "Performance Monitoring",
        "Inventory Management",
      ],
    },
  ];

  return (
    <div className="LandingCom4_automation-container">
      <h2>Transform the Way You Work with Intelligent Automation</h2>
      <p>
        Custom automation tools to simplify operations, drive engagement, and
        scale your business effortlessly.
      </p>

      <div className="LandingCom4_cards-container">
        {automationData.map((item, index) => (
          <FeatureCard
            key={index}
            title={item.title}
            icon={item.icon}
            features={item.features}
          />
        ))}
        <div className="LandingCom4_cta-section">
        <p>All-in-One Solution for Small Businesses</p>
        <p>
          Effortlessly connect with customers and engage your audience to build
          lasting relationships. Streamline your sales process to boost
          efficiency, close deals faster, and manage payments seamlessly.
        </p>
        <div className="LandingCom4_cta-icons">
          {automationData.map((item, index) => (
            <div key={index} className="LandingCom4_cta-icon">
              {item.icon} <br />
              {item.title}
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Automation;
