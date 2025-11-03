import express from "express";
import Prediction from "../models/Prediction.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👤 Fetch current user's predictions
router.get("/user", verifyToken, async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user predictions" });
  }
});

// 🧑‍💼 Admin: view all predictions
router.get("/admin", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Access denied" });
    const allPredictions = await Prediction.find().populate("userId", "username");
    res.json(allPredictions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all predictions" });
  }
});

export default router;
