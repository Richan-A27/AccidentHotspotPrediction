import React from "react";

const ResultCard = ({ result }) => {
  if (!result || !result.success) return null;

  const score = parseFloat(result.prediction || 0);
  let riskLevel = "Low";
  let color = "#4caf50";

  if (score > 0.4 && score <= 0.7) {
    riskLevel = "Moderate";
    color = "#ff9800";
  } else if (score > 0.7) {
    riskLevel = "High";
    color = "#f44336";
  }

  return (
    <div
      className="result-card"
      style={{
        marginTop: "20px",
        background: color,
        color: "white",
        padding: "15px",
        borderRadius: "10px",
        textAlign: "center",
      }}
    >
      <h3>Predicted Risk: {riskLevel}</h3>
      <p>
        <b>Score:</b> {score.toFixed(2)}
      </p>
      {result.weather && (
        <p>
          ☁️ {result.weather} | 🌡️ {result.temperature.toFixed(1)}°C
        </p>
      )}
    </div>
  );
};

export default ResultCard;
