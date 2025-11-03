import os
import pandas as pd

def test_cluster_file_exists():
    assert os.path.exists("ml/data/clustered_accidents.csv")

def test_cluster_column_added():
    df = pd.read_csv("ml/data/clustered_accidents.csv")
    assert "cluster_zone" in df.columns
