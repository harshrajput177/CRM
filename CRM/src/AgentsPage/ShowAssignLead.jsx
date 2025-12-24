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
      const res = await axios.get(`${BASE_URL}/api/assigned-leads/${agentId}`
);
      // ✅ Direct leads array from API
      const allLeads = Array.isArray(res.data.leads) ? res.data.leads : [];

      setAssignedLeads(allLeads);

    } catch (error) {
      console.error("Error fetching assigned leads:", error);
      setAssignedLeads([]);
    } finally {
      setLoading(false);
    }
  };

  if (agentId) {
    fetchAssigned();
  } else {
    setLoading(false);
  }
}, [agentId]);



  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="assigned-container">
      <h1 className="assigned-title">📌 Assigned Leads</h1>

      {assignedLeads.length === 0 ? (
        <p className="no-data-text">No leads assigned yet.</p>
      ) : (
        <table className="assigned-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
            </tr>
          </thead>

<tbody>
  {assignedLeads.map((lead, index) => {
    const data = lead?.data || {};


    return (
      <tr key={index}>
        <td>{data.Name || data.FullName || "-"}</td>

        <td>
          {data.Phone_1 ||
           data.Contact ||
           data.Phone ||
           data.Phone_Standard_format ||
           "-"}
        </td>

        <td>{data.Email || data.email || "-"}</td>
        <td>{data.City || "-"}</td>
        <td>{data.Zip || "-"}</td>
      </tr>
    );
  })}
</tbody>


        </table>
      )}
    </div>
  );
};

export default AssignedLeadsPage;
