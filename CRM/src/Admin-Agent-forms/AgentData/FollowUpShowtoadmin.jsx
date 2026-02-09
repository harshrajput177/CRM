import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const FollowUpLeads = () => {
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    
      const location = useLocation();
    const query = new URLSearchParams(location.search);
    const selectedDate = query.get("date");

  const gotoback = () =>{
    navigate("/allagents")
  }


 useEffect(() => {
  const fetchFollowUps = async () => {
    const res = await axios.get(`${BASE_URL}/api/resolved-leads/${id}`);

    let data = res.data.data.filter(
      lead => lead.followUp !== null
    );

    if (selectedDate) {
      data = data.filter(lead => {
        const leadDate = new Date(lead.createdAt)
          .toISOString()
          .split("T")[0];
        return leadDate === selectedDate;
      });
    }

    setLeads(data);
    setLoading(false);
  };

  fetchFollowUps();
}, [id, selectedDate]);


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
