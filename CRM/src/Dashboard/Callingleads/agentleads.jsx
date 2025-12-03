import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "../Callingleads/AllLeads.css";
import { FaSearch, FaPlus, FaSlidersH, FaTh } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_BASE_URL;


const Agentleads = () => 
  {
  const location = useLocation();
  const [leads, setLeads] = useState(location.state?.leads || []);
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const isSelected = (idx) => selectedLeads.includes(idx);
  const fileId = location.state?.fileId || localStorage.getItem("fileId") || "68833a7646bb1b4a02906929";

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

useEffect(() => {
  const fetchSavedData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/selectedData-Get/${fileId}`);
      const data = await res.json();
      console.log("Data fetched:", data);
      setColumns(data.selectedColumns || []);
      setLeads(data.filteredData || []);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
    }
  };

  if (fileId) fetchSavedData(); // ✅ only fetch when fileId exists
}, [fileId]);


  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users`
);
        const data = await response.json();
        setAgents(data.agents || []);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, []);

  const assignLeadsToAgent = async (agentId) => {
    const selectedLeadData = selectedLeads.map(idx => filteredLeads[idx]);

    try {
      const response = await fetch(`${BASE_URL}/api/assign-leads`
, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agentId, leads: selectedLeadData }),
      });

      if (response.ok) {
        alert("Leads assigned successfully!");
        setShowAssignModal(false);
        setSelectedLeads([]);
      } else {
        console.error("Failed to assign leads");
      }
    } catch (error) {
      console.error("Error assigning leads:", error);
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
          <button className="sort-btn">Sort By</button>
          <input type="text" className="date-range" value="9 Jun 25 - 9 Jun 25" readOnly />
          <button className="filter-btn">
            <FaSlidersH /> Filter
          </button>
          <button className="add-lead-btn">
            <FaPlus /> Add Lead
          </button>
        </div>
      </div>

      {showAssignModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowAssignModal(false)}>×</button>
            <h3>Select Agent</h3>
            <ul>
              {agents.map((agent) => (
                <li key={agent._id}>
                  <button onClick={() => assignLeadsToAgent(agent._id)}>{agent.name}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="lead-container">
        <table className="lead-table">
          <thead>
            <tr>
              <th  className="th-all">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                  onChange={handleSelectAll}
                />
            Select All
              </th>
              {columns.map((head, i) => (
                <th key={i}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length ? (
              filteredLeads.map((lead, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(idx)}
                      onChange={() => handleCheckboxChange(idx)}
                    />
                  </td>
                  {columns.map((col, i) => (
                    <td key={i}>
                      {col === "avatar" || col === "companyLogo" ? (
                        <img
                          src={lead[col]}
                          alt={col}
                          className={col === "avatar" ? "avatar" : "company-logo"}
                        />
                      ) : col === "leadStatus" ? (
                        <span className={`status-badge ${lead[col].toLowerCase().replace(/\s/g, "-")}`}>
                          {lead[col]}
                        </span>
                      ) : (
                        lead[col]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1}>No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Agentleads;