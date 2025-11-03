import express from "express";
import { getHotspots } from "../controllers/hotspotController.js";

const router = express.Router();

// ✅ Route to serve clustered hotspot data
router.get("/", getHotspots);

export default router;
