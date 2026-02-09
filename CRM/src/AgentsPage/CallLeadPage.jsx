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

  const [followTimes, setFollowTimes] = useState({});
const [followAmPm, setFollowAmPm] = useState({});
const [followHours, setFollowHours] = useState({}); // 1–12
const [followMinutes, setFollowMinutes] = useState({}); 


  const agentId = localStorage.getItem("agentId");


  

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get(
  `${BASE_URL}/api/assigned-leads/${agentId}?view=work`
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


  const buildFollowUpDateTime = (index) => {
  const date = followUps[index];
  const hour = followHours[index];
  const minute = followMinutes[index];
  const ampm = followAmPm[index];

  if (!date || !hour || !minute || !ampm) return null;

  let hours = parseInt(hour);

  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  return `${date}T${hours.toString().padStart(2, "0")}:${minute}`;
};



  const handleFollowUpLead = async () => {
  const currentLead = leads[currentIndex];
  const remark = remarks[currentIndex];
  const dispose = disposals[currentIndex];

  const followUpDateTime = buildFollowUpDateTime(currentIndex);

  if (!remark) return alert("⚠️ Remark required");
  if (!dispose) return alert("⚠️ Dispose required");
  if (!followUpDateTime) return alert("⚠️ Date, Time & AM/PM required");

  try {
    await axios.post(`${BASE_URL}/api/save-lead-status`, {
      agentId,
      leadId: currentLead.leadId,
      remark,
      dispose,
      followUp: followUpDateTime,
    });

    setLeads(prev => prev.filter((_, i) => i !== currentIndex));
    setCurrentIndex(0);
    setShowStatusMenu(false);
  } catch (err) {
    console.error(err);
    alert("❌ Failed to save follow-up");
  }
};


  const handleCloseLead = async () => {
    const currentLead = leads[currentIndex];
    const remark = remarks[currentIndex];
    const dispose = disposals[currentIndex];

    if (!remark) {
      alert("⚠️ Remark required");
      return;
    }

    if (!dispose) {
      alert("⚠️ Dispose required");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/save-lead-status`, {
        agentId,
        leadId: currentLead.leadId,
        remark,
        dispose,
        followUp: null,
      });

      // ✅ ONLY AFTER SUCCESS
      setLeads(prev => prev.filter((_, i) => i !== currentIndex));
      setCurrentIndex(0);
      setShowStatusMenu(false);

      alert("❌ Lead closed");
    } catch (err) {
      console.error(err);
      alert("❌ Close failed");
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

  {/* Date */}
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

  <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
    
    {/* Hour 1–12 */}
    <select
      value={followHours[currentIndex] || ""}
      onChange={e =>
        setFollowHours(prev => ({
          ...prev,
          [currentIndex]: e.target.value,
        }))
      }
    >
      <option value="">Hour</option>
      {[...Array(12)].map((_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </select>

    {/* Minutes */}
    <select
      value={followMinutes[currentIndex] || ""}
      onChange={e =>
        setFollowMinutes(prev => ({
          ...prev,
          [currentIndex]: e.target.value,
        }))
      }
    >
      <option value="">Min</option>
      {[...Array(60)].map((_, i) => (
        <option key={i} value={i.toString().padStart(2, "0")}>
          {i.toString().padStart(2, "0")}
        </option>
      ))}
    </select>

    {/* AM / PM */}
    <select
      value={followAmPm[currentIndex] || ""}
      onChange={e =>
        setFollowAmPm(prev => ({
          ...prev,
          [currentIndex]: e.target.value,
        }))
      }
    >
      <option value="">AM/PM</option>
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>
  </div>
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
            <button
              className="status-follow"
              disabled={
                !remarks[currentIndex] ||
                !disposals[currentIndex] ||
                !followUps[currentIndex]
              }
              onClick={handleFollowUpLead}
            >
              Follow Up
            </button>

            <button
              className="status-close"
              disabled={
                !remarks[currentIndex] ||
                !disposals[currentIndex]
              }
              onClick={handleCloseLead}
            >
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




