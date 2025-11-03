import React, { useState, useEffect } from "react";
import MapView from "../components/MapView";
import API from "../api";

const UserDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 13.0827,
    longitude: 80.2707,
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const username = localStorage.getItem("username");

  // Load previous predictions (optional)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/admin/all");
        setHistory(res.data.predictions || []);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();
  }, []);

  const handleAnalyze = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in again.");

    setLoading(true);
    try {
      const payload = {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        road_type: 1,
        vehicle_type: 0,
        light_condition: 2,
        num_vehicles_involved: 2,
        speed_limit: 60,
        traffic_density: 1,
      };

      const res = await API.post("/predict", payload);

      if (res.data.success) {
        setPrediction({
          score: parseFloat(res.data.prediction).toFixed(2),
          risk_level: res.data.risk_level,
          weather: res.data.weather,
          temperature: res.data.temperature.toFixed(1),
        });
      }
    } catch (err) {
      console.error(err);
      alert("Prediction failed!");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    if (level === "Low") return "#4CAF50";
    if (level === "Moderate") return "#FFA500";
    return "#F44336";
  };

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>🧠 Smart Road Risk Analysis</h2>
        <p>
          Welcome, <strong>{username || "User"}</strong> 👋
        </p>
        <p>Move the marker and analyze accident risk using live data.</p>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="analyze-btn"
        >
          {loading ? "Analyzing..." : "Analyze My Zone"}
        </button>

        {/* Prediction Display */}
        {prediction && (
          <div
            className="prediction-box"
            style={{ background: getRiskColor(prediction.risk_level) }}
          >
            <h3>Risk Level: {prediction.risk_level}</h3>
            <p>Score: {prediction.score}</p>
            <p>
              🌤️ {prediction.weather} | 🌡️ {prediction.temperature}°C
            </p>
          </div>
        )}

        {/* History Table */}
        <div className="history-box">
          <h3>📜 Your Prediction History</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Risk</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history
                  .slice(-5)
                  .reverse()
                  .map((item, i) => (
                    <tr key={i}>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td style={{ color: getRiskColor(item.risk_level) }}>
                        {item.risk_level}
                      </td>
                      <td>{item.risk_score?.toFixed(2)}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No predictions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </aside>

      {/* Map Panel */}
      <main className="map-area">
        <MapView onLocationSelect={setSelectedLocation} />
      </main>
    </div>
  );
};

export default UserDashboard;
