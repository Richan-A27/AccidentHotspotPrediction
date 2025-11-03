import React, { useEffect, useState } from "react";
import API from "../api";

const AdminDashboard = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await API.get("/admin/predictions");
        setRecords(res.data || []);
      } catch (err) {
        console.error("Error loading admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const getRiskColor = (level) => {
    if (level === "Low") return "#4CAF50";
    if (level === "Moderate") return "#FFA500";
    return "#F44336";
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>📊 Admin Dashboard</h2>
        <p>
          Welcome back, <strong>{username || "Admin"}</strong> 👋
        </p>
        <p>Here’s an overview of all user predictions stored in the system.</p>

        <div className="admin-summary">
          <p>
            <strong>Total Predictions:</strong> {records.length}
          </p>
          <p>
            <strong>Users Tracked:</strong>{" "}
            {new Set(records.map((r) => r.username)).size}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <h3>📜 Prediction Records</h3>

        {loading ? (
          <p>Loading records...</p>
        ) : records.length === 0 ? (
          <p>No prediction data found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Risk Level</th>
                <th>Weather</th>
                <th>Temperature (°C)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i}>
                  <td>{r.username || "Unknown"}</td>
                  <td>{r.latitude?.toFixed(3)}</td>
                  <td>{r.longitude?.toFixed(3)}</td>
                  <td style={{ color: getRiskColor(r.risk_level) }}>
                    {r.risk_level}
                  </td>
                  <td>{r.weather}</td>
                  <td>{r.temperature}</td>
                  <td>
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
