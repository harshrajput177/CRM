import React, { useEffect, useState } from "react";
import "../Callingleads/selectlead.css"; 
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const ColumnSelector = ({ selectedFile }) => {
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedFile) return;

    setColumns([]);
    setSelectedColumns([]);
    setLoading(true);
    setErrMsg("");

    const loadData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/files/${selectedFile._id}/leads`);
        const data = await res.json();

        const headers = Object.keys(data.leads[0] || {});
        setColumns(headers);

      } catch (err) {
        setErrMsg("Failed to load columns");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedFile]);

  const toggleColumn = (col) => {
    setSelectedColumns(prev =>
      prev.includes(col)
        ? prev.filter(c => c !== col)
        : [...prev, col]
    );
  };

  const toggleSelectAll = () => {
    if (selectedColumns.length === columns.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(columns);
    }
  };

  // ✅ SAVE + REDIRECT
const submitSelectedColumns = async () => {
  try {
    // ✅ Pehle leads fetch karo
    const res = await fetch(`${API_BASE}/api/files/${selectedFile._id}/leads`);
    const json = await res.json();

    const allLeads = json.leads;

    // ✅ Sirf selected columns ka data banao
    const filteredData = allLeads.map(row => {
      const obj = {};
      selectedColumns.forEach(col => {
        obj[col] = row[col];
      });
      return obj;
    });

    await fetch(`${API_BASE}/api/selectData-Post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileId: selectedFile._id,
        columns: selectedColumns,
        data: filteredData     // ✅ IMPORTANT
      })
    });

    localStorage.setItem("fileId", selectedFile._id);

    navigate("/leadtable");

  } catch (error) {
    console.error("Save error:", error);
  }
};



  if (loading) return <div>Loading columns...</div>;
  if (errMsg) return <div className="error">{errMsg}</div>;

  return (
    <div className="column-selector">
      <h3>Selected File Columns</h3>

      <table className="column-selector-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedColumns.length === columns.length && columns.length !== 0}
                onChange={toggleSelectAll}
              />
              &nbsp; Select All
            </th>
            <th>Column Name</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((col, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col)}
                  onChange={() => toggleColumn(col)}
                />
              </td>
              <td>{col}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button 
        className="preview-btn"
        style={{ marginTop: "15px" }}
        onClick={submitSelectedColumns}
      >
        Save & Continue
      </button>
    </div>
  );
};

export default ColumnSelector;
