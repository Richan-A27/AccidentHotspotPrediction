import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_absolute_error
import joblib
import os

def train_model(csv_path="ml/data/clustered_accidents.csv"):
    # 🔹 Load dataset
    df = pd.read_csv(csv_path)

    # 🔹 Check required columns
    required_cols = [
        "latitude", "longitude", "road_type", "vehicle_type", "weather",
        "light_condition", "num_vehicles_involved", "speed_limit",
        "traffic_density", "weather_temp_c"
    ]

    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Missing required column: {col}")

    # 🔹 Define features (X) and target (y)
    X = df[required_cols]
    if "risk_score" in df.columns:
        y = df["risk_score"]
    elif "incident_count" in df.columns:
        # fallback: normalize incident_count as proxy for risk
        y = df["incident_count"] / df["incident_count"].max()
    else:
        raise ValueError("Dataset must contain 'risk_score' or 'incident_count' column")

    # 🔹 Split into train/test sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # 🔹 Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 🔹 Train model
    model = RandomForestRegressor(n_estimators=200, random_state=42)
    model.fit(X_train_scaled, y_train)

    # 🔹 Evaluate model
    preds = model.predict(X_test_scaled)
    r2 = r2_score(y_test, preds)
    mae = mean_absolute_error(y_test, preds)
    print(f"✅ Model trained successfully | R²: {r2:.3f} | MAE: {mae:.3f}")

    # 🔹 Ensure save directories exist
    os.makedirs("ml/models", exist_ok=True)

    # 🔹 Save model and scaler
    joblib.dump(model, "ml/models/risk_model.pkl")
    joblib.dump(scaler, "ml/models/scaler.pkl")

    print("📁 Saved:")
    print("   → Model:  ml/models/risk_model.pkl")
    print("   → Scaler: ml/models/scaler.pkl")


if __name__ == "__main__":
    train_model()
