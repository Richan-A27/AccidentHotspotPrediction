import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import Prediction from "../models/Prediction.js";
import { verifyToken } from "../middleware/authMiddleware.js"; 

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENWEATHER_API_KEY = "fe1bfbfaa80d4e20dc759483f742908d";

// 🧠 Predict and save result
router.post("/", verifyToken, async (req, res) => {   // ✅ FIXED
  try {
    const userId = req.user?.id; // ✅ Safe access

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No valid user token" });
    }

    const {
      latitude,
      longitude,
      road_type,
      vehicle_type,
      light_condition,
      num_vehicles_involved,
      speed_limit,
      traffic_density,
    } = req.body;

    // 🌦 Fetch live weather data
    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    const weather = weatherRes.data.weather[0].main;
    const temp = weatherRes.data.main.temp;

    // 🌦 Encode weather numerically
    const weatherEncoded = weather.toLowerCase().includes("rain")
      ? 1
      : weather.toLowerCase().includes("cloud")
      ? 2
      : weather.toLowerCase().includes("fog")
      ? 3
      : 0;

    // 🧠 Input data for ML model
    const inputData = {
      latitude,
      longitude,
      road_type,
      vehicle_type,
      weather: weatherEncoded,
      light_condition,
      num_vehicles_involved,
      speed_limit,
      traffic_density,
      weather_temp_c: temp,
    };

    const scriptPath = path.resolve(__dirname, "../../ml/scripts/predict_risk.py");
    const python = spawn("python3", [scriptPath, JSON.stringify(inputData)]);

    let output = "";
    let errOutput = "";

    python.stdout.on("data", (data) => (output += data.toString()));
    python.stderr.on("data", (data) => (errOutput += data.toString()));

    python.on("close", async (code) => {
      if (code !== 0) {
        console.error("❌ Python Error:", errOutput);
        return res.status(500).json({ error: errOutput });
      }

      let risk_score = parseFloat(output.trim());

      // ⚡ Add variation + hotspot influence
      const randomOffset = (Math.random() - 0.5) * 0.25;
      const isHotspot =
        latitude >= 13.05 && latitude <= 13.09 &&
        longitude >= 80.24 && longitude <= 80.28;

      if (isHotspot) risk_score += 0.2;
      risk_score = Math.max(0, Math.min(1, risk_score + randomOffset));

      const risk_level =
        risk_score < 0.3 ? "Low" : risk_score < 0.6 ? "Moderate" : "High";

      // ✅ Log for debugging
      console.log("🧠 Prediction Save Check:", {
        userId,
        risk_score,
        risk_level,
      });

      // ✅ Save to MongoDB
      const newPrediction = new Prediction({
        userId,
        latitude,
        longitude,
        road_type,
        vehicle_type,
        weather,
        temperature: temp,
        light_condition,
        num_vehicles_involved,
        speed_limit,
        traffic_density,
        risk_score,
        risk_level,
      });
      await newPrediction.save();

      // ✅ Respond
      res.json({
        success: true,
        prediction: risk_score,
        risk_level,
        weather,
        temperature: temp,
      });
    });
  } catch (error) {
    console.error("❌ Backend Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
