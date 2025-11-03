import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib

def preprocess_data(csv_path="ml/data/chennai_accidents.csv"):
    # Load dataset
    df = pd.read_csv(csv_path)
    df.dropna(inplace=True)

    # Encode categorical columns
    categorical_cols = ["road_type", "vehicle_type", "weather", "light_condition", "traffic_density"]
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])

    # Scale numeric features
    scaler = StandardScaler()
    features = ["latitude", "longitude", "speed_limit", "num_vehicles_involved", "weather_temp_c"]
    df[features] = scaler.fit_transform(df[features])

    # Save scaler and preprocessed CSV
    joblib.dump(scaler, "ml/models/scaler.pkl")
    df.to_csv("ml/data/preprocessed_accidents.csv", index=False)

    print("Data preprocessed and saved to ml/data/preprocessed_accidents.csv")

if __name__ == "__main__":
    preprocess_data()
