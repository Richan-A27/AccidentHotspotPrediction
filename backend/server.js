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
// CORS configuration - allow frontend domain in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || '*' 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Logging middleware for debugging
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log(`📥 ${req.method} ${req.path}`, {
      body: req.body,
      contentType: req.headers['content-type']
    });
  }
  next();
});

// 🚀 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/predict", predictRoute);
app.use("/api/predictions", predictionHistory);
app.use("/api/admin", adminRoute);
app.use("/api/hotspots", hotspotRoute);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running", status: "OK" });
});

// 🟢 Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
