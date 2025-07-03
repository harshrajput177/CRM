import React from 'react'
import Navbar from '../../LandingPage/Navbar/Navbar';
import Comp1 from '../LandingCom1/LandingCom_1';
import Comp2 from '../LandingCom2/HeaderSection';
import Comp3 from  '../LandingCom2/FeatureList';
import Comp4 from  '../LandingCom3/LandingCom_3';
import Comp5 from '../LandingCom4/AutomationCard';
import Comp6 from '../LandingCom5/Achivements';

function LandingPage() {
  return (
    <div className="folder-page">
    <div className="Landingpage-tesg-allCom">
      <Navbar />
      <Comp1 /> 
      <Comp2 />
      <Comp3 />
      <Comp4 />
      <Comp5 />
      <Comp6 />
    </div>
  </div>
  )
}

export default LandingPage;