import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../Styles-CSS/TotalAssigned.css"

const TotalAssigend = () => {
  const { id: agentId } = useParams();   // agentId
  const [leads, setLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);


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

  const handleSelect = (leadId) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(l => l.leadId));
    }
  };

  const handleUnassignSelected = async () => {
    if (!selectedLeads.length) return;

    await axios.post(`${BASE_URL}/api/unassign-leads`, {
      agentId,
      leadId: selectedLeads
    });

    // UI update
    setLeads(prev =>
      prev.filter(l => !selectedLeads.includes(l.leadId))
    );

    setSelectedLeads([]);
  };


  const handleUnassignAll = async () => {
    const allId = leads.map(l => l.leadId);

    await axios.post(`${BASE_URL}/api/unassign-leads`, {
      agentId,
      leadId: allId
    });

    setLeads([]);
    setSelectedLeads([]);
  };


  return (
    <div style={{ padding: "20px" }}>
 <div  className="main-nav-assigend">
     <div>
        <h2>Assigned Leads</h2>
    </div>
    <div className="unassign-buttons">
  <button className="btn btn-selected" onClick={handleUnassignSelected}>
    Unassign Selected
  </button>

  <button className="btn btn-all" onClick={handleUnassignAll}>
    Unassign All
  </button>
     <button className="backbtn" onClick={gotoback}>
        Back
      </button>
</div>
 </div>



      {leads.length === 0 ? (
       <img className="empty-file-image" src="../../../public/9276421.jpg" alt="" />
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedLeads.length === leads.length && leads.length > 0}
                />
              </th>

              <th>Name</th>
              <th>Phone</th>
              <th>Lead ID</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead, index) => (
              <tr key={lead.leadId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.leadId)}
                    onChange={() => handleSelect(lead.leadId)}
                  />
                </td>
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
