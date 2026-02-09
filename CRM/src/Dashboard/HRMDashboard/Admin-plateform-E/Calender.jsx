import React, { useState } from "react";
import "../../../Styles-CSS/HRM-CSS/Calender.css"

const CalendarAttendance = ({ handleDateHover }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0-Sun

  const years = Array.from({ length: 26 }, (_, i) => 2010 + i);
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const changeMonth = (dir) => {
    const newDate = new Date(year, month + dir, 1);
    if (newDate.getFullYear() >= 2010 && newDate.getFullYear() <= 2035) {
      setCurrentDate(newDate);
    }
  };

  return (
    <div className="attendance-wrapper">
      <h3  className="attend-h3">📅 Attendance Calendar</h3>

      {/* Header */}
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>◀</button>

        <select
          value={month}
          onChange={(e) =>
            setCurrentDate(new Date(year, e.target.value, 1))
          }
        >
          {months.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) =>
            setCurrentDate(new Date(e.target.value, month, 1))
          }
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button onClick={() => changeMonth(1)}>▶</button>
      </div>

      {/* Day Names */}
      <div className="calendar-grid days">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} className="day-name">{d}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="calendar-grid">
        {/* Empty cells */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty"></div>
        ))}

        {/* Actual dates */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          return (
            <div
              key={day}
              className="calendar-day"
              onMouseEnter={() => handleDateHover(dateStr)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarAttendance;
