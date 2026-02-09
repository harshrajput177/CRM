import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FollowUp.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ClosedLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const agentId = localStorage.getItem("agentId");

  // modal states
  const [showModal, setShowModal] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [remark, setRemark] = useState("");
  const [dispose, setDispose] = useState("");
  const [followUp, setFollowUp] = useState("");

  // ================= FETCH CLOSED LEADS =================
  useEffect(() => {
    const fetchClosedLeads = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/resolved-leads/${agentId}?type=closed`
        );
        setLeads(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (agentId) fetchClosedLeads();
    else setLoading(false);
  }, [agentId]);

  // ================= OPEN MODAL =================
  const openEditModal = (lead) => {
    setCurrentLead(lead);
    setRemark(lead.remark ?? "");
    setDispose(lead.dispose ?? "");
    setFollowUp(lead.followUp ? lead.followUp.split("T")[0] : "");
    setShowModal(true);
  };

  // ================= UPDATE LEAD =================
  const handleUpdate = async () => {
    if (!remark || !dispose) {
      alert("Remark & Dispose required");
      return;
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/api/update-lead-status/${currentLead._id}`,
        {
          remark,
          dispose,
          followUp: followUp || null,
        }
      );

      // 🔥 agar closed se bahar gaya → list se hatao
      if (dispose.toLowerCase() !== "closed") {
        setLeads((prev) =>
          prev.filter((l) => l._id !== currentLead._id)
        );
      } else {
        setLeads((prev) =>
          prev.map((l) =>
            l._id === currentLead._id
              ? { ...l, ...res.data.data }
              : l
          )
        );
      }

      alert("✅ Lead updated");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="followup-container">
      <h1 className="followup-title">💚 Closed Leads</h1>

      {leads.length === 0 ? (
        <p style={{ textAlign: "center" }}>No closed leads</p>
      ) : (
        <table className="followup-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Remark</th>
              <th>Dispose</th>
              <th>Follow Up</th>
              <th>Saved At</th>
            </tr>
          </thead>

   <tbody>
  {leads.map((item, index) => (
    <tr
      key={item._id || index}
      onClick={() => openEditModal(item)}
    >
      {/* 🔥 SERIAL NUMBER */}
      <td style={{ fontWeight: "600", textAlign: "center" }}>
        {index + 1}
      </td>

      <td>{item.name || "-"}</td>
      <td>{item.phone || "-"}</td>
      <td>{item.remark || "-"}</td>
      <td>{item.dispose || "-"}</td>
      <td>{item.followUp || "-"}</td>
      <td>{new Date(item.createdAt).toLocaleString("en-IN")}</td>
    </tr>
  ))}
</tbody>

        </table>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="Follow-modal-overlay">
          <div className="Follow-modal-box">
            <h3>Edit Closed Lead</h3>

            <label>Remark</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />

            <label>Dispose</label>
            <select
              value={dispose}
              onChange={(e) => setDispose(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="followup">Follow Up</option>
              <option value="closed">Closed</option>
            </select>

            <label>Follow Up Date</label>
            <input
              type="date"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
            />

            <div className="modal-actions">
              <button className="modal-btn follow" onClick={handleUpdate}>
                Update
              </button>

              <button
                className="modal-btn cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClosedLeads;


