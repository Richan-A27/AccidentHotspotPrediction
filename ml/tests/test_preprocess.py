import os
import pandas as pd

def test_preprocessed_file_exists():
    assert os.path.exists("ml/data/preprocessed_accidents.csv")

def test_preprocessed_file_structure():
    df = pd.read_csv("ml/data/preprocessed_accidents.csv")
    assert "latitude" in df.columns
    assert len(df) > 0
