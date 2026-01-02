import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const TotalAssigend = () => {
  const { id: agentId } = useParams();   // agentId
  const [leads, setLeads] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const gotoback = () => {
    navigate("/allagents");
  };

  useEffect(() => {
    const fetchAssignedLeads = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/assigned-leads/${agentId}`
        );

        /**
         * Expected structure:
         * res.data.leads = [
         *   {
         *     leadId,
         *     data: { Name, Phone, ... }
         *   }
         * ]
         */

        const formatted = (res.data.leads || []).map(l => ({
          leadId: l.leadId,
          name: l.data?.Name || l.data?.name || "N/A",
          phone:
            l.data?.Phone ||
            l.data?.Mobile ||
            l.data?.["Phone Number"] ||
            "-",
        }));

        setLeads(formatted);
      } catch (err) {
        console.error("Error fetching assigned leads", err);
        setLeads([]);
      }
    };

    if (agentId) fetchAssignedLeads();
  }, [agentId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Assigned Leads</h2>

      <br />
      <button className="backbtn" onClick={gotoback}>
        Back
      </button>
      <br />
      <br />

      {leads.length === 0 ? (
        <p>No assigned leads found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Lead ID</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead, index) => (
              <tr key={lead.leadId || index}>
                <td>{lead.name}</td>
                <td>{lead.phone}</td>
                <td>{lead.leadId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TotalAssigend;
