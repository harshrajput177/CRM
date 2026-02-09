import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";


const TotalResolvedLeads = () => {
  const { id } = useParams();
  const [leads, setLeads] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const location = useLocation();
const query = new URLSearchParams(location.search);
const selectedDate = query.get("date");


  const navigate = useNavigate();

  const gotoback = () =>{
    navigate("/allagents")
  }

useEffect(() => {
  const fetchResolved = async () => {
    const res = await axios.get(
      `${BASE_URL}/api/resolved-leads/${id}`
    );

    let data = res.data.data;

    if (selectedDate) {
      data = data.filter(lead => {
        const leadDate = new Date(lead.createdAt)
          .toISOString()
          .split("T")[0];
        return leadDate === selectedDate;
      });
    }

    setLeads(data);
  };

  fetchResolved();
}, [id, selectedDate]);


  return (
    <div style={{ padding: "20px" }}>
      <h2>Total Resolved Leads</h2>

                  <br />
<button className="backbtn"  onClick={gotoback}>back</button>
<br />
<br />

      {leads.length === 0 ? (
        <p>No resolved leads found</p>
      ) : (
        <table border="1" cellPadding="10">
      <thead>
  <tr>
    <th>Name</th>
    <th>Phone</th>
    <th>Dispose</th>
    <th>Remark</th>
    <th>Follow Up</th>
  </tr>
</thead>

        <tbody>
  {leads.map((lead) => (
    <tr key={lead._id}>
      <td>{lead.name}</td>
      <td>{lead.phone}</td>
      <td>{lead.dispose}</td>
      <td>{lead.remark}</td>
      <td>
        {lead.followUp
          ? new Date(lead.followUp).toLocaleDateString()
          : "-"}
      </td>
    </tr>
  ))}
</tbody>

        </table>
      )}
    </div>
  );
};

export default TotalResolvedLeads;
