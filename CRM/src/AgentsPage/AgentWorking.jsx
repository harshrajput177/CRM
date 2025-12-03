import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const WorkingSession = () => {
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/sessions/${id}`);
      setSessions(res.data);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Working Sessions</h2>

      <table border="1" width="100%" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Total Duration</th>
          </tr>
        </thead>

        <tbody>
          {sessions.map((s) => (
            <tr key={s._id}>
              <td>{new Date(s.date).toLocaleDateString()}</td>
              <td>{new Date(s.startTime).toLocaleTimeString()}</td>
              <td>
                {s.endTime
                  ? new Date(s.endTime).toLocaleTimeString()
                  : "In Progress"}
              </td>
              <td>
                {s.totalTime
                  ? `${Math.floor(s.totalTime / 3600)}h ${
                      Math.floor((s.totalTime % 3600) / 60)
                    }m`
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkingSession;
