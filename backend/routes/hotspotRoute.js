import fs from "fs";
import path from "path";

export const getHotspots = (req, res) => {
  try {
    // ✅ Use a stable path — adjust if your ML data folder is elsewhere
    const filePath = path.resolve("ml/data/clustered_hotspots.json");

    if (!fs.existsSync(filePath)) {
      console.warn("⚠️ Hotspot data not found at:", filePath);
      return res.status(404).json({ message: "Hotspot data not found." });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error reading hotspot data:", error);
    res.status(500).json({ message: "Failed to load hotspot data." });
  }
};
