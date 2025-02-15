from tokenize import Double
from typing import List
import instance


class Solver:
    main_objval = -1
    sec_objval = -1
    solution = []

    def solve(
        self,
        data_inst: instance.Data,
        strat_list: List[List[int]],
        money: Double,
        proficiency,
    ):
        raise NotImplementedError("You should implement this method on the subclass")
