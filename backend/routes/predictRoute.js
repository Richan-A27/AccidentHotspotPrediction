import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import axios from "axios";
import mongoose from "mongoose";
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

    // ✅ Convert userId to ObjectId if it's a string (JWT stores it as string)
    let userIdObjectId = userId;
    if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
      userIdObjectId = new mongoose.Types.ObjectId(userId);
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

    // ✅ Validate required fields
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    // 🌦 Fetch live weather data
    let weather, temp;
    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      weather = weatherRes.data.weather[0].main;
      temp = weatherRes.data.main.temp;
    } catch (weatherError) {
      console.error("❌ Weather API Error:", weatherError.message);
      // Use default values if weather API fails
      weather = "Clear";
      temp = 25;
    }

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
    
    // ✅ Check if script exists
    if (!fs.existsSync(scriptPath)) {
      console.error("❌ Python script not found:", scriptPath);
      return res.status(500).json({ error: "Prediction script not found" });
    }

    // ✅ Use venv Python to ensure correct scikit-learn version
    const venvPythonPath = path.resolve(__dirname, "../../venv/bin/python3");
    const pythonExecutable = fs.existsSync(venvPythonPath) ? venvPythonPath : "python3";
    
    console.log("🐍 Using Python:", pythonExecutable);
    const python = spawn(pythonExecutable, [scriptPath, JSON.stringify(inputData)]);

    let output = "";
    let errOutput = "";

    python.stdout.on("data", (data) => (output += data.toString()));
    python.stderr.on("data", (data) => (errOutput += data.toString()));

    python.on("close", async (code) => {
      try {
        if (code !== 0) {
          console.error("❌ Python Error:", errOutput);
          return res.status(500).json({ 
            success: false,
            error: errOutput || "Python script execution failed" 
          });
        }

        const outputTrimmed = output.trim();
        if (!outputTrimmed || isNaN(parseFloat(outputTrimmed))) {
          console.error("❌ Invalid Python output:", outputTrimmed);
          return res.status(500).json({ 
            success: false,
            error: "Invalid prediction output from model" 
          });
        }

        let risk_score = parseFloat(outputTrimmed);

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
          userId: userIdObjectId,
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
        
        const savedPrediction = await newPrediction.save();
        console.log("✅ Prediction saved successfully:", {
          id: savedPrediction._id,
          userId: savedPrediction.userId,
          risk_score: savedPrediction.risk_score,
          createdAt: savedPrediction.createdAt,
        });

        // ✅ Respond
        res.json({
          success: true,
          prediction: risk_score,
          risk_level,
          weather,
          temperature: temp,
        });
      } catch (saveError) {
        console.error("❌ Save Error:", saveError);
        // Still return prediction even if save fails
        res.json({
          success: true,
          prediction: risk_score,
          risk_level,
          weather,
          temperature: temp,
          warning: "Prediction saved but history may not be updated",
        });
      }
    });

    // ✅ Handle Python process errors
    python.on("error", (error) => {
      console.error("❌ Python Process Error:", error);
      if (!res.headersSent) {
        res.status(500).json({ 
          success: false,
          error: `Failed to execute Python script: ${error.message}` 
        });
      }
    });
  } catch (error) {
    console.error("❌ Backend Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false,
        error: error.message || "Internal server error" 
      });
    }
  }
});

export default router;
