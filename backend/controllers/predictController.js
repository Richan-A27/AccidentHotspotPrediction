import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OPENWEATHER_API_KEY = "fe1bfbfaa80d4e20dc759483f742908d"; // 🔑 your API key

export const getPrediction = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      road_type = 1, // default urban road
      vehicle_type = 0, // default car
      light_condition, // optional
      num_vehicles_involved = 2,
      speed_limit = 60,
      traffic_density // optional
    } = req.body;

    // 🕓 Auto-determine light condition if not provided
    const currentHour = new Date().getHours();
    const inferredLight =
      light_condition !== undefined
        ? light_condition
        : currentHour >= 6 && currentHour <= 18
        ? 2 // daylight
        : 0; // night

    // 🚦 Simulate traffic density if not provided
    const inferredTraffic =
      traffic_density !== undefined
        ? traffic_density
        : Math.random() < 0.4
        ? 1 // medium
        : Math.random() < 0.8
        ? 2 // heavy
        : 0; // low

    // 🌦️ Fetch live weather data from OpenWeather
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const weatherRes = await axios.get(url);

    const weatherMain = weatherRes.data.weather[0].main || "Clear"; // e.g. "Clouds"
    const temp = weatherRes.data.main.temp;

    // Encode weather to numeric value for model
    let weatherEncoded = 0;
    const w = weatherMain.toLowerCase();
    if (w.includes("rain")) weatherEncoded = 1;
    else if (w.includes("fog")) weatherEncoded = 2;
    else if (w.includes("cloud")) weatherEncoded = 3;
    else weatherEncoded = 0;

    // 🧠 Prepare final input data for ML model
    const inputData = {
      latitude,
      longitude,
      road_type,
      vehicle_type,
      weather: weatherEncoded,
      light_condition: inferredLight,
      num_vehicles_involved,
      speed_limit,
      traffic_density: inferredTraffic,
      weather_temp_c: temp,
    };

    console.log("🚀 Input data to model:", inputData);

    // 🧩 Path to Python script
    const scriptPath = path.resolve(__dirname, "../../ml/scripts/predict_risk.py");

    // ⚙️ Run Python model
    const python = spawn("python3", [scriptPath, JSON.stringify(inputData)]);

    let output = "", errOutput = "";
    python.stdout.on("data", (d) => (output += d.toString()));
    python.stderr.on("data", (d) => (errOutput += d.toString()));

    python.on("close", (code) => {
      if (code === 0) {
        res.json({
          success: true,
          prediction: output.trim(),
          weather: weatherMain,
          temperature: temp,
          light_condition: inferredLight,
          traffic_density: inferredTraffic,
        });
      } else {
        console.error("❌ Python Error:", errOutput);
        res.status(500).json({ success: false, error: errOutput });
      }
    });
  } catch (e) {
    console.error("❌ Backend Error:", e);
    res.status(500).json({ success: false, error: e.message });
  }
};
