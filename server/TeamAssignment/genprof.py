from tokenize import Double
from typing import List
import instance


class GenProf:
    proficiency = {}

    def __init__(self, data_list: List[instance.Data], round: Double):

        for j in range(len(data_list[round].name)):
            self.proficiency[data_list[round].name[j]] = []
            # self.proficiency[data_list[round].name[j]].append(data_list[round-1].media[j])

        for r in range(round):
            for j in range(len(data_list[r].name)):
                if data_list[r].name[j] in self.proficiency.keys():
                    if r < 1:
                        self.proficiency[data_list[r].name[j]].append(data_list[r].media[j])
                    else:
                        self.proficiency[data_list[r].name[j]].append(data_list[r].score[j])

                    if len(self.proficiency[data_list[r].name[j]]) > 5:
                        self.proficiency[data_list[r].name[j]].pop(0)

        for key in self.proficiency:
            if len(self.proficiency[key]) < 1:
                self.proficiency[key].append(0)

    def getProf(self):
        return self.proficiency
