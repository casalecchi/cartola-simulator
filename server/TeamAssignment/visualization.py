import matplotlib.pyplot as plt
import numpy as np
import os
import pandas as pd

# Dados de 2019
dir_name = os.path.dirname(__file__)
data_dir = os.path.join(dir_name, "data/")
FILE_LIST = os.listdir(data_dir)


# TODO: concat years
def player_timeseries(slug: str):
    timeseries = pd.DataFrame(columns=["rodada", "pontos"])
    for round, file in enumerate(FILE_LIST):
        rodada = pd.read_csv(data_dir + file)
        player_row = rodada[rodada["atletas.slug"] == slug]
        if player_row.empty:
            continue
        points = player_row["atletas.pontos_num"].item()
        timeseries.loc[len(timeseries)] = [round, points]
    timeseries.set_index("rodada", inplace=True)

    fig, ax = plt.subplots(figsize=(20, 5))
    fig.set_facecolor("beige")
    ax.set_facecolor("beige")
    ax.plot(timeseries.index, timeseries.pontos, marker="o", color="midnightblue")

    x_ticks = np.arange(0, round + 1, 1)
    ax.set_xticks(x_ticks)
    for tick in x_ticks:
        ax.axvline(float(tick), color="gray", linestyle="--", linewidth=0.8)
    ax.set_xlabel("Rodada")
    ax.set_ylabel("Pontos")
    ax.set_title(f"Pontos do {slug} em 2019")
    fig.savefig(os.path.join(dir_name, f"images/{slug}-2019-ts.png"))


if __name__ == "__main__":
    FILE_LIST.sort()
    player_timeseries("filipe-luis")
