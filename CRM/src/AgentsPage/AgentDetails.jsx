import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AgentDetails.css";
import { useParams } from "react-router-dom";

const AgentDetails = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [showResolved, setShowResolved] = useState(false);
  const [resolvedLeads, setResolvedLeads] = useState([]);

  const [stats, setStats] = useState({
    totalAssigned: 0,
    totalResolved: 0,
    workingDuration: 0,
  });

  // 🔹 Fetch Agent Basic Details
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`);
        setAgent(response.data);
      } catch (err) {
        console.error("Error fetching agent:", err);
      }
    };

    const fetchResolvedLeads = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/resolved-leads/${id}`);
        setResolvedLeads(res.data.data);

        setStats((prev) => ({
          ...prev,
          totalResolved: res.data.totalResolved,
        }));
      } catch (error) {
        console.error("Resolved leads error:", error);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/assigned-leads-summary`);
        const agentData = res.data.find((a) => a.agentId === id);

        if (agentData) {
          const joinedDate = new Date(agent?.createdAt || new Date());
          const today = new Date();
          const diffDays =
            Math.floor((today - joinedDate) / (1000 * 60 * 60 * 24));

          setStats((prev) => ({
            ...prev,
            totalAssigned: agentData.totalLeads,
            workingDuration: `${diffDays} Days`,
          }));
        }
      } catch (error) {
        console.error("Stats error:", error);
      }
    };

    fetchAgent();
    fetchStats();
    fetchResolvedLeads();
  }, [id]);

 

  if (!agent) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="agent-details-container">
      <h1>Agent Profile</h1>

      <div className="agent-details-card">
        <img
          src={`http://localhost:5000/uploads/${agent.image}`}
          alt={agent.name}
          className="agent-details-photo"
        />

        <table className="agent-details-table">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{agent.name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{agent.email || "-"}</td>
            </tr>
            <tr>
              <th>User Name</th>
              <td>{agent.userId || "-"}</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>{agent.phone}</td>
            </tr>
            <tr>
              <th>Role</th>
              <td>{agent.role || "Agent"}</td>
            </tr>
            <tr>
              <th>Joined At</th>
              <td>{new Date(agent.createdAt).toLocaleString()}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td style={{ color: "green", fontWeight: 600 }}>Active</td>
            </tr>
          </tbody>
        </table>

        <div className="agent-stats-boxes">
          <div className="stat-box">
            <h3>{stats.totalAssigned}</h3>
            <p>Total Assigned</p>
          </div>

          <div
            className="stat-box clickable"
            onClick={() => setShowResolved(!showResolved)}
          >
            <h3>{stats.totalResolved}</h3>
            <p>Total Resolved {showResolved ? "▲" : "▼"}</p>
          </div>

          <div className="stat-box">
            <h3>{stats.workingDuration}</h3>
            <p>Working Duration</p>
          </div>
        </div>
      </div>

    

      
    </div>
  );
};

export default AgentDetails;



      //  const res = await axios.get(`http://localhost:5000/api/assigned-leads-summary`);
      //                               `http://localhost:5000/api/sessions/${id}`
      //   const res = await axios.get(`http://localhost:5000/api/resolved-leads/${id}`);