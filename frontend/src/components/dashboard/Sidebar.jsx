import React from "react";
import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  display: "block",
  padding: "10px 16px",
  borderRadius: "8px",
  marginBottom: "6px",
  background: isActive ? "#111" : "transparent",
  color: isActive ? "#fff" : "#555",
  textDecoration: "none",
});

export default function Sidebar() {
  return (
    <div style={{ width: "220px", padding: "20px" }}>
      <h3>Dashboard</h3>

      <NavLink to="/dashboard" style={linkStyle}>Overview</NavLink>
      <NavLink to="/analytics" style={linkStyle}>Analytics</NavLink>
      <NavLink to="/ai-insights" style={linkStyle}>AI Insights</NavLink>
      <NavLink to="/leaderboard" style={linkStyle}>Leaderboard</NavLink>
      <NavLink to="/reports" style={linkStyle}>Reports</NavLink>
    </div>
  );
}