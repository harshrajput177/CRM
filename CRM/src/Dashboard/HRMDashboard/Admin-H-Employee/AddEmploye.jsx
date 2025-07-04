import React from "react";
import { FaTimes } from "react-icons/fa";
import "../../../Styles-CSS/HRM-CSS/AddEmploye.css";

const AddEmployeeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;      

  return (
    <div className="hrm-modal__overlay" onClick={onClose}>
      <div
        className="hrm-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hrm-modal__header">
          <h2>Add New Employee</h2>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>

        <form className="hrm-modal__form">
          <div className="Employee-form-grid">
            <div className="Employee-form-group">
              <label>
                First Name <span>*</span>
              </label>
              <input type="text" required />
            </div>
            <div className="Employee-form-group">
              <label>
                Last Name <span>*</span>
              </label>
              <input type="text" required />
            </div>
            <div className="Employee-form-group">
              <label>
                Contact Number <span>*</span>
              </label>
              <input type="tel" required />
            </div>
            <div className="Employee-form-group">
              <label>
                Email <span>*</span>
              </label>
              <input type="email" required />
            </div>
            <div className="Employee-form-group">
              <label>
                User Name <span>*</span>
              </label>
              <input type="text" required />
            </div>
            <div className="Employee-form-group">
              <label>
                Employee ID <span>*</span>
              </label>
              <input type="text" required />
            </div>

            <div className="Employee-form-group full-width">
              <label>
                Address <span>*</span>
              </label>
              <textarea rows="3" required />
            </div>

            <div className="Employee-form-group">
              <label>
                Employee Designation <span>*</span>
              </label>
              <select required defaultValue="">
                <option value="" disabled>
                  -- Select --
                </option>
                <option>Information Technology Department</option>
                <option>Human Resources</option>
                <option>Finance</option>
              </select>
            </div>
            <div className="Employee-form-group">
              <label>
                Joining Date <span>*</span>
              </label>
              <input type="date" required />
            </div>
            <div className="Employee-form-group">
              <label>
                Account Holder Name <span>*</span>
              </label>
              <input type="text" required />
            </div>
            <div className="Employee-form-group">
              <label>
                Account Number <span>*</span>
              </label>
              <input type="text" required />
            </div>
          </div>

          <div className="hrm-modal__footer">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
