import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AgentDetails.css";
import { useParams, useNavigate } from "react-router-dom";

const AgentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);

  const [resolvedLeads, setResolvedLeads] = useState([]);
  const [workingSessions, setWorkingSessions] = useState([]);

  const [stats, setStats] = useState({
    totalAssigned: 0,
    totalResolved: 0,
    totalFollowUp: 0,
    totalClosed: 0,
    totalPending: 0
  });

  const [filterType, setFilterType] = useState("date"); 
// "date" | "month" | "all"

const [selectedMonth, setSelectedMonth] = useState(
  new Date().toISOString().slice(0, 7) // yyyy-mm
);


  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0] // default = today
  );



  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {

    const fetchAgent = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/users/${id}`);
        setAgent(response.data);
      } catch (err) {
        console.error("Error fetching agent:", err);
      }
    };


    const fetchResolvedLeads = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/resolved-leads/${id}`);
        const data = res.data.data;
const filteredLeads = data.filter((lead) => {
  const leadDateObj = new Date(lead.createdAt);

  if (filterType === "date") {
    return leadDateObj.toISOString().split("T")[0] === selectedDate;
  }

  if (filterType === "month") {
    return leadDateObj.toISOString().slice(0, 7) === selectedMonth;
  }

  if (filterType === "all") {
    return true;
  }

  return false; // fallback
});


        setResolvedLeads(filteredLeads);

        const followUps = filteredLeads.filter(
          lead => lead.followUp !== null
        );

        const closedLeads = filteredLeads.filter(
          lead =>
            lead.dispose &&
            lead.dispose.toLowerCase() !== "interested" &&
            lead.followUp === null
        );

        setStats(prev => ({
          ...prev,
          totalResolved: filteredLeads.length,
          totalFollowUp: followUps.length,
          totalClosed: closedLeads.length,
        }));

      } catch (error) {
        console.error("Resolved leads error:", error);
      }
    };

    const fetchWorkingSessions = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/sessions/${id}`);

        const filteredSessions = res.data.filter(session => {
          const sessionDate = new Date(session.startTime)
            .toISOString()
            .split("T")[0];
          return sessionDate === selectedDate;
        });

        setWorkingSessions(filteredSessions);

      } catch (err) {
        console.error("Error fetching work sessions:", err);
      }
    };

    const fetchStats = async () => {
      try {
        // 1️⃣ Total Assigned (322)
        const summaryRes = await axios.get(
          `${BASE_URL}/api/assigned-leads-summary`
        );

        const agentData = summaryRes.data.find(
          (a) => a.agentId === id
        );

        // 2️⃣ Pending (Unresolved)
        const pendingRes = await axios.get(
          `${BASE_URL}/api/assigned-leads/${id}`
        );

        const pendingCount = pendingRes.data.leads.length;

        if (agentData) {
          setStats((prev) => ({
            ...prev,
            totalAssigned: agentData.totalLeads,
            totalPending: pendingCount
          }));
        }

      } catch (error) {
        console.error("Stats error:", error);
      }
    };


    fetchAgent();
    fetchStats();
    fetchResolvedLeads();
    fetchWorkingSessions();
}, [id, selectedDate, selectedMonth, filterType]);


  const handleDeleteAgent = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this agent?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${BASE_URL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Agent deleted successfully");

      // Redirect after delete
      navigate("/allagents"); // 👈 agent list page
    } catch (error) {
      console.error("Delete agent error:", error);
      alert(
        error.response?.data?.message || "Failed to delete agent"
      );
    }
  };



  if (!agent) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="agent-details-container">
      <h1>Agent Profile</h1>

      <div className="filter-type">
  <label>Filter By:</label>
  <select
    value={filterType}
    onChange={(e) => setFilterType(e.target.value)}
  >
    <option value="date">Date Wise</option>
    <option value="month">Month Wise</option>
    <option value="all">Full Data</option>
  </select>
</div>

{filterType === "date" && (
  <input
  className="date-wise-input"
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
  />
)}

{filterType === "month" && (
  <input
  className="month-wise-input"
    type="month"
    value={selectedMonth}
    onChange={(e) => setSelectedMonth(e.target.value)}
  />
)}

      <div className="agent-details-card">
        <img
          src={`${BASE_URL}/uploads/${agent?.image}`}
          alt={agent.name}
          className="agent-details-photo"
        />

        <div className="agent-action-buttons">
          <button className="delete-agent-btn" onClick={handleDeleteAgent}>
            ❌ Delete Agent
          </button>
        </div>


        <table className="agent-details-table">
          <tbody>
            <tr><th>Name</th><td>{agent.name}</td></tr>
            <tr><th>Email</th><td>{agent.email || "-"}</td></tr>
            <tr><th>User Name</th><td>{agent.userId || "-"}</td></tr>
            <tr><th>Phone</th><td>{agent.phone}</td></tr>
            <tr><th>Role</th><td>{agent.role || "Agent"}</td></tr>
            <tr><th>Joined At</th><td>{new Date(agent.createdAt).toLocaleString()}</td></tr>
            <tr><th>Status</th><td style={{ color: "green", fontWeight: 600 }}>Active</td></tr>
          </tbody>
        </table>

        <div className="agent-stats-boxes">
          <div className="stat-box clickable" onClick={() => navigate(`/total-assigned/${id}`)}>
            <h3>
              {stats.totalAssigned} / {stats.totalPending}
            </h3>
            <p>Total Assigned</p>
          </div>


          <div className="stat-box clickable" onClick={() =>
            navigate(`/total-resolved/${id}?date=${selectedDate}`)
          }
          >
            <h3>{stats.totalResolved}</h3>
            <p>Number Of Calls</p>
          </div>

          <div className="stat-box clickable" onClick={() =>
            navigate(`/follow-up/${id}?date=${selectedDate}`)
          }
          >
            <h3>{stats.totalFollowUp}</h3>
            <p>Follow Up</p>
          </div>

          <div className="stat-box clickable" onClick={() =>
            navigate(`/closed-leads/${id}?date=${selectedDate}`)
          }
          >
            <h3>{stats.totalClosed}</h3>
            <p>Closed Lead</p>
          </div>

          <div className="stat-box clickable" onClick={() => navigate(`/working-duration/${id}`)}>
            <h4>Working Duration</h4>
            <p>Check Timing</p>
          </div>

          <div
            className="stat-box clickable"
            onClick={() => navigate(`/acd/${id}`)}
          >
            <h4>ACD</h4>
            <p>Average Call Duration</p>
          </div>


        </div>

      </div>
    </div>
  );
};

export default AgentDetails;