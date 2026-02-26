import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles-CSS/Addlead.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AddLeadsPage = () => {
  const agentId = localStorage.getItem("agentId");

  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    gender: "",
    state: "",
    district: "",
    remark: "",
    dispose: "",
    followUp: ""
  });
  const disposeOptions = [
  "Ringing",
  "Interested",
  "Not Interested",
  "Call Back Later",
  "Switched Off",
  "Wrong Number",
  "Converted"
];

  // 🔥 Fetch My FollowUps
  const fetchFollowUps = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/resolved-leads/${agentId}?type=followup`
      );

      setFollowUps(res.data.data || []);
    } catch (error) {
      console.error("Fetch followups error:", error);
      setFollowUps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agentId) fetchFollowUps();
  }, [agentId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 Submit Manual FollowUp
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, number, gender, state, district, remark, dispose, followUp } = formData;

    if (!name || !number || !gender || !state || !district || !followUp) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/save-lead-status`, {
        agentId,
        leadId: Date.now().toString(),
        remark,
        dispose,
        followUp,
        manualLead: {
          Name: name,
          Mobile: number,
          Gender: gender,
          State: state,
          District: district
        }
      });

      alert("Follow-up lead added successfully");

      setFormData({
        name: "",
        number: "",
        gender: "",
        state: "",
        district: "",
        remark: "",
        dispose: "",
        followUp: ""
      });

      fetchFollowUps(); // 🔥 Refresh list

    } catch (error) {
      console.error("Add followup error:", error);
      alert("Failed to add follow-up");
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div className="addlead-container">
      <h1 className="addlead-title">📌 Add Manual Follow-Up</h1>

      {/* 🔥 FORM */}
      <form className="addlead-form" onSubmit={handleSubmit}>
        <h2>➕ Add Follow-Up Lead</h2>

        <input type="text" name="name" placeholder="Customer Name" value={formData.name} onChange={handleChange} />
        <input type="tel" name="number" placeholder="Mobile Number" value={formData.number} onChange={handleChange} />

        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
        <input type="text" name="district" placeholder="District" value={formData.district} onChange={handleChange} />

<input 
  type="text" 
  name="remark" 
  placeholder="Remark" 
  value={formData.remark} 
  onChange={handleChange} 
/>

<select
  name="dispose"
  value={formData.dispose}
  onChange={handleChange}
>
  <option value="">Select Dispose Status</option>
  {disposeOptions.map((option, index) => (
    <option key={index} value={option}>
      {option}
    </option>
  ))}
</select>

<input
  type="date"
  name="followUp"
  value={formData.followUp}
  onChange={handleChange}
/>

        <button type="submit">Save Follow-Up</button>
      </form>

      {/* 🔥 FOLLOWUP LIST */}
      {followUps.length === 0 ? (
        <p style={{ marginTop: "20px" }}>No follow-up leads</p>
      ) : (
        followUps.slice(0, 10).map((lead, index) => (
          <div key={lead._id} className="addlead-card">
            <h3>FollowUp #{index + 1}</h3>

            <div className="addlead-grid">
              <div><strong>Name:</strong> {lead.name}</div>
              <div><strong>Phone:</strong> {lead.phone}</div>
              <div><strong>State:</strong> {lead.state}</div>
              <div><strong>District:</strong> {lead.district}</div>
              <div><strong>Remark:</strong> {lead.remark}</div>
              <div><strong>Dispose:</strong> {lead.dispose}</div>
              <div><strong>FollowUp Date:</strong> {new Date(lead.followUp).toLocaleDateString()}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AddLeadsPage;