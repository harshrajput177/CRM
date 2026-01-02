import React, { useState } from "react";
import { useNavigate } from "react-router-dom";   // << add
import "../Droplead/Droplead.css";
import uploadIcon from "../../Images/upload-icon-18.jpg";

const BASE_URL = import.meta.env.VITE_BASE_URL;




const FileUploader = () => {
  const [items, setItems] = useState([]); // [{id, file, status, progress, errorMsg}]
  const [pendingUploads, setPendingUploads] = useState(0); // track outstanding uploads
  const navigate = useNavigate();

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
    e.target.value = ""; // reset so same file can be re-selected
  };

  const processFiles = (selectedFiles) => {
    if (!selectedFiles.length) return;

    // optimistic UI items
    const newItems = selectedFiles.map((file, idx) => ({
      id: `${Date.now()}-${idx}-${file.name}`,
      file,
      status: "uploading",
      progress: 0,
      errorMsg: "",
    }));

    setItems((prev) => [...prev, ...newItems]);

    // track uploads
    setPendingUploads(selectedFiles.length);

    // start uploads
    newItems.forEach((item) => uploadSingleFile(item));
  };

  const uploadSingleFile = async (item) => {
    const formData = new FormData();
    formData.append("file", item.file);

    // fake progress while waiting
    let prog = 0;
    const tick = setInterval(() => {
      prog += 15;
      if (prog >= 90) prog = 90;
      updateItem(item.id, { progress: prog });
    }, 250);

    try {
      const res = await fetch(`${BASE_URL}/api/upload`
, {
        method: "POST",
        body: formData,
      });

      clearInterval(tick);

      if (!res.ok) {
        updateItem(item.id, {
          status: "error",
          progress: 100,
          errorMsg: `Server error: ${res.status}`,
        });
        return;
      }

      const data = await res.json();
      const isOk = data?.success;
      updateItem(item.id, {
        status: isOk ? "success" : "error",
        progress: 100,
        errorMsg: isOk ? "" : "Upload failed.",
      });
    } catch (err) {
      clearInterval(tick);
      updateItem(item.id, {
        status: "error",
        progress: 100,
        errorMsg: err.message || "Network error.",
      });
    } finally {
      // decrement pending; when all done → redirect
      setPendingUploads((p) => {
        const next = p - 1;
        if (next === 0) {
          // all uploads finished → go select columns
          navigate("/HRM-Dashboard");
        }
        return next;
      });
    }
  };

  
const handleRoute = useNavigate();

const gotoHome = ()=>{
  handleRoute("/HRM-Dashboard")
}

  const updateItem = (id, patch) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="lead-file-uploader">
      <button className="btn-goto-home" onClick={gotoHome}>Home</button>

      <br />
      <br />
      <div
        className="lead-upload-area"
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
      >
        <img src={uploadIcon} alt="Upload" className="upload-icon" />
        <p>
          Drag & drop files or <span>Browse</span>
        </p>
        <input
          type="file"
          multiple
          accept=".csv,.xls,.xlsx,.pdf,.doc,.docx,.png,.jpg"
          onChange={handleFileInput}
          style={{ display: "none" }}
          id="file-input"
        />
        <label htmlFor="file-input" className="lead-browse-btn">
          Browse
        </label>
      </div>

      {items.map((item) => (
        <div key={item.id} className="lead-file-status">
          <p>{item.file.name}</p>

          {item.status === "uploading" && (
            <div className="lead-progress-bar">
              <div
                className="lead-progress"
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>
          )}

          {item.status === "success" && (
            <p className="lead-success">Uploaded</p>
          )}

          {item.status === "error" && (
            <p className="error">
              {item.errorMsg ||
                "This document is not supported. Please upload another file."}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileUploader;


