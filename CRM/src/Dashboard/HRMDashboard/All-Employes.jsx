import React from "react";
import "../../Styles-CSS/HRM-CSS/All-Employes.css";
import {
FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaGlobe

} from 'react-icons/fa';

const employees = [
  {
    name: "Naira Muskan",
    title: "Chief Executive Officer",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    name: "Emily Johnson",
    title: "Chief Innovation Officer",
    image: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    name: "Jessica Miller",
    title: "Product Manager",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    name: "Jennifer Brown",
    title: "Engineering Project Manager",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
];

const EmployeeCard = ({ employee }) => (
  <div className="employee-card">
    <img src={employee.image} alt={employee.name} className="profile-pic" />
    <h3>{employee.name}</h3>
    <p>{employee.title}</p>
    <div className="social-icons">
            <FaFacebookF className="social-icon" />
            <FaTwitter className="social-icon" />
            <FaLinkedinIn className="social-icon" />
            <FaYoutube className="social-icon" />
            <FaGlobe className="social-icon" />
    </div>
    <div className="card-buttons">
      <button className="call-btn">Call</button>
      <button className="view-btn">View</button>
    </div>
  </div>
);

const EmployeeDirectory = () => {
  return (
    <div className="employee-directory">
      <div className="search-bar">
        <input type="text" placeholder="Employee Name" />
        <input type="text" placeholder="Employee ID" />
        <select>
          <option>Employee Designation</option>
               <option>Employee Designation</option>
                    <option>Employee Designation</option>

        </select>
        <button className="filter-btn">Filters</button>
        <button className="add-employee-btn">Add Employee</button>
      </div>

      <div className="employee-grid">
        {employees.map((employee, index) => (
          <EmployeeCard employee={employee} key={index} />
        ))}
      </div>
    </div>
  );
};

export default EmployeeDirectory;