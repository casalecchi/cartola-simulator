AVAILABLE_MODELS = [
    "ARIMA (autoarima)",
    "ARIMA (P=1, D=1, Q=1)",
    "ARIMA (P=2, D=0, Q=3)",
    "LSTM (N=5, E=200, U1=64, U2=8)",
    "BEST POSSIBLE",
]

MODEL_MAP = {
    "ARIMA (AUTOARIMA)": "autoarima",
    "ARIMA (P=1, D=1, Q=1)": "1:1:1",
    "ARIMA (P=2, D=0, Q=3)": "2:0:3",
    "LSTM (N=5, E=200, U1=64, U2=8)": "l5",
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

FORMATION_MAP = {
    (1, 1, 2, 2, 3, 3): "4-3-3",
    (1, 1, 2, 2, 4, 2): "4-4-2",
    (1, 1, 3, 2, 3, 2): "5-3-2",
    (1, 1, 3, 0, 4, 3): "3-4-3",
    (1, 1, 3, 0, 5, 2): "3-5-2",
    (1, 1, 2, 2, 5, 1): "4-5-1",
    (1, 1, 3, 2, 4, 1): "5-4-1",
}
