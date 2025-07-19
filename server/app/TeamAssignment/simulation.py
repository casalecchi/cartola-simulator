import base_solver
import genprof
import instance
import json
import os
from pathlib import Path
from typing import List


class Simulation:
    money = 100
    chosen_solver = None
    strat_list = []
    instance = []
    point = 0
    proficiency = {}

    def __init__(
        self,
        data_list: List["instance.Data"],
        strat_list: List[List[int]],
        solver: base_solver.Solver,
    ):
        self.instance = data_list
        self.chosen_solver = solver
        self.strat_list = strat_list

    # O indice do jogador pode mudar, então precisa procurar pelo novo indice
    def UpdateMoney(self, cur, fol, squad, money):
        balance = 0
        used = 0
        sell = 0
        for j in squad:
            used += cur.cost[j]
            # achar a posição do jogador na nova rodada
            try:
                index = fol.id.index(cur.id[j])
                sell += fol.cost[index]
            except:
                sell += cur.new_cost[j]

        balance = money - used + sell

        return balance

    def solve(self, predictions_path: str, teams_path: str):
        file = open(predictions_path, "r")
        predictions = json.load(file)
        file.close()

        optimal_teams = {}
        for r in range(len(self.instance)):
            # if r == 29:
            #    print(self.instance[r].dataDir)
            #    continue
            points = 0
            print("Rodada: " + str(r + 1))
            self.proficiency = genprof.GenProf(self.instance, r, predictions).getProf()
            squad, cap, formation = self.chosen_solver.solve(
                self.instance[r], self.strat_list, self.money, self.proficiency
            )
            if len(squad) < 12:
                print("Invalid Squad: " + str(r))

            for j in squad:
                self.point += self.instance[r].score[j]
                points += self.instance[r].score[j]

            self.point += self.instance[r].score[cap]
            points += self.instance[r].score[cap]

            aux_money = self.money

            if r < len(self.instance) - 1:
                self.money = self.UpdateMoney(
                    self.instance[r], self.instance[r + 1], squad, self.money
                )
            print(
                str(round(self.point, 2))
                + " "
                + str(round(self.money, 2))
                + " "
                + str(round(self.money - aux_money, 2))
            )
            print("")

            team = []
            for p in squad:
                id = self.instance[r].id[p]
                team.append(
                    {"id": id, "points": self.instance[r].score[p], "pred": predictions[str(id)][r]}
                )

            optimal_teams[r + 1] = {
                "team": team,
                "cap": self.instance[r].id[cap],
                "formation": formation,
            }

        with open(teams_path, "w") as f:
            json.dump(optimal_teams, f, indent=4, ensure_ascii=False)

        return self.point
