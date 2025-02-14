import os
from typing import List


def get_file_list(dir: str) -> List[str]:
    files = os.listdir(dir)
    files.sort()
    return files
