import sys
import json
import joblib
import numpy as np
import os
import traceback
import pandas as pd

def predict_risk(input_json):
    try:
        # 🧩 Parse JSON input from Node.js
        data = json.loads(input_json)
        base_path = os.path.dirname(__file__)

        # 📂 Construct model paths
        model_path = os.path.join(base_path, "../models/risk_model.pkl")
        scaler_path = os.path.join(base_path, "../models/scaler.pkl")

        # ✅ Ensure files exist
        if not os.path.exists(model_path) or not os.path.exists(scaler_path):
            raise FileNotFoundError("❌ Missing model or scaler file. Run train_model.py first.")

        # 🧠 Load model + scaler
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)

        # 🔢 Define feature order (must match training script)
        features = [
            "latitude", "longitude", "road_type", "vehicle_type", "weather",
            "light_condition", "num_vehicles_involved", "speed_limit",
            "traffic_density", "weather_temp_c"
        ]

        # 🧮 Build feature vector from incoming data
        X = pd.DataFrame([{
            f: data.get(f, 0) for f in features
        }])

        # ⚙️ Scale features
        X_scaled = scaler.transform(X)

        # 🔮 Predict
        prediction = model.predict(X_scaled)
        risk_score = float(prediction[0])

        # ✅ Output (to Node stdout)
        print(round(risk_score, 2))
        sys.stdout.flush()

    except Exception as e:
        print("❌ Python Exception:", traceback.format_exc(), file=sys.stderr)
        sys.stderr.flush()
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ No input JSON provided.", file=sys.stderr)
        sys.exit(1)

    predict_risk(sys.argv[1])
