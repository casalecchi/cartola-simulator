import matplotlib.pyplot as plt
import numpy as np
import os
from pathlib import Path
from typing import List
from utils.timeseries import create_timeseries_from_year


def plot_by_id(id: int, year: int, year_dir: str, predictions: List[float] = []):
    timeseries, player_name = create_timeseries_from_year(id, year_dir)

    fig, ax = plt.subplots(figsize=(20, 5))
    fig.set_facecolor("beige")
    ax.set_facecolor("beige")
    ax.plot(
        timeseries.index, timeseries.pontos, marker="o", color="midnightblue", label="Valor Real"
    )
    if len(predictions) > 0:
        ax.plot(
            [i for i in range(1, len(predictions) + 1)],
            predictions,
            marker="o",
            color="red",
            label="Previsão",
        )

    x_ticks = np.arange(1, 39, 1)
    ax.set_xticks(x_ticks)
    for tick in x_ticks:
        ax.axvline(float(tick), color="gray", linestyle="--", linewidth=0.8)
    ax.set_xlabel("Rodada")
    ax.set_ylabel("Pontos")
    ax.set_title(f"Pontos do {player_name} em {year}")
    ax.legend()

    ROOT_DIR = Path(__file__).resolve().parent.parent
    IMAGE_DIR = os.path.join(ROOT_DIR, "images")
    fig.savefig(f"{IMAGE_DIR}/{player_name}-{year}-ts.png")


if __name__ == "__main__":
    ROOT_DIR = Path(__file__).resolve().parent.parent
    YEAR = 2020
    YEAR_DIR = os.path.join(ROOT_DIR, f"data/{YEAR}/")
    plot_by_id(38913, YEAR, YEAR_DIR)
