import express from "express";
import mongoose from "mongoose";
import Prediction from "../models/Prediction.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👤 Fetch current user's predictions
router.get("/user", verifyToken, async (req, res) => {
  try {
    // ✅ Convert userId to ObjectId to match saved predictions
    const userId = req.user.id;
    let userIdObjectId = userId;
    if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
      userIdObjectId = new mongoose.Types.ObjectId(userId);
    }
    
    console.log("🔍 Fetching predictions for userId:", {
      original: userId,
      converted: userIdObjectId,
      type: typeof userId
    });
    
    // ✅ Try both ObjectId and string format to ensure we find all predictions
    const predictions = await Prediction.find({ 
      $or: [
        { userId: userIdObjectId },
        { userId: userId }
      ]
    }).sort({ createdAt: -1 });
    
    console.log("✅ Found predictions:", predictions.length);
    res.json(predictions);
  } catch (err) {
    console.error("❌ Error fetching predictions:", err);
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
