import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FollowUp.css"

const BASE_URL = import.meta.env.VITE_BASE_URL;


const FollowUpSheet = () => {
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const agentId = localStorage.getItem("agentId");


  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [editRemark, setEditRemark] = useState("");
  const [editDispose, setEditDispose] = useState("");
  const [editFollowUp, setEditFollowUp] = useState("");

useEffect(() => {
  const fetchFollowUps = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/resolved-leads/${agentId}`
      );

      // ✅ SAME LOGIC AS FollowUpLeads.jsx
      const filtered = res.data.data.filter(
        lead => lead.followUp !== null
      );

      setFollowups(filtered);

    } catch (error) {
      console.error("Error fetching follow-ups:", error);
    } finally {
      setLoading(false);
    }
  };

  if (agentId) fetchFollowUps();
  else setLoading(false);

}, [agentId]);



const openEditModal = (lead) => {
  setCurrentLead(lead);
  setEditRemark(lead.remark ?? "");
  setEditDispose(lead.dispose ?? "");
  setEditFollowUp(
    lead.followUp ? lead.followUp.split("T")[0] : ""
  );
  setShowModal(true);
};


const handleFollowUpUpdate = async () => {
  if (!editRemark || !editFollowUp) {
    alert("Remark & Follow-up date required");
    return;
  }

  try {
    const res = await axios.put(
      `${BASE_URL}/api/update-lead-status/${currentLead._id}`,
      {
        remark: editRemark,
        dispose: "Interested",
        followUp: editFollowUp,
      }
    );

    // 🔥 same row update, list me rahe
    setFollowups(prev =>
      prev.map(f =>
        f._id === currentLead._id
          ? {
              ...f,
              remark: res.data.data.remark,
              dispose: res.data.data.dispose,
              followUp: res.data.data.followUp,
            }
          : f
      )
    );

    alert("✅ Follow-up updated");
    setShowModal(false);

  } catch (err) {
    alert("❌ Update failed");
  }
};



const handleCloseLead = async () => {
  if (!editRemark) {
    alert("Remark required");
    return;
  }

  try {
    await axios.put(
      `${BASE_URL}/api/update-lead-status/${currentLead._id}`,
      {
        remark: editRemark,
        dispose: "Not Interested",
        followUp: null,
      }
    );

    // 🔥 follow-up sheet se hata do
    setFollowups(prev =>
      prev.filter(f => f._id !== currentLead._id)
    );

    alert("❌ Lead closed");
    setShowModal(false);

  } catch (err) {
    alert("❌ Close failed");
  }
};


  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div style={{ padding: "30px" }}   className="followup-container">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        📋 Follow-Up Sheet
      </h1>

      <table  className="followup-table"
        border="1"
        width="100%"
        cellPadding="10"
        style={{ borderCollapse: "collapse", cursor: "pointer" }}
      >
        <thead style={{ background: "#eee" }}>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Remark</th>
            <th>Dispose</th>
            <th>Follow Up Date</th>
            <th>Saved At</th>
          </tr>
        </thead>

  <tbody>
  {followups.map((item, index) => (
    <tr key={item._id || index} onClick={() => openEditModal(item)}>

      {/* ✅ NAME */}
      <td>{item.name || "-"}</td>

      {/* ✅ PHONE */}
      <td>{item.phone || "-"}</td>

      <td>{item.remark || "-"}</td>
      <td>{item.dispose || "-"}</td>
      <td>{item.followUp || "-"}</td>
      <td>{new Date(item.createdAt).toLocaleString()}</td>

    </tr>
  ))}
</tbody>

      </table>

      {/* Edit Modal */}
      {showModal && (
        <div className="Follow-modal-overlay">
    <div className="Follow-modal-box">
            <h3>Edit Lead</h3>

            <label>Remark:</label>
            <textarea
              style={{ width: "100%", marginBottom: "10px" }}
              value={editRemark}
              onChange={(e) => setEditRemark(e.target.value)}
            />

            <label>Dispose:</label>
            <select
              style={{ width: "100%", marginBottom: "10px" }}
              value={editDispose}
              onChange={(e) => setEditDispose(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="Ringing">Ringing</option>
              <option value="Interested">Interested</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Other">Other</option>
            </select>

            <label>Follow Up Date:</label>
            <input
              type="date"
              style={{ width: "100%" }}
              value={editFollowUp}
              onChange={(e) => setEditFollowUp(e.target.value)}
            />

            <div style={{ marginTop: "15px", textAlign: "right" }}>
              <button    className="modal-btn cancel" onClick={() => setShowModal(false)}
                style={{ marginRight: "10px" }}>
                Cancel
              </button>
              <br />
                <br />
<div className="modal-actions">
  <button className="modal-btn follow" onClick={handleFollowUpUpdate}>
    Follow Up
  </button>

  <br />
  <br />

  <button className="modal-btn close" onClick={handleCloseLead}>
    Close Lead
  </button>
</div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default FollowUpSheet;
