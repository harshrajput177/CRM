import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../Callingleads/AllLeads.css";
import { FaSearch, FaPlus } from "react-icons/fa";

const API_BASE = "http://localhost:5000";

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

  // ✅ Fetch saved selected data (columns + leads)
  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/selectedData-Get/${fileId}`);
        const data = await res.json();

        setColumns(data.selectedColumns || []);
        setLeads(data.filteredData || []);
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
    };

    if (fileId) fetchSavedData();
  }, [fileId]);

  // ✅ Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      const res = await fetch(`${API_BASE}/api/users`);
      const data = await res.json();
      setAgents(Array.isArray(data) ? data : data.agents || []);
    };
    fetchAgents();
  }, []);

  // ✅ Fetch assigned leads (FULL BLOCK STRUCTURE)
  const fetchAssignedLeads = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/assigned-leads`);
      const data = await res.json();
      setAssignedDbLeads(data); // ✅ keep full structure
    } catch (err) {
      console.error("Error fetching assigned leads:", err);
    }
  };

  useEffect(() => {
    fetchAssignedLeads();
  }, []);

  // ✅ Correct Green Tick Logic
  // ✅ Correct Green Tick Logic (FIXED)
// ✅ CORRECT Green Tick Logic (NO FALSE TICKS)
const isLeadAssigned = (lead) => {
  const leadUniqueId = String(lead?.id || lead?.leadId || lead?.data?.id || "");

  return assignedDbLeads.some(block =>
    block.leads.some(l => {
      const dbLeadId = String(l.leadId);
      const dbFileId = String(l.sourceFileId);

      // ✅ Normalize DB leadId (remove timestamp part if exists)
      const normalizedDbLeadId = dbLeadId.includes("_")
        ? dbLeadId.split("_")[0]
        : dbLeadId;

      const leadMatch = normalizedDbLeadId === leadUniqueId;
      const fileMatch = dbFileId === String(fileId);

      return leadMatch && fileMatch;
    })
  );
};

  const handleCheckboxChange = (idx) => {
    setSelectedLeads((prev) =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map((_, i) => i));
    }
  };

  // ✅ Assign Leads
  const assignLeadsToAgent = async (agentId) => {
    const selectedLeadData = selectedLeads.map(idx => filteredLeads[idx]);

    try {
      const response = await fetch(`${API_BASE}/api/assign-leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          fileId,
          leads: selectedLeadData.map(l => ({
            leadId: l.id,
            sourceFileId: fileId,
            data: l
          }))
        })
      });

      if (response.ok) {
        alert("Leads assigned successfully!");
        setShowAssignModal(false);
        setSelectedLeads([]);
        await fetchAssignedLeads(); // ✅ refresh ticks instantly
      }
    } catch (err) {
      console.error("Assign error:", err);
    }
  };

  const filteredLeads = leads.filter((lead) =>
    columns.some((col) =>
      String(lead[col] || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="lead-ui-wrapper">
      <div className="lead-topbar">
        <div className="search-bar">
          <FaSearch className="icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="controls">
          <button className="manage-columns" onClick={() => setShowAssignModal(true)}>
            + Assign Lead
          </button>
          <button className="add-lead-btn">
            <FaPlus /> Add Lead
          </button>
        </div>
      </div>

      {showAssignModal && (
        <div className="modal-overlay">
          <div className="modal-content assign-agent-box">
            <button className="close-button" onClick={() => setShowAssignModal(false)}>×</button>
            <h3 className="assign-title">Assign Lead to Agent</h3>
            <div className="agent-list">
              {agents.map((agent) => (
                <div
                  key={agent._id}
                  className="agent-card"
                  onClick={() => assignLeadsToAgent(agent._id)}
                >
                  <img
                    src={`http://localhost:5000/uploads/${agent.image}`}
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
                  checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
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





