import React, { useState } from "react";
import API from "../api";

const RiskForm = ({ selectedLocation }) => {
  const [inputData, setInputData] = useState({
    road_type: 1,
    vehicle_type: 0,
    light_condition: 2,
    num_vehicles_involved: 2,
    speed_limit: 60,
    traffic_density: 1,
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: Number(e.target.value) });
  };

  const handlePredict = async () => {
    if (!selectedLocation) {
      alert("Please select a location on the map first!");
      return;
    }

    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const { latitude, longitude } = selectedLocation;

      // Merge location + form data
      const payload = { latitude, longitude, ...inputData };

      console.log("📤 Sending prediction request:", payload);

      const res = await API.post("/predict", payload);

      if (res.data.success) {
        setPrediction(res.data.prediction);
        setWeatherInfo({
          main: res.data.weather,
          temp: res.data.temperature,
        });
      } else {
        setError("Prediction failed: " + (res.data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("❌ Prediction error:", err);
      setError("Server error. Please check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.9)",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        maxWidth: "400px",
        margin: "20px auto",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>🚗 Accident Risk Predictor</h3>

      <div style={{ display: "grid", gap: "10px" }}>
        <label>
          Road Type:
          <select name="road_type" onChange={handleChange} value={inputData.road_type}>
            <option value={0}>Highway</option>
            <option value={1}>City Road</option>
            <option value={2}>Residential</option>
          </select>
        </label>

        <label>
          Vehicle Type:
          <select name="vehicle_type" onChange={handleChange} value={inputData.vehicle_type}>
            <option value={0}>Car</option>
            <option value={1}>Bike</option>
            <option value={2}>Truck</option>
          </select>
        </label>

        <label>
          Light Condition:
          <select name="light_condition" onChange={handleChange} value={inputData.light_condition}>
            <option value={0}>Daylight</option>
            <option value={1}>Dusk/Dawn</option>
            <option value={2}>Night</option>
          </select>
        </label>

        <label>
          Number of Vehicles:
          <input
            type="number"
            name="num_vehicles_involved"
            value={inputData.num_vehicles_involved}
            min="1"
            onChange={handleChange}
          />
        </label>

        <label>
          Speed Limit (km/h):
          <input
            type="number"
            name="speed_limit"
            value={inputData.speed_limit}
            min="20"
            max="120"
            onChange={handleChange}
          />
        </label>

        <label>
          Traffic Density:
          <select name="traffic_density" onChange={handleChange} value={inputData.traffic_density}>
            <option value={0}>Low</option>
            <option value={1}>Medium</option>
            <option value={2}>High</option>
          </select>
        </label>
      </div>

      <button
        onClick={handlePredict}
        disabled={loading}
        style={{
          marginTop: "15px",
          width: "100%",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "10px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Predicting..." : "Predict Risk"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>{error}</p>
      )}

      {prediction && (
        <div
          style={{
            marginTop: "15px",
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <h4>Predicted Risk Score: {prediction}</h4>
          {weatherInfo && (
            <p>
              🌤️ <strong>{weatherInfo.main}</strong> | 🌡️ {weatherInfo.temp.toFixed(1)}°C
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RiskForm;
