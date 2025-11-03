import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    latitude: Number,
    longitude: Number,
    road_type: Number,
    vehicle_type: Number,
    weather: String,
    temperature: Number,
    light_condition: Number,
    num_vehicles_involved: Number,
    speed_limit: Number,
    traffic_density: Number,
    risk_score: Number,
    risk_level: String,
  },
  { timestamps: true } // ✅ very important for sorting by latest
);

export default mongoose.model("Prediction", predictionSchema);
