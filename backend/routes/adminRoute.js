import express from "express";
import Prediction from "../models/Prediction.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all predictions for admin
router.get("/predictions", verifyToken, async (req, res) => {
  try {
    // Only allow admins
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const data = await Prediction.find()
      .populate("userId", "username role") // ✅ link username from User collection
      .sort({ createdAt: -1 }); // ✅ newest first

    if (!data || data.length === 0) {
      return res.status(200).json([]);
    }

    // ✅ Map clean response
    const formatted = data.map((p) => ({
      username: p.userId?.username || "Unknown",
      latitude: p.latitude,
      longitude: p.longitude,
      risk_level: p.risk_level,
      risk_score: p.risk_score?.toFixed(2),
      weather: p.weather,
      temperature: p.temperature?.toFixed(1),
      createdAt: p.createdAt,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("❌ Admin fetch error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
    