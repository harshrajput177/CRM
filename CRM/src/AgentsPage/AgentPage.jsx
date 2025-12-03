import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";   
import "../AgentsPage/AgentPage.css";

const AgentPage = () => {
  const [agents, setAgents] = useState([]);
  const navigate = useNavigate(); 

  const BASE_URL = import.meta.env.VITE_BASE_URL;


  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/users`
, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Dono case handle kar lega
      const data = response.data.users || response.data.agents || response.data;
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  return (
    <>
      <div className="Allagent-toolbar">
        <div className="Agent-search-box">
          <span className="Agent-search-icon">🔍</span>
          <input type="text" placeholder="Search" />
        </div>
        <div className="toolbar-buttons">
          <button>Sort By</button>
          <button>9 Jun 25 - 9 Jun 25</button>
          <button>
            <span className="filter-icon">≡</span> Filter
          </button>

          <button className="add-lead-btn" onClick={() => navigate("/Register")}>
            + Add Agent
          </button>
          
        </div>
      </div>

      <div className="Allagent-agent-page">
        <h1>Our Agents</h1>
    <div className="Allagent-agent-cards">
  {agents.map((agent, index) => (
    <div
      className="Allagent-agent-card"
      key={index}
      onClick={() => navigate(`/agent-details/${agent._id || agent.id}`)}
    >
     <img
  src={
    agent?.image
      ? `${BASE_URL}/uploads/${agent.image}`
      : "https://via.placeholder.com/100"
  }
  alt="Agent"
  className="Allagent-agent-image"
      />

      <div className="Allagent-agent-info">
        <h2>Name: {agent.name}</h2>
        <p>Mobile Number: {agent.phone}</p>
        <p>Role: {agent.role || "Agent"}</p>
      </div>
    </div>
  ))}
</div>

      </div>
    </>
  );
};

export default AgentPage;

