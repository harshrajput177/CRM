import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";


const FollowUpLeads = () => {
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

  const gotoback = () =>{
    navigate("/allagents")
  }


  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/resolved-leads/${id}`);

        const followUps = res.data.data.filter(
          lead => lead.followUp !== null
        );

        setLeads(followUps);
      } catch (err) {
        console.error("Follow-up error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowUps();
  }, [id]);

  if (loading) return <h3>Loading Follow Ups...</h3>;

  return (
    <div className="leads-container">
      <h2>📅 Follow Up Leads</h2>

            <br />
<button className="backbtn"  onClick={gotoback}>back</button>
<br />
<br />

      <table className="leads-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Remark</th>
            <th>Follow Up Date</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.phone}</td>
              <td>{lead.remark || "-"}</td>
              <td>{new Date(lead.followUp).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FollowUpLeads;
