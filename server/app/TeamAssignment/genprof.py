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

        for j in range(len(data_list[round].id)):
            if data_list[round].id[j] in self.proficiency.keys():
                self.proficiency[data_list[round].id[j]] = [
                    predictions[f"{data_list[round].id[j]}"][round]
                ]

        for key in self.proficiency:
            if len(self.proficiency[key]) < 1:
                self.proficiency[key].append(0)

    def getProf(self):
        return self.proficiency
