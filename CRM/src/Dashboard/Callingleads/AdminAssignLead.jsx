import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Callingleads/AllLeads.css";
import { FaSearch, FaPlus } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/* 🔥 OLD DATA SUPPORT (HASH) */
const generateLeadHash = (lead) => {
  const str = JSON.stringify(lead);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
};

/* 🔥 MOBILE NORMALIZATION (MOST IMPORTANT) */
const normalizeMobile = (mobile) => {
  return String(mobile || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/\.0$/, "")
    .replace(/^(\+91)/, "");
};

const SelectedTable = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
    if (!fileId) return;

    fetch(`${BASE_URL}/api/selectedData-Get/${fileId}`)
      .then(res => res.json())
      .then(data => {
        setColumns(data.selectedColumns || []);
        setLeads(data.filteredData || []);
      })
      .catch(err => console.error("Fetch leads error:", err));
  }, [fileId]);

  /* ✅ Fetch agents */
  useEffect(() => {
    fetch(`${BASE_URL}/api/users`)
      .then(res => res.json())
      .then(data => {
        setAgents(Array.isArray(data) ? data : data.agents || []);
      });
  }, []);

  /* ✅ Fetch assigned leads */
  const fetchAssignedLeads = async () => {
    const res = await fetch(`${BASE_URL}/api/assigned-leads`);
    const data = await res.json();
    setAssignedDbLeads(data);
  };

  useEffect(() => {
    fetchAssignedLeads();
  }, []);



  const isLeadAssigned = (lead) => {
  const mobile = normalizeMobile(lead.Mobile);

  return assignedDbLeads.some(block =>
    block.leads.some(l => {
      const dbMobile = normalizeMobile(
        l.data?.Mobile || l.leadId   // 🔥 OLD + NEW BOTH
      );

      return dbMobile === mobile;
    })
  );
};


  const filteredLeads = leads;

  /* =========================
     ✅ AUTO SELECT BY NUMBER
  ========================= */
  useEffect(() => {
    const count = parseInt(searchTerm);

    if (isNaN(count) || count <= 0) {
      setSelectedLeads([]);
      return;
    }

    const selectableIndexes = filteredLeads
      .map((lead, idx) => !isLeadAssigned(lead) ? idx : null)
      .filter(idx => idx !== null)
      .slice(0, count);

    setSelectedLeads(selectableIndexes);
  }, [searchTerm, filteredLeads, assignedDbLeads]);

  const handleCheckboxChange = (idx) => {
    setSelectedLeads(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  /* =========================
     ✅ SELECT ALL FIXED
  ========================= */
  const selectableIndexes = filteredLeads
    .map((lead, idx) => !isLeadAssigned(lead) ? idx : null)
    .filter(idx => idx !== null);

  const handleSelectAll = () => {
    if (selectedLeads.length === selectableIndexes.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(selectableIndexes);
    }
  };

  /* =========================
     ✅ ASSIGN LEADS
  ========================= */
  const assignLeadsToAgent = async (agentId) => {
    const selectedLeadData = selectedLeads.map(idx => filteredLeads[idx]);

    const response = await fetch(`${BASE_URL}/api/assign-leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, fileId, leads: selectedLeadData })
    });

    if (response.ok) {
      alert("Leads assigned successfully!");
      setShowAssignModal(false);
      setSelectedLeads([]);
      fetchAssignedLeads();
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

        <h2>Assign Lead to Agent by Admin</h2>

        <div className="controls">
          <button  className="backbtn" onClick={() => setShowAssignModal(true)}>
            + Assign Lead
          </button>
          <button  className="backbtn" onClick={() => navigate("/HRM-Dashboard")}>
            Home
          </button>
        </div>
      </div>

      {showAssignModal && (
        <div className="modal-overlay">
          <div className="modal-content assign-agent-box">
            <button className="close-button" onClick={() => setShowAssignModal(false)}>×</button>
            <h3>Assign Lead to Agent</h3>

            <div className="agent-list">
              {agents.map(agent => (
                <div
                  key={agent._id}
                  className="agent-card"
                  onClick={() => assignLeadsToAgent(agent._id)}
                >
                  <img
                    src={`${BASE_URL}/uploads/${agent?.image}`}
                    alt={agent.name}
                  />
                  <div>
                    <h4>{agent.name}</h4>
                    <p>{agent.email}</p>
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
                    selectableIndexes.length > 0 &&
                    selectedLeads.length === selectableIndexes.length
                  }
                  onChange={handleSelectAll}
                />
                Select All
              </th>
                  {/* 🔥 NEW LEAD NUMBER COLUMN */}
    <th>Lead No.</th>
              {columns.map((col, i) => (
                <th key={i}>{col}</th>
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

      {/* 🔥 LEAD NUMBER */}
      <td style={{ fontWeight: "600" }}>
        {idx + 1}
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





