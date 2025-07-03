import React from "react";
import FeatureCard from "../LandingCom2/FeatureCards";
import "../../Styles-CSS/LandingPage-CSS/FeatureList.css";
import icon_1 from '../../Images/mdi_gear.svg';
import icon_2 from '../../Images/material-symbols_person.svg';
import icon_3 from '../../Images/mdi_robot.svg';
import icon_4 from '../../Images/mdi_clock.svg';
import icon_5 from '../../Images/mdi_clock.svg';
import icon_6 from '../../Images/mdi_group.svg';
import icon_7 from '../../Images/uis_graph-bar.svg';
import icon_8 from '../../Images/mdi_tools.svg';

const features = [
  { icon: icon_1, title: "Lead and Pipeline Management", description: "Track, prioritize, and nurture leads efficiently." },
  { icon: icon_2, title: "Customizable Workflows", description: "Tailor workflows to suit specific industries or business needs." },
  { icon: icon_3, title: "Real-Time Analytics and Reporting", description: "Get actionable insights on team performance and sales trends." },
  { icon: icon_4, title: "Multi-Industry Flexibility", description: "Adaptable for any business niche, from startups to enterprises." },
  { icon: icon_5, title: "Seamless Integrations", description: "Connect with your favorite tools like email platforms, calendars, and marketing software." },
  { icon: icon_6, title: "Customer Database Management", description: "Centralize customer information for easy access and management." },
  { icon: icon_7, title: "Task and Activity Tracking", description: "Assign tasks, set deadlines, and track activity progress in real-time." },
  { icon: icon_8, title: "Smart Automation", description: "Automate follow-ups, reminders, and notifications." },
];

const FeatureList = () => (
<>
<div className="Com2-feature-list">
    {features.map((feature, index) => (
      <FeatureCard key={index} {...feature} />
    ))}
  
  </div>
</>
);

export default FeatureList;
