import pandas as pd
from sklearn.cluster import KMeans
import joblib
import json
import os

def cluster_zones(csv_path="ml/data/preprocessed_accidents.csv"):
    # Load the preprocessed dataset
    df = pd.read_csv(csv_path)

    # Check required columns
    if not {"latitude", "longitude"}.issubset(df.columns):
        raise ValueError("Dataset must contain 'latitude' and 'longitude' columns.")

    # Train K-Means clustering on latitude & longitude
    kmeans = KMeans(n_clusters=6, random_state=42)
    df["cluster_zone"] = kmeans.fit_predict(df[["latitude", "longitude"]])

    # Save KMeans model and updated CSV
    os.makedirs("ml/models", exist_ok=True)
    os.makedirs("ml/data", exist_ok=True)
    joblib.dump(kmeans, "ml/models/kmeans_model.pkl")
    df.to_csv("ml/data/clustered_accidents.csv", index=False)

    # Prepare hotspot summary data (average lat/lon + average risk)
    if "risk_score" not in df.columns:
        df["risk_score"] = 0.5  # fallback value if risk not available

    clustered = (
        df.groupby("cluster_zone")[["latitude", "longitude", "risk_score"]]
        .mean()
        .reset_index()
        .sort_values(by="risk_score", ascending=False)
    )

    # Save to JSON for frontend map visualization
    json_path = "ml/data/clustered_hotspots.json"
    clustered.to_json(json_path, orient="records", indent=2)

    print(f"✅ K-Means model trained and zones assigned.")
    print(f"✅ Saved CSV → ml/data/clustered_accidents.csv")
    print(f"✅ Saved hotspot map data → {json_path} ({len(clustered)} zones)")

if __name__ == "__main__":
    cluster_zones()
