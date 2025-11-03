import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// 🧩 Import Routes
import authRoutes from "./routes/authRoutes.js";
import predictRoute from "./routes/predictRoute.js";
import predictionHistory from "./routes/predictionHistory.js";
import adminRoute from "./routes/adminRoute.js";
import hotspotRoute from "./routes/hotspot.js"; 


// ⚙️ Initialize app
const app = express();

// 🗄️ Connect to MongoDB
connectDB();

// 🧱 Middleware
app.use(cors());
app.use(express.json());

// 🚀 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/predict", predictRoute);
app.use("/api/predictions", predictionHistory);
app.use("/api/admin", adminRoute);
app.use("/api/hotspots", hotspotRoute); 

// 🟢 Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
