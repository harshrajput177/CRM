import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssignedLeads.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AssignedLeadsPage = () => {
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const agentId = localStorage.getItem("agentId");

  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const res = await axios.get(
  `${BASE_URL}/api/assigned-leads/${agentId}?view=all`
);


        const leadsArray = Array.isArray(res.data.leads)
          ? res.data.leads.map(l => ({
              leadId: l.leadId,
              data: l.data || {}   // ✅ important
            }))
          : [];

        setAssignedLeads(leadsArray);
      } catch (error) {
        console.error(error);
        setAssignedLeads([]);
      } finally {
        setLoading(false);
      }
    };

    if (agentId) fetchAssigned();
  }, [agentId]);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="assigned-container">
      <h1 className="assigned-title">📌 Assigned Leads</h1>

      {assignedLeads.length === 0 ? (
        <p>No leads assigned</p>
      ) : (
        assignedLeads.map((lead, index) => (
          <div key={index} className="assigned-card">
            <h3>Lead #{index + 1}</h3>

            <div className="lead-grid">
              {Object.entries(lead.data).map(([key, value]) => (
                <div className="lead-field" key={key}>
                  <strong>{key}:</strong>
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

export default AssignedLeadsPage;

