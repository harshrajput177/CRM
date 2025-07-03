import React from "react";
import '../../LandingPage/Navbar/Navbar.css'
import tesgimage from '../../Images/Tesg-logo.png';

const Navbar = ()=>{
    return(
        <div  className="navbar-tesg-crm">
            <div className="navbar-tesg-icon">
              <img src={tesgimage} alt="" />
            </div>
            <div className="navbar-tesg-link">
                 <ul>
                    <li>Products</li>
                    <li>Solutions</li>
                    <li>Pricing</li>
                    <li>Resources</li>
                 </ul>
            </div>
            <div className="navbar-tesg-buttons">
                <button className="navbar-tesg-get">Get Started Free</button>
                <button  className="Navbar-tesg-Book-demo ">Book a Demo Today</button>
            </div>
        </div>
    )
}

export default Navbar;