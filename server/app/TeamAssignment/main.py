import os
import instance
import ls_solver
import simulation
from pathlib import Path


def main(year: int, predictions_path: str, teams_path: str):
    listOfStrat = [
        [1, 1, 2, 2, 3, 3],
        [1, 1, 2, 2, 4, 2],
        [1, 1, 3, 2, 3, 2],
        [1, 1, 3, 0, 4, 3],
        [1, 1, 3, 0, 5, 2],
        [1, 1, 2, 2, 5, 1],
        [1, 1, 3, 2, 4, 1],
    ]

    data_dir = os.path.join(os.path.dirname(__file__), f"data/{year}/")
    file_list = os.listdir(data_dir)
    file_list.sort()

    """
    print("Files :")
    print(file_list)
    """

    data_list = []
    for i in range(len(file_list)):
        dados = instance.Data(data_dir + file_list[i])
        data_list.append(dados)

    print("Número de rodadas: " + str(len(data_list)))
    """
    for i in range(len(dados.posUnique)):
        print(dados.posUnique[i])
        print(dados.gama[i])
    """

    # proficiency = genprof.GenProf(data_list,1).getProf()

    def_solver = ls_solver.LSM(0.5, 0.5, 0.5 / 5)
    # print(res.solve(instance.Data('./data/'+file_list[0]),listOfStrat, 100))
    # print(res.solve(data_list[1],listOfStrat, 100, proficiency))

    # print(res.main_objval)
    # print(res.sec_objval)

    Teste = simulation.Simulation(data_list, listOfStrat, def_solver)
    point = Teste.solve(predictions_path, teams_path)
    print("Pontuação Final: " + str(round(point, 2)))


if __name__ == "__main__":
    YEAR = 2020
    ROOT_DIR = Path(__file__).resolve().parent.parent
    MODEL_PATH = os.path.join(ROOT_DIR, "static/lstm/2020-5.json")
    TEAMS_PATH = os.path.join(ROOT_DIR, "static/otm/tetse.json")

    main(YEAR, MODEL_PATH, TEAMS_PATH)
