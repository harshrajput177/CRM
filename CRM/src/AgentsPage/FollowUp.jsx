import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./FollowUp.css";
import { useLocation } from "react-router-dom";


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
  const [filterType, setFilterType] = useState("date");
  // "date" | "month" | "all"

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const rowRefs = useRef({});



  const location = useLocation();
  const highlightLeadId = location.state?.highlightLeadId;


  // ================= FETCH FOLLOW UPS =================
  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/resolved-leads/${agentId}`
        );

        const filtered = res.data.data.filter((lead) => {
          if (!lead.createdAt) return false;

          const createdDateObj = new Date(lead.createdAt);

          if (filterType === "date") {
            const localDate = createdDateObj.toLocaleDateString("en-CA");
            return localDate === selectedDate;
          }

          if (filterType === "month") {
            const localMonth = createdDateObj
              .toLocaleDateString("en-CA")
              .slice(0, 7);
            return localMonth === selectedMonth;
          }

          if (filterType === "all") {
            return true;
          }

          return false;
        });

        setFollowups(filtered);
      } catch (error) {
        console.error("Error fetching follow-ups:", error);
      } finally {
        setLoading(false);
      }
    };

    if (agentId) fetchFollowUps();
    else setLoading(false);

  }, [agentId, selectedDate, selectedMonth, filterType]);



  const openEditModal = (lead) => {
    setCurrentLead(lead);
    setEditRemark(lead.remark ?? "");
    setEditDispose(lead.dispose ?? "");
    setEditFollowUp(
      lead.followUp ? lead.followUp.split("T")[0] : ""
    );
    setShowModal(true);
  };

  const formatFollowUpDateTime = (dateTime) => {
    if (!dateTime) return "-";

    const d = new Date(dateTime);

    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };


  // ================= FOLLOW UP UPDATE =================
  const handleFollowUpUpdate = async () => {
    if (!editRemark || !editFollowUp || !editDispose) {
      alert("Remark, Dispose & Follow-up date required");
      return;
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/api/update-lead-status/${currentLead._id}`,
        {
          remark: editRemark,
          dispose: editDispose,      // ✅ ANY VALUE ALLOWED
          followUp: editFollowUp,    // ✅ REQUIRED
        }
      );

      // same row update
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
      console.error(err);
      alert("❌ Update failed");
    }
  };

  // ================= CLOSE LEAD =================
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
          dispose: "Closed",   // 🔥 dispose irrelevant here
          followUp: null,      // 🔥 FOLLOW UP REMOVE
        }
      );

      // follow-up sheet se hata do
      setFollowups(prev =>
        prev.filter(f => f._id !== currentLead._id)
      );

      alert("❌ Lead Closed");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("❌ Close failed");
    }
  };

  useEffect(() => {
    if (highlightLeadId && rowRefs.current[highlightLeadId]) {
      rowRefs.current[highlightLeadId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightLeadId, followups]);


  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="followup-container" style={{ padding: "30px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        📋 Follow-Up Sheet
      </h1>

      <div style={{ marginBottom: "20px", textAlign: "center" } }  className="filter-type">
        <label>Filter By: </label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="date">Date Wise</option>
          <option value="month">Month Wise</option>
          <option value="all">Full Data</option>
        </select>

        {filterType === "date" && (
          <input
          className="date-wise-input"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        )}

        {filterType === "month" && (
          <input
          className="month-wise-input"
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        )}
      </div>

      <table
        className="followup-table"
        border="1"
        width="100%"
        cellPadding="10"
        style={{ borderCollapse: "collapse", cursor: "pointer" }}
      >
        <thead style={{ background: "#eee" }}>
          <tr>
            <th>No.</th>
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


            <tr
              key={item._id || index}
              ref={(el) => {
                if (item._id === highlightLeadId) {
                  rowRefs.current[item._id] = el;
                }
              }}
              onClick={() => openEditModal(item)}
              style={{
                backgroundColor:
                  item._id === highlightLeadId ? "#fff9c4" : "transparent",
              }}
            >

              {/* 🔥 SERIAL NUMBER */}
              <td style={{ fontWeight: "600", textAlign: "center" }}>
                {index + 1}
              </td>

              <td>{item.name || "-"}</td>
              <td>{item.phone || "-"}</td>
              <td>{item.remark || "-"}</td>
              <td>{item.dispose || "-"}</td>
              <td>{formatFollowUpDateTime(item.followUp)}</td>
              <td>{new Date(item.createdAt).toLocaleString("en-IN")}</td>

            </tr>
          ))}
        </tbody>

      </table>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="Follow-modal-overlay">
          <div className="Follow-modal-box">
            <h3>Edit Lead</h3>

            <label>Remark:</label>
            <textarea
              value={editRemark}
              onChange={(e) => setEditRemark(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <label>Dispose:</label>
            <select
              value={editDispose}
              onChange={(e) => setEditDispose(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
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
              value={editFollowUp}
              onChange={(e) => setEditFollowUp(e.target.value)}
              style={{ width: "100%" }}
            />
            <br />

            <div className="modal-actions">
              <button className="modal-btn follow" onClick={handleFollowUpUpdate}>
                Follow Up
              </button>

              <br />
              <br />
              <button className="modal-btn close" onClick={handleCloseLead}>
                Close Lead
              </button> &nbsp;  &nbsp;  &nbsp;  &nbsp;

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

export default FollowUpSheet;
