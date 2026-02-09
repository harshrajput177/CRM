import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles-CSS/Addlead.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AddLeadsPage = () => {
  const agentId = localStorage.getItem("agentId");

  const [assignedLeads, setAssignedLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    gender: "",
    state: "",
    district: ""
  });

  // 🔹 Fetch Assigned Leads
  const fetchAssignedLeads = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/assigned-leads/${agentId}?view=all`
      );

      const leadsArray = Array.isArray(res.data.leads)
        ? res.data.leads.map(l => ({
            leadId: l.leadId || l._id,
            data: l.data || {}
          }))
        : [];

      setAssignedLeads(leadsArray);
    } catch (error) {
      console.error("Fetch error:", error);
      setAssignedLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agentId) fetchAssignedLeads();
  }, [agentId]);

  // 🔹 Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Add Manual Follow-up Lead
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, number, gender, state, district } = formData;

    if (!name || !number || !gender || !state || !district) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/assigned-leads/manual`, {
        agentId,
        name,
        number,
        gender,
        state,
        district
      });

      // ✅ UI update without reload
      setAssignedLeads(prev => [
        {
          leadId: res.data.lead?.leadId,
          data: {
            Name: name,
            Mobile: number,
            Gender: gender,
            State: state,
            District: district
          }
        },
        ...prev
      ]);

      setFormData({
        name: "",
        number: "",
        gender: "",
        state: "",
        district: ""
      });

      alert("Follow-up lead added");
    } catch (error) {
      console.error("Add lead error:", error);
      alert(error.response?.data?.message || "Failed to add lead");
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
  <div className="addlead-container">
    <h1 className="addlead-title">📌 Add New Leads</h1>

    {/* 🔥 ADD LEAD FORM */}
    <form className="addlead-form" onSubmit={handleSubmit}>
      <h2>➕ Add New Follow-up Lead</h2>

      <input
        type="text"
        name="name"
        placeholder="Customer Name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="tel"
        name="number"
        placeholder="Mobile Number"
        value={formData.number}
        onChange={handleChange}
      />

      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="text"
        name="state"
        placeholder="State"
        value={formData.state}
        onChange={handleChange}
      />

      <input
        type="text"
        name="district"
        placeholder="District"
        value={formData.district}
        onChange={handleChange}
      />

      <button type="submit">Save Lead</button>
    </form>

    {/* 🔥 TOP 6 LEADS */}
    {assignedLeads.length === 0 ? (
      <p style={{ marginTop: "20px" }}>No follow-up leads</p>
    ) : (
      assignedLeads.slice(0, 6).map((lead, index) => (
        <div key={index} className="addlead-card">
          <h3>Lead #{index + 1}</h3>

          <div className="addlead-grid">
            {Object.entries(lead.data).map(([key, value]) => (
              <div className="addlead-field" key={key}>
                <strong>{key}</strong>
                <div>{String(value)}</div>
              </div>
            ))}
          </div>
        </div>
      ))
    )}
  </div>
);

};

export default AddLeadsPage;
