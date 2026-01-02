import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";


const ClosedLeads = () => {
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);


  const navigate = useNavigate();

  const gotoback = () =>{
    navigate("/allagents")
  }

  useEffect(() => {
    const fetchClosedLeads = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/resolved-leads/${id}`);

        const closed = res.data.data.filter(
          lead =>
            lead.dispose &&
            lead.dispose.toLowerCase() !== "interested" &&
            lead.followUp === null
        );

        setLeads(closed);
      } catch (err) {
        console.error("Closed leads error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClosedLeads();
  }, [id]);

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
