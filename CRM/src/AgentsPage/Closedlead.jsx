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
        const res = await axios.get(`${BASE_URL}/api/all-lead-status`
);

 const filtered = res.data.data.filter(
          (lead) => lead.dispose === "Not Interested" && lead.agentId === agentId
        );

        setInterestedLeads(filtered);
      } catch (error) {
        console.error("Error fetching interested leads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

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
              <tr key={index}>
                <td>{item.lead?.Name || "-"}</td>

                <td>
                  {item.lead?.Phone_1 ||
                    item.lead?.Phone_Standard_format ||
                    item.lead?.Phone_From_WEBSITE ||
                    item.lead?.Phone ||
                    "-"}
                </td>

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
