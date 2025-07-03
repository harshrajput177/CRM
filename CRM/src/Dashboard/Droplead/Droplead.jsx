import React, { useState } from "react";
import '../../Dashboard/Droplead/Droplead.css';

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({});

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const processFiles = (selectedFiles) => {
    const updatedFiles = [...files];
    const updatedStatus = { ...uploadStatus };

    selectedFiles.forEach((file) => {
      updatedFiles.push(file);
      updatedStatus[file.name] = {
        progress: 0,
        success: null,
        error: null,
      };

      // Simulate file upload
      const interval = setInterval(() => {
        setUploadStatus((prev) => {
          const newProgress = prev[file.name]?.progress + 20;
          const isComplete = newProgress >= 100;

          return {
            ...prev,
            [file.name]: {
              ...prev[file.name],
              progress: Math.min(newProgress, 100),
              success: isComplete ? Math.random() > 0.2 : null, // Random success or error
              error: isComplete ? Math.random() <= 0.2 : null,
            },
          };
        });

        if (uploadStatus[file.name]?.progress >= 100) {
          clearInterval(interval);
        }
      }, 500);
    });

    setFiles(updatedFiles);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="lead-file-uploader">
      <div
        className="lead-upload-area"
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
      >
        <p>Drag & drop files or <span>Browse</span></p>
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          style={{ display: "none" }}
          id="file-input"
        />
        <label htmlFor="file-input" className="lead-browse-btn">Browse</label>
      </div>

      {files.map((file, index) => (
        <div key={index} className="lead-file-status">
          <p>{file.name}</p>
          {uploadStatus[file.name]?.progress < 100 ? (
            <div className="lead-progress-bar">
              <div
                className="lead-progress"
                style={{ width: `${uploadStatus[file.name]?.progress}%` }}
              ></div>
            </div>
          ) : uploadStatus[file.name]?.success ? (
            <p className="lead-success">Uploaded</p>
          ) : (
            <p className="error">
              This document is not supported, please delete and upload another file.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileUploader;
