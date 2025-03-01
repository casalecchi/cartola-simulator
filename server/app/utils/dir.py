import os
import pandas as pd
from typing import Dict, List


def get_file_list(dir: str) -> List[str]:
    files = os.listdir(dir)
    files.sort()
    return files


def load_all_csvs(csv_dir: str) -> Dict[str, pd.DataFrame]:
    csv_dict = {}
    file_list = get_file_list(csv_dir)
    for file in file_list:
        path = os.path.join(csv_dir, file)
        csv_dict[file] = pd.read_csv(path)
    return csv_dict
