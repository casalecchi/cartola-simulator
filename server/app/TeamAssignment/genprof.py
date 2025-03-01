import instance
from typing import Dict, List


class GenProf:
    proficiency: Dict[str, List[float]] = {}

    def __init__(
        self, data_list: List[instance.Data], round: int, predictions: Dict[str, List[int]]
    ):

        for j in range(len(data_list[round].id)):
            self.proficiency[data_list[round].id[j]] = []
            # self.proficiency[data_list[round].name[j]].append(data_list[round-1].media[j])

        for r in range(round):
            for j in range(len(data_list[r].id)):
                if data_list[r].id[j] in self.proficiency.keys():
                    if r < 1:
                        self.proficiency[data_list[r].id[j]].append(data_list[r].media[j])
                    else:
                        # antes usava a média das 5 últimas rodadas
                        # self.proficiency[data_list[r].name[j]].append(data_list[r].score[j])
                        # agora usamos só o último valor da previsão do ARIMA
                        self.proficiency[data_list[r].id[j]] = [
                            predictions[f"{data_list[r].id[j]}"][r]
                        ]

                    # if len(self.proficiency[data_list[r].name[j]]) > 5:
                    #     self.proficiency[data_list[r].name[j]].pop(0)

        for key in self.proficiency:
            if len(self.proficiency[key]) < 1:
                self.proficiency[key].append(0)

    def getProf(self):
        return self.proficiency
