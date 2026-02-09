import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ClosedLeads = () => {
  const { id } = useParams();
    console.log("API ID:", id);
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
  const fetchClosedLeads = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/resolved-leads/${id}?type=closed`
      );

      let data = res.data.data || [];

      // ✅ DATE FILTER APPLY
      if (selectedDate) {
        data = data.filter(lead => {
          const leadDate = new Date(lead.createdAt)
            .toISOString()
            .split("T")[0];
          return leadDate === selectedDate;
        });
      }

      setLeads(data);
    } catch (err) {
      console.error("Closed leads error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchClosedLeads();
}, [id, selectedDate]);



  if (loading) return <h3>Loading Closed Leads...</h3>;

  return (
    <div className="leads-container">
      <h2>❌ Closed Leads</h2>
      <br />
<button className="backbtn"  onClick={gotoback}>back</button>
<br />
<br />
      <table className="leads-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Dispose</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.phone}</td>
              <td>{lead.dispose}</td>
              <td>{lead.remark || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClosedLeads;
