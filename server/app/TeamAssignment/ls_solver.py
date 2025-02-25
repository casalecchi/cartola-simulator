from tokenize import Double
from typing import List
from statistics import mean
import hexaly.optimizer
import instance
import base_solver


class LSM(base_solver.Solver):
    alfa = 0
    beta = 0
    step = 0

    def __init__(self, alfa, beta, step):
        self.alfa = alfa
        self.beta = beta
        self.step = step

    def solve(
        self, data_inst: instance.Data, strat_list: List[List[int]], money: Double, proficiency
    ):
        with hexaly.optimizer.HexalyOptimizer() as ls:
            squad = []

            model = ls.model

            y = [
                [model.bool() for j in range(len(data_inst.id))]
                for i in range(len(data_inst.posUnique))
            ]
            x = [model.bool() for e in range(len(strat_list))]

            knapsack_weight = model.sum(
                model.sum(data_inst.cost[j] * y[i][j] for j in range(len(data_inst.id)))
                for i in range(len(data_inst.posUnique))
            )
            model.constraint(knapsack_weight <= money)

            for i in range(len(data_inst.gama)):
                lhs = model.sum(y[i][data_inst.gama[i][j]] for j in range(len(data_inst.gama[i])))
                rhs = model.sum(strat_list[e][i] * x[e] for e in range(len(strat_list)))
                model.constraint(lhs == rhs)

            for j in range(len(data_inst.id)):
                just_one_position = model.sum(y[i][j] for i in range(len(data_inst.posUnique)))
                model.constraint(just_one_position <= 1)

            one_strat = model.sum(x[e] for e in range(len(strat_list)))
            model.constraint(one_strat == 1)

            obj1 = 0
            obj2 = 0
            teamsize = 0
            for i in range(len(data_inst.posUnique)):
                teamsize += model.sum(y[i][j] for j in range(len(data_inst.id)))
                obj1 += model.sum(
                    mean(proficiency[data_inst.id[j]]) * y[i][j] for j in range(len(data_inst.id))
                )
                # obj1 +=  model.sum( data_inst.score[j] * y[i][j] for j in range(len(data_inst.name)) )
                obj2 += model.sum(data_inst.cost[j] * y[i][j] for j in range(len(data_inst.id)))

            model.constraint(
                teamsize == model.sum(sum(strat_list[e]) * x[e] for e in range(len(strat_list)))
            )

            model.maximize(obj1)
            model.minimize(obj2)

            # model.maximize(min(self.alfa,1)*obj1 - max(self.beta,0)*obj2)

            model.close()

            ls.param.set_verbosity(0)
            ls.param.time_limit = int(3600)

            ls.solve()

            self.alfa = self.alfa + self.step
            self.beta = self.beta - self.step

            """
            for e in range(len(strat_list)):
                print("x["+str(e)+"]: "+str(x[e].value))

        
            print("Squad Size: "+str(len(squad)))
            """

            for i in range(len(data_inst.posUnique)):
                for j in range(len(data_inst.id)):
                    if y[i][j].value == 1:

                        squad.append(j)
            cap = -1
            cap_score = -1
            for j in squad:
                if mean(proficiency[data_inst.id[j]]) > cap_score:
                    if data_inst.position[j] == "tec":
                        continue

                    cap = j
                    cap_score = mean(proficiency[data_inst.id[cap]])

            for j in squad:
                if cap == j:
                    print(
                        data_inst.name[j]
                        + " "
                        + data_inst.position[j]
                        + " "
                        + str(data_inst.score[j])
                        + " - Capitão"
                    )
                else:
                    print(
                        data_inst.name[j]
                        + " "
                        + data_inst.position[j]
                        + " "
                        + str(data_inst.score[j])
                    )

            self.main_objval = obj1.value
            self.sec_objval = obj2.value

            """
            point = 0
            for j in squad:
                point += data_inst.score[j]
            print("Pontuação na rodada: "+str(point))
            """
            return squad, cap
