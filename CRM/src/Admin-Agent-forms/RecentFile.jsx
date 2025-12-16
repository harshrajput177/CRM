import React, { useState, useEffect } from "react";
import { File, FileText, FileSpreadsheet, Download, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./RecentFile.css";

export default function FileDisplay({ onFileSelect }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllFiles();
  }, []);

  const fetchAllFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/files`);
      const data = await response.json();

      if (data.files) {
        setFiles(data.files);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to load files");
      setLoading(false);
    }
  };

  // 🔹 View Data → Redirect
  const handleViewData = (file) => {
    onFileSelect && onFileSelect(file);

    navigate("/selectlead", {
      state: {
        fileId: file._id,
        filename: file.filename,
      },
    });
  };

  // 🔹 Delete file
  const handleDeleteFile = async (fileId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${BASE_URL}/api/files/${fileId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFiles((prev) => prev.filter((file) => file._id !== fileId));
      } else {
        alert("Failed to delete file");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error while deleting file");
    }
  };

  const getFileIcon = (filename) => {
    if (filename.endsWith(".csv")) return <FileSpreadsheet className="file-icon csv-icon" />;
    if (filename.endsWith(".xlsx") || filename.endsWith(".xls"))
      return <FileSpreadsheet className="file-icon excel-icon" />;
    if (filename.endsWith(".pdf")) return <FileText className="file-icon pdf-icon" />;
    return <File className="file-icon default-icon" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getFileExtension = (filename) => filename.split(".").pop().toUpperCase();

  if (loading) {
    return (
      <div className="Filecontainer">
        <p>Loading files...</p>
      </div>
    );
  }

  return (
    <div className="Filecontainer">
      <div className="Fileheader">
        <h1 className="Filetitle">All Uploaded Files</h1>
        <div>Total Files: {files.length}</div>
      </div>

      {error && <p>{error}</p>}

      {files.length === 0 ? (
        <p>No files found</p>
      ) : (
        <div className="files-grid">
          {files.map((file) => (
            <div key={file._id} className="file-card">
              <div className="filecard-header">
                {getFileIcon(file.filename)}
                <span className="file-type-badge">
                  {getFileExtension(file.filename)}
                </span>
              </div>

              <div className="card-body">
                <h3>{file.filename}</h3>
                <p>Size: {formatFileSize(file.filesize)}</p>
                <p>Type: {file.filetype}</p>
                <p>Uploaded: {formatDate(file.createdAt)}</p>
              </div>

              <div className="card-footer">
                <button
                  className="action-btn download-btn"
                  onClick={() => handleViewData(file)}
                >
                  <Download size={16} /> View Data
                </button>

                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteFile(file._id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
