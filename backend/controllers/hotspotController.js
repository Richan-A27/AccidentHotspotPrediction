import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getHotspots = (req, res) => {
  try {
    const csvPath = path.resolve(__dirname, "../../ml/data/clustered_accidents.csv");

    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ error: "Hotspot file not found at " + csvPath });
    }

    const data = fs.readFileSync(csvPath, "utf8");
    const rows = data.trim().split("\n").slice(1); // skip header

    // Parse CSV rows
    const hotspots = rows.map((line) => {
      const cols = line.split(",");
      const latitude = parseFloat(cols[6]);
      const longitude = parseFloat(cols[7]);
      const risk = 1; // Default risk value for visualization
      return { latitude, longitude, risk };
    });

    res.json({ hotspots });
  } catch (err) {
    console.error("🔥 Error loading hotspots:", err);
    res.status(500).json({ error: "Unable to load hotspots" });
  }
};
