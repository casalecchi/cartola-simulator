AVAILABLE_MODELS = [
    "ARIMA (autoarima)",
    "ARIMA (P=1, D=1, Q=1)",
    "ARIMA (P=2, D=0, Q=3)",
    "LSTM (N STEPS=5)",
]

MODEL_MAP = {
    "ARIMA (AUTOARIMA)": "autoarima",
    "ARIMA (P=1, D=1, Q=1)": "1:1:1",
    "ARIMA (P=2, D=0, Q=3)": "2:0:3",
    "LSTM (N STEPS=5)": "l5",
}

POSITION_MAP = {"gol": "gk", "lat": "wb", "zag": "cb", "mei": "mid", "ata": "st", "tec": "man"}
