import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notification.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null); // ✅ FIXED

  const agentId = localStorage.getItem("agentId");
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // ================= FETCH NOTIFICATIONS =================
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/notifications/${agentId}`
        );
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("Notification fetch error:", err);
      }
    };

    if (agentId) fetchNotifications();
  }, [agentId]);

  // ================= FIX LEAD (FOLLOW / CLOSE) =================
  const handleFixLead = async (action) => {
    if (!selectedLead) return;

    try {
      await axios.post(`${BASE_URL}/api/notifications/fix`, {
        agentId,
        leadId: selectedLead.leadId,
        action, // "follow" | "close"
      });

      // 🔥 UI se notification hata do
      setNotifications((prev) =>
        prev.filter((n) => n.leadId !== selectedLead.leadId)
      );

      setShowModal(false);
      setSelectedLead(null);

      alert(
        action === "follow"
          ? "🔁 Lead Follow-Up section me chali gayi"
          : "❌ Lead Closed section me chali gayi"
      );
    } catch (err) {
      console.error("Fix lead error:", err);
      alert("❌ Action failed");
    }
  };

  return (
    <div className="notifications-page">
      <h2>🔔 Follow-up Notifications</h2>

      {notifications.length === 0 && <p>No follow-ups</p>}

      {notifications.map((n) => (
        <div className="notification-card" key={n._id}>
          <h4>📞 {n.contactName || "Unknown"}</h4>

          <p>
            <strong>📱 Mobile:</strong> {n.contactNumber || "-"}
          </p>

          <small>
            📅 {new Date(n.followUpDate).toDateString()}
          </small>

          <button
            className="fix-btn"
            onClick={() => {
              setSelectedLead(n);
              setShowModal(true);
            }}
          >
            🛠 Fix It
          </button>
        </div>
      ))}

      {/* ================= MODAL ================= */}
      {showModal && selectedLead && (
        <div className="notif-modal-overlay">
          <div className="notif-modal-box">
            <h3>Resolve Lead</h3>

            <p>
              <strong>{selectedLead.contactName}</strong>
              <br />
              📱 {selectedLead.contactNumber}
            </p>

            <div className="modal-actions">
              <button
                className="modal-btn follow"
                onClick={() => handleFixLead("follow")}
              >
                🔁 Follow Up
              </button>

              <button
                className="modal-btn close"
                onClick={() => handleFixLead("close")}
              >
                ❌ Close
              </button>
            </div>

            <button
              className="modal-btn cancel"
              onClick={() => {
                setShowModal(false);
                setSelectedLead(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
