import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Droplead/Droplead.css";
import uploadIcon from "../../Images/upload-icon-18.jpg";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const FileUploader = () => {
  const [items, setItems] = useState([]);
  const [pendingUploads, setPendingUploads] = useState(0);
  const [popupLead, setPopupLead] = useState(null);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const shownNotifications = useRef(new Set()); // 🔒 duplicate popup protection
  const navigate = useNavigate();
  const agentId = localStorage.getItem("agentId");

  /* ================= FOLLOW-UP CHECKER ================= */

  useEffect(() => {
    if (!agentId) return;

    checkFollowUps(); // initial
    const interval = setInterval(checkFollowUps, 60000); // every 1 min

    return () => clearInterval(interval);
  }, [agentId]);

  const checkFollowUps = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/my-followups?agentId=${agentId}`
      );
      const data = await res.json();
      if (!data?.followUps) return;

      const now = new Date();

      data.followUps.forEach((lead) => {
        const followTime = new Date(lead.followUp);
        const diffMinutes = Math.floor((followTime - now) / 60000);

        const key = `${lead.leadId}-${diffMinutes}`;

        if ([20, 10, 5].includes(diffMinutes) && !shownNotifications.current.has(key)) {
          shownNotifications.current.add(key);

          setPopupLead({
            name: lead.name,
            phone: lead.phone,
            time: followTime.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          });

          setHasNewNotification(true); // 🔴 red dot ON
        }
      });
    } catch (err) {
      console.error("Follow-up check failed", err);
    }
  };

  /* ================= FILE UPLOAD ================= */

  const processFiles = (selectedFiles) => {
    if (!selectedFiles.length) return;

    const newItems = selectedFiles.map((file, idx) => ({
      id: `${Date.now()}-${idx}-${file.name}`,
      file,
      status: "uploading",
      progress: 0,
      errorMsg: "",
    }));

    setItems((prev) => [...prev, ...newItems]);
    setPendingUploads(selectedFiles.length);
    newItems.forEach(uploadSingleFile);
  };

  const uploadSingleFile = async (item) => {
    const formData = new FormData();
    formData.append("file", item.file);

    let prog = 0;
    const tick = setInterval(() => {
      prog = Math.min(prog + 15, 90);
      updateItem(item.id, { progress: prog });
    }, 250);

    try {
      const res = await fetch(`${BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      clearInterval(tick);

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      updateItem(item.id, {
        status: data?.success ? "success" : "error",
        progress: 100,
        errorMsg: data?.success ? "" : "Upload failed",
      });
    } catch (err) {
      clearInterval(tick);
      updateItem(item.id, {
        status: "error",
        progress: 100,
        errorMsg: err.message || "Network error",
      });
    } finally {
      setPendingUploads((p) => Math.max(p - 1, 0));
    }
  };

  const updateItem = (id, patch) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );
  };

  /* ================= UI ================= */

  return (
    <div className="lead-file-uploader">
      
      {/* 🔔 Notification Icon */}
      <div className="notification-icon">
        🔔
        {hasNewNotification && <span className="notification-dot"></span>}
      </div>

      <button className="btn-goto-home" onClick={() => navigate("/HRM-Dashboard")}>
        Home
      </button>

      <div
        className="lead-upload-area"
        onDrop={(e) => {
          e.preventDefault();
          processFiles(Array.from(e.dataTransfer.files));
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <img src={uploadIcon} alt="Upload" className="upload-icon" />
        <p>Drag & drop files or <span>Browse</span></p>
        <input
          type="file"
          multiple
          accept=".csv,.xls,.xlsx,.pdf,.doc,.docx,.png,.jpg"
          onChange={(e) => {
            processFiles(Array.from(e.target.files));
            e.target.value = "";
          }}
          hidden
          id="file-input"
        />
        <label htmlFor="file-input" className="lead-browse-btn">Browse</label>
      </div>

      {items.map((item) => (
        <div key={item.id} className="lead-file-status">
          <p>{item.file.name}</p>
          {item.status === "uploading" && (
            <div className="lead-progress-bar">
              <div className="lead-progress" style={{ width: `${item.progress}%` }} />
            </div>
          )}
          {item.status === "success" && <p className="lead-success">Uploaded</p>}
          {item.status === "error" && <p className="error">{item.errorMsg}</p>}
        </div>
      ))}

      {/* 🔔 FOLLOW-UP POPUP */}
      {popupLead && (
        <div className="followup-popup">
          <h4>📞 Follow-up Reminder</h4>
          <p><b>Name:</b> {popupLead.name}</p>
          <p><b>Phone:</b> {popupLead.phone}</p>
          <p><b>Call Time:</b> {popupLead.time}</p>

          <button
            onClick={() => {
              setPopupLead(null);
              setHasNewNotification(false); // 🔴 dot off when closed
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;


