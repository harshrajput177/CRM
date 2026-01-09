import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Callleadpage.css";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const CallLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remarks, setRemarks] = useState({});
  const [disposals, setDisposals] = useState({});
  const [followUps, setFollowUps] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [savedLeads, setSavedLeads] = useState({});
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const agentId = localStorage.getItem("agentId");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/assigned-leads/${agentId}`
        );

const leadsArray = Array.isArray(res.data.leads)
  ? res.data.leads.map(l => ({
      leadId: l.leadId,
      sourceFileId: l.sourceFileId,
      assignedAt: l.assignedAt,
      data: l.data || {}        // ✅ FIX
    }))
  : [];



        setLeads(leadsArray);
      } catch (err) {
        console.error("Error fetching leads:", err);
        setLeads([]);
      }
    };

    if (agentId) fetchLeads();
  }, [agentId]);

  const handleNextLead = () => {
    if (currentIndex < leads.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowCalendar(false);
    }
  };

  const handlePreviousLead = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowCalendar(false);
    }
  };

const handleSaveRemark = async () => {
  const currentLead = leads[currentIndex];
  const remark = remarks[currentIndex];
  const dispose = disposals[currentIndex];
  const followUp = followUps[currentIndex];

  if (!remark || !dispose) {
    alert("⚠️ Remark & Dispose required");
    return;
  }

  try {
    await axios.post(`${BASE_URL}/api/save-lead-status`, {
      agentId,
      leadId: currentLead.leadId,   // ✅ FIXED
      remark,
      dispose,
      followUp: followUp || null,
    });

    setSavedLeads(prev => ({ ...prev, [currentIndex]: true }));
    alert("✅ Lead saved");
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("❌ Save failed");
  }
};

const handleFollowUpLead = async () => {
  const currentLead = leads[currentIndex];
  const followUp = followUps[currentIndex];
  const remark = remarks[currentIndex];

  if (!remark) {
    alert("Remark required");
    return;
  }

  if (!followUp) {
    alert("Select follow-up date");
    return;
  }

  try {
    await axios.post(`${BASE_URL}/api/save-lead-status`, {
      agentId,
      leadId: currentLead.leadId,
      remark,
      dispose: "Interested",
      followUp,
    });

    // current lead remove
    setLeads(prev => prev.filter((_, i) => i !== currentIndex));
    setCurrentIndex(0);
    setShowStatusMenu(false);

    alert("✅ Follow-up saved");
  } catch (err) {
    alert("❌ Follow-up failed");
  }
};


const handleCloseLead = async () => {
  const currentLead = leads[currentIndex];
  const remark = remarks[currentIndex];

  if (!remark) {
    alert("Remark required");
    return;
  }

  try {
    await axios.post(`${BASE_URL}/api/save-lead-status`, {
      agentId,
      leadId: currentLead.leadId,
      remark,
      dispose: "Not Interested",
      followUp: null,
    });

    setLeads(prev => prev.filter((_, i) => i !== currentIndex));
    setCurrentIndex(0);
    setShowStatusMenu(false);

    alert("❌ Lead closed");
  } catch (err) {
    alert("❌ Failed to close lead");
  }
};




  if (leads.length === 0) {
    return (
      <div className="call-leads-page">
        <h1>Call Leads</h1>
        <p>No leads assigned.</p>
      </div>
    );
  }

  return (
    <div className="call-leads-page">
      <h1>Call Leads</h1>

      <div className="lead-card-page">
        {/* Lead Details */}
  

  <div className="lead-details">
  <h3>Lead Details</h3>

  <div className="lead-grid">
    {leads[currentIndex]?.data &&
      Object.entries(leads[currentIndex].data).map(([key, value]) => (
        <div className="lead-field" key={key}>
          <strong>{key}:</strong>
          <div>{String(value)}</div>
        </div>
      ))}
  </div>
</div>



        {/* Remark */}
        <div className="form-group">
          <label>Remark</label>
          <textarea
            value={remarks[currentIndex] || ""}
            onChange={e =>
              setRemarks(prev => ({ ...prev, [currentIndex]: e.target.value }))
            }
          />
        </div>

        {/* Dispose */}
        <div className="form-group">
          <label>Dispose Status</label>
          <select
            value={disposals[currentIndex] || ""}
            onChange={e =>
              setDisposals(prev => ({
                ...prev,
                [currentIndex]: e.target.value,
              }))
            }
          >
            <option value="">-- Select --</option>
            <option value="Ringing">Ringing</option>
            <option value="Interested">Interested</option>
            <option value="Not Interested">Not Interested</option>
          </select>
        </div>

        {/* Follow up */}
        <div className="form-group">
          <label>Follow Up</label>
          {!showCalendar ? (
            <button
              className="btn btn-calendar"
              onClick={() => setShowCalendar(true)}
            >
              Select Date
            </button>
          ) : (
            <input
              type="date"
              value={followUps[currentIndex] || ""}
              onChange={e =>
                setFollowUps(prev => ({
                  ...prev,
                  [currentIndex]: e.target.value,
                }))
              }
            />
          )}
        </div>

   

        {/* Status */}
        <button
          className="btn btn-status"
          onClick={() => setShowStatusMenu(prev => !prev)}
        >
          Update Lead Status
        </button>

        {showStatusMenu && (
          <div className="status-menu">
            <button className="status-follow" onClick={handleFollowUpLead}>
              Follow Up
            </button>
            <button className="status-close" onClick={handleCloseLead}>
              Close Lead
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="navigation-buttons">
        <button
          className="btn btn-prev"
          disabled={currentIndex === 0}
          onClick={handlePreviousLead}
        >
          Previous Lead
        </button>

        <button className="btn btn-next" onClick={handleNextLead}>
          Next Lead
        </button>
      </div>
    </div>
  );
};

export default CallLeadsPage;




