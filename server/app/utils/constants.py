AVAILABLE_MODELS = [
    "ARIMA (autoarima)",
    "ARIMA (P=1, D=1, Q=1)",
    "ARIMA (P=2, D=0, Q=3)",
    "LSTM (N STEPS=5)",
    "BEST POSSIBLE",
]

MODEL_MAP = {
    "ARIMA (AUTOARIMA)": "autoarima",
    "ARIMA (P=1, D=1, Q=1)": "1:1:1",
    "ARIMA (P=2, D=0, Q=3)": "2:0:3",
    "LSTM (N STEPS=5)": "l5",
    "BEST POSSIBLE": "best",
}

POSITION_MAP = {"gol": "gk", "lat": "wb", "zag": "cb", "mei": "mid", "ata": "st", "tec": "man"}
STATUS_MAP = {
    "Provável": "probable",
    "Dúvida": "doubt",
    "Contundido": "injury",
    "Suspenso": "suspended",
    "Nulo": "null",
}
