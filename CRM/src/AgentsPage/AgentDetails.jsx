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
  });

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
        setResolvedLeads(res.data.data);

        setStats((prev) => ({
          ...prev,
          totalResolved: res.data.totalResolved,
        }));
      } catch (error) {
        console.error("Resolved leads error:", error);
      }
    };

    const fetchWorkingSessions = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/sessions/${id}`);
    setWorkingSessions(res.data);

    console.log(res)
  } catch (err) {
    console.error("Error fetching work sessions:", err);
  }
};

    const fetchStats = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/assigned-leads-summary`);
        const agentData = res.data.find((a) => a.agentId === id);

        if (agentData) {
          const joinedDate = new Date(agent?.createdAt || new Date());
          const today = new Date();

          setStats((prev) => ({
            ...prev,
            totalAssigned: agentData.totalLeads,
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
  }, [id]);


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

        {/* 🔥 UPDATED ROUTABLE STAT-BOXES */}
        <div className="agent-stats-boxes">

          {/* Total Assigned Route */}
          <div
            className="stat-box clickable"
            onClick={() => navigate(`/total-assigned/${id}`)}
          >
            <h3>{stats.totalAssigned}</h3>
            <p>Total Assigned</p>
          </div>

          {/* Total Resolved Route */}
          <div
            className="stat-box clickable"
            onClick={() => navigate(`/total-resolved/${id}`)}
          >
            <h3>{stats.totalResolved}</h3>
            <p>Total Resolved</p>
          </div>

          {/* Working Duration Route */}
          <div
            className="stat-box clickable"
            onClick={() => navigate(`/working-duration/${id}`)}
          >
            <h4>Working Duration</h4>
            <p>Check Timing</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AgentDetails;