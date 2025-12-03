import React, { useEffect, useState } from "react";
import axios from "axios";



const BASE_URL = import.meta.env.VITE_BASE_URL;


const CallLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remarks, setRemarks] = useState({});
  const [disposals, setDisposals] = useState({});
  const [followUps, setFollowUps] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [savedLeads, setSavedLeads] = useState({});


  const agentId = localStorage.getItem("agentId");

 useEffect(() => {
  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/assigned-leads/${agentId}`
      );

      console.log("Fetched Leads:", res.data);

      // ✅ Correct source
const leadsArray = Array.isArray(res.data.leads)
  ? res.data.leads.map(lead => lead?.data?.data) // 👈 real data level
  : [];

setLeads(leadsArray);


setLeads(leadsArray);

    } catch (err) {
      console.error("Error fetching leads:", err);
      setLeads([]);
    }
  };

  if (agentId) fetchLeads();
}, [agentId]);

const handleNextLead = () => {
  if (!savedLeads[currentIndex]) {
    alert("❗ fill required Column and save  data  after call  next");
    return;
  }

  if (currentIndex < leads.length - 1) {
    setCurrentIndex(prev => prev + 1);
    setShowCalendar(false);
  } else {
    alert("All leads have been called!");
  }
};


  const handleRemarkChange = (e) => {
    const value = e.target.value;
    setRemarks((prev) => ({
      ...prev,
      [currentIndex]: value,
    }));
  };

  const handleDisposeChange = (e) => {
    const value = e.target.value;
    setDisposals((prev) => ({
      ...prev,
      [currentIndex]: value,
    }));
  };

  const handleFollowUpChange = (e) => {
    const value = e.target.value;
    setFollowUps((prev) => ({
      ...prev,
      [currentIndex]: value,
    }));
  };

  const handlePreviousLead = () => {
  if (currentIndex > 0) {
    setCurrentIndex(prev => prev - 1);
    setShowCalendar(false);
  }
};

const handleSaveRemark = async () => {
  const currentLead = leads[currentIndex];
  const remark = remarks[currentIndex] || "";
  const dispose = disposals[currentIndex] || "";
  const followUp = followUps[currentIndex] || "";

  if (!remark || !dispose) {
    alert("⚠️ Please fill Remark & Dispose before saving");
    return;
  }

  try {
    await axios.post(`${BASE_URL}/api/save-lead-status`
, {
      agentId,
      lead: currentLead,
      remark,
      dispose,
      followUp,
    });

    // ✅ Mark this lead as saved
    setSavedLeads(prev => ({
      ...prev,
      [currentIndex]: true
    }));

    alert("✅ Lead saved successfully!");
  } catch (error) {
    console.error("❌ Error saving lead status:", error);
    alert("Failed to save lead status");
  }
};


  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Call Leads</h1>

      {leads.length === 0 ? (
        <p>No leads assigned.</p>
      ) : (
        <div style={{ marginTop: "30px" }}>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "10px",
              display: "inline-block",
              minWidth: "300px",
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
        {/* Lead Info Section */}
<div style={{ marginBottom: "20px" }}>
  <h3>Lead Details</h3>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "10px",
      marginTop: "10px",
    }}
  >
    {Object.entries(leads[currentIndex]).map(([key, value]) => (
      <div
        key={key}
        style={{
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "10px",
          background: "#f9f9f9",
        }}
      >
        <strong style={{ textTransform: "capitalize" }}>{key}:</strong>
        <div style={{ marginTop: "5px" }}>{String(value)}</div>
      </div>
    ))}
  </div>
</div>


            {/* Remark Section */}
            <div style={{ marginTop: "15px" }}>
              <label>
                <b>Remark:</b>
              </label>
              <textarea
                value={remarks[currentIndex] || ""}
                onChange={handleRemarkChange}
                placeholder="Enter remark here..."
                style={{
                  width: "100%",
                  minHeight: "60px",
                  marginTop: "5px",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            {/* Dispose Section */}
            <div style={{ marginTop: "15px" }}>
              <label>
                <b>Dispose Status:</b>
              </label>
              <select
                value={disposals[currentIndex] || ""}
                onChange={handleDisposeChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginTop: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="">-- Select Status --</option>
                <option value="Ringing">Ringing</option>
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Follow Up Section */}
            <div style={{ marginTop: "15px" }}>
              <label>
                <b>Follow Up:</b>
              </label>
              <br />
              {!showCalendar ? (
                <button
                  onClick={() => setShowCalendar(true)}
                  style={{
                    marginTop: "8px",
                    padding: "8px 15px",
                    fontSize: "14px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    background: "#2196F3",
                    color: "white",
                    border: "none",
                  }}
                >
                  Select Follow Up Date
                </button>
              ) : (
                <input
                  type="date"
                  value={followUps[currentIndex] || ""}
                  onChange={handleFollowUpChange}
                  style={{
                    marginTop: "8px",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    width: "100%",
                  }}
                />
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveRemark}
              style={{
                marginTop: "15px",
                padding: "8px 15px",
                fontSize: "14px",
                borderRadius: "5px",
                cursor: "pointer",
                background: "#4CAF50",
                color: "white",
                border: "none",
              }}
            >
              Save Remark & Dispose
            </button>
          </div>

          <br />

  <button
    onClick={handlePreviousLead}
    disabled={currentIndex === 0}
    style={{
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      background: currentIndex === 0 ? "#ccc" : "#607D8B",
      color: "white",
      border: "none"
    }}
  >
    Previous Lead
  </button>

  <button
    onClick={handleNextLead}
    style={{
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      background: "#2196F3",
      color: "white",
      border: "none",
      margin: "0 40px"
    }}
  >
    Next Lead
  </button>


        </div>
      )}
    </div>
  );
};

export default CallLeadsPage;



