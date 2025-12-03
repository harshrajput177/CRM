import React, { useState, useEffect } from 'react';
import { File, FileText, FileSpreadsheet, Download, Trash2 } from 'lucide-react';
import './RecentFile.css';

export default function FileDisplay({ onFileSelect }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFileId, setSelectedFileId] = useState(null);

const BASE_URL = import.meta.env.VITE_BASE_URL;


  useEffect(() => {
    fetchAllFiles();
  }, []);

  const fetchAllFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/files`
);
      const data = await response.json();
      
      if (data.files) {
        setFiles(data.files);
        console.log("📁 Total files loaded:", data.files.length);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to load files');
      setLoading(false);
    }
  };

const handleFileClick = (file) => {
  setSelectedFileId(file._id);

  if (onFileSelect) {
    onFileSelect(file);   // ✅ Ye LeadTable ko file bhej raha hai
  }
};



  const getFileIcon = (filename) => {
    if (filename.endsWith('.csv')) {
      return <FileSpreadsheet className="file-icon csv-icon" />;
    }
    if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
      return <FileSpreadsheet className="file-icon excel-icon" />;
    }
    if (filename.endsWith('.pdf')) {
      return <FileText className="file-icon pdf-icon" />;
    }
    return <File className="file-icon default-icon" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toUpperCase();
  };

  if (loading) {
    return (
      <div className="Filecontainer">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="Filecontainer">
      <div className="Fileheader">
        <h1 className="Filetitle">All Uploaded Files</h1>
        <div className="file-count">
          Total Files: <span>{files.length}</span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {files.length === 0 ? (
        <div className="empty-state">
          <File className="empty-icon" />
          <h2>No Files Found</h2>
          <p>Upload some files to see them here</p>
        </div>
      ) : (
        <div className="files-grid">
          {files.map((file) => (
            <div 
              key={file._id} 
              className={`file-card ${selectedFileId === file._id ? 'selected' : ''}`}
              onClick={() => handleFileClick(file)}
              style={{ cursor: 'pointer' }}
            >
              <div className="filecard-header">
                <div className="icon-wrapper">
                  {getFileIcon(file.filename)}
                </div>
                <span className="file-type-badge">
                  {getFileExtension(file.filename)}
                </span>
              </div>

              <div className="card-body">
                <h3 className="filename" title={file.filename}>
                  {file.filename}
                </h3>
                
                <div className="file-details">
                  <div className="detail-item">
                    <span className="label">Size:</span>
                    <span className="value">{formatFileSize(file.filesize)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Type:</span>
                    <span className="value">{file.filetype}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">Uploaded:</span>
                    <span className="value">{formatDate(file.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button 
                  className="action-btn download-btn" 
                  title="View Data"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileClick(file);
                  }}
                >
                  <Download size={16} />
                  View Data
                </button>
              </div>

              {selectedFileId === file._id && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#4CAF50',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  Selected ✓
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}