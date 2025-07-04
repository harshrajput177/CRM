import React, { useState } from "react";
import "../../Styles-CSS/HRM-CSS/All-Employes.css";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa";
import AddEmployeeModal from "../HRMDashboard/Admin-H-Employee/AddEmploye";

/* --- Dummy data --- */
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

/* --- Card component --- */
const EmployeeCard = ({ employee }) => (
  <div className="HRM-employee-card">
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

    <div className="HRM-card-buttons">
      <button className="call-btn">Call</button>
      <button className="view-btn">View</button>
    </div>
  </div>
);

/* --- Main directory --- */
const EmployeeDirectory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Search + filters */}
      <div className="HRM-employee-directory">
        <div className="HRM-search-bar">
          <input type="text" placeholder="Employee Name" />
          <input type="text" placeholder="Employee ID" />
            <select>
            <option>Select Department</option>
            <option>IT</option>
            <option>Digital Marketing</option>
            <option>SEO</option>
            <option>Other</option>
          </select>

          <button className="filter-btn">Filters</button>

          {/* 👉 Add Employee button */}
          <button
            className="add-employee-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Add Employee
          </button>


              <button
            className="add-employee-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Add Deparment
          </button>
        </div>

        {/* Card grid */}
        <div className="HRM-employee-grid">
          {employees.map((employee, index) => (
            <EmployeeCard employee={employee} key={index} />
          ))}
        </div>
      </div>

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default EmployeeDirectory;
