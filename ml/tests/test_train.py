import os

def test_model_saved():
    assert os.path.exists("ml/models/risk_model.pkl")
