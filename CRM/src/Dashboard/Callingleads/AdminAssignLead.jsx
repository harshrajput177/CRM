import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Callingleads/AllLeads.css";
import { FaSearch, FaPlus } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BASE_URL;


const generateLeadHash = (lead) => {
  const str = JSON.stringify(lead);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
};

const SelectedTable = () => {
  const location = useLocation();

  const [leads, setLeads] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignedDbLeads, setAssignedDbLeads] = useState([]);

  const fileId = location.state?.fileId || localStorage.getItem("fileId");

  /* ✅ Fetch saved leads */
  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/selectedData-Get/${fileId}`
        );
        const data = await res.json();
        setColumns(data.selectedColumns || []);
        setLeads(data.filteredData || []);
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };

    if (fileId) fetchSavedData();
  }, [fileId]);

  /* ✅ Fetch agents */
  useEffect(() => {
    const fetchAgents = async () => {
      const res = await fetch(`${BASE_URL}/api/users`);
      const data = await res.json();
      setAgents(Array.isArray(data) ? data : data.agents || []);
    };
    fetchAgents();
  }, []);

  /* ✅ Fetch assigned leads */
  const fetchAssignedLeads = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/assigned-leads`);
      const data = await res.json();
      setAssignedDbLeads(data);
    } catch (err) {
      console.error("Error fetching assigned leads:", err);
    }
  };

  useEffect(() => {
    fetchAssignedLeads();
  }, []);

  /* ✅ GREEN TICK LOGIC (FINAL & CORRECT) */
  const isLeadAssigned = (lead) => {
    const leadHash = generateLeadHash(lead);

    return assignedDbLeads.some(block =>
      block.leads.some(l =>
        String(l.leadId) === leadHash &&
        String(l.sourceFileId) === String(fileId)
      )
    );
  };

  
const handleRoute = useNavigate();

const gotoHome = ()=>{
  handleRoute("/HRM-Dashboard")
}


    const filteredLeads = leads;

  useEffect(() => {
  const count = parseInt(searchTerm);

  if (isNaN(count) || count <= 0) {
    setSelectedLeads([]);
    return;
  }

  // ❌ green tick wali hatao
  const selectableIndexes = filteredLeads
    .map((lead, idx) =>
      !isLeadAssigned(lead) ? idx : null
    )
    .filter(idx => idx !== null)
    .slice(0, count); // 🔥 jitna number dala utni leads

  setSelectedLeads(selectableIndexes);
}, [searchTerm, filteredLeads, assignedDbLeads]);


  const handleCheckboxChange = (idx) => {
    setSelectedLeads((prev) =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

const handleSelectAll = () => {
  const selectableIndexes = filteredLeads
    .map((lead, idx) =>
      !isLeadAssigned(lead) ? idx : null
    )
    .filter(idx => idx !== null);

  if (selectedLeads.length === selectableIndexes.length) {
    setSelectedLeads([]);
  } else {
    setSelectedLeads(selectableIndexes);
  }
};


  /* ✅ Assign Leads */
  const assignLeadsToAgent = async (agentId) => {
    const selectedLeadData = selectedLeads.map(idx => filteredLeads[idx]);

    try {
      const response = await fetch(`${BASE_URL}/api/assign-leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          fileId,
          leads: selectedLeadData
        })
      });

      if (response.ok) {
        alert("Leads assigned successfully!");
        setShowAssignModal(false);
        setSelectedLeads([]);
        await fetchAssignedLeads(); // 🔥 refresh ticks
      }
    } catch (err) {
      console.error("Assign error:", err);
    }
  };




  return (
    <div className="lead-ui-wrapper">
      <div className="lead-topbar">

        <div className="search-bar">
          <FaSearch className="icon" />
       <input
  type="number"
  placeholder="Enter number of leads"
  value={searchTerm}
  onChange={e => setSearchTerm(e.target.value)}
/>

        </div>
<h2>Assign  Lead  to  Agent by  Admin</h2>
        <div className="controls">
          <button
            className="manage-columns"
            onClick={() => setShowAssignModal(true)}
          >
            + Assign Lead
          </button>
          <button className="add-lead-btn">
            <FaPlus /> Add Lead
          </button>
                  <button className="backbtn"  onClick={gotoHome}>Home</button>
        </div>
      </div>

      {showAssignModal && (
        <div className="modal-overlay">
          <div className="modal-content assign-agent-box">
            <button
              className="close-button"
              onClick={() => setShowAssignModal(false)}
            >
              ×
            </button>
            <h3 className="assign-title">Assign Lead to Agent</h3>

            <div className="agent-list">
              {agents.map((agent) => (
                <div
                  key={agent._id}
                  className="agent-card"
                  onClick={() => assignLeadsToAgent(agent._id)}
                >
                  <img
                    src={`${BASE_URL}/uploads/${agent?.image}`}
                    alt={agent.name}
                    className="agent-avatar"
                  />
                  <div className="agent-info">
                    <h4>{agent.name}</h4>
                    <p>{agent.email || "No email"}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      <div className="lead-container">
        <table className="lead-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    selectedLeads.length === filteredLeads.length &&
                    filteredLeads.length > 0
                  }
                  onChange={handleSelectAll}
                />
                <span className="th-all"> Select all</span>
              </th>
              {columns.map((head, i) => (
                <th key={i}>{head}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead, idx) => (
              <tr key={idx}>
                <td>
                  {isLeadAssigned(lead) ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>✔</span>
                  ) : (
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(idx)}
                      onChange={() => handleCheckboxChange(idx)}
                    />
                  )}
                </td>
                {columns.map((col, i) => (
                  <td key={i}>{lead[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SelectedTable;




