import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FollowUp.css"; // same styling use hogi

const BASE_URL = import.meta.env.VITE_BASE_URL;


const InterestedLeads = () => {
  const [interestedLeads, setInterestedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const agentId = localStorage.getItem("agentId");


useEffect(() => {
  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/resolved-leads/${agentId}`
      );

      // ✅ NO FILTER
      setInterestedLeads(res.data.data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  if (agentId) fetchLeads();
  else setLoading(false);
}, [agentId]);



  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="followup-container">
      <h1 className="followup-title">💚 Closed Leads</h1>

      {interestedLeads.length === 0 ? (
        <p style={{ textAlign: "center" }}>No interested leads found.</p>
      ) : (
        <table className="followup-table">
          <thead>
            <tr>
              <th>Lead Name</th>
              <th>Phone</th>
              <th>Remark</th>
              <th>Follow Up Date</th>
              <th>Saved At</th>
            </tr>
          </thead>

         <tbody>
  {interestedLeads.map((item, index) => (
    <tr key={item._id || index}>
      
      {/* ✅ NAME */}
      <td>{item.name || "-"}</td>

      {/* ✅ PHONE */}
      <td>{item.phone || "-"}</td>

      <td>{item.remark || "-"}</td>
      <td>{item.followUp || "-"}</td>
      <td>{new Date(item.createdAt).toLocaleString()}</td>

    </tr>
  ))}
</tbody>

        </table>
      )}
    </div>
  );
};

export default InterestedLeads;
