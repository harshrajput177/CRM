import React, { useEffect, useState } from "react";
import "../Callingleads/Callingleads.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;


const LeadTable = ({ selectedFile }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  if (!selectedFile) return;

  const loadLeads = async () => {
    try {
      setLoading(true);
const res = await fetch(`${BASE_URL}/api/files/${selectedFile._id}/leads`
);
const data = await res.json();
setLeads(data.leads || []);

    } catch (error) {
      console.error("Error loading leads:", error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  loadLeads();
}, [selectedFile]);


  if (loading) return <p>Loading leads...</p>;

  if (!leads.length) return <p>No leads found for this file.</p>;

  const headers = Object.keys(leads[0]);

  return (
    <div className="lead-table">
      <h3>Selected File Leads</h3>

      <table>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {leads.map((row, i) => (
            <tr key={i}>
              {headers.map((h) => (
                <td key={h}>{row[h]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;

