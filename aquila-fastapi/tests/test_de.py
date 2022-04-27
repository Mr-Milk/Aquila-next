import numpy as np
from aquila_spatial import run_somde


N = 10000
EXP = np.random.randint(N).tolist()
COORD = np.random.randint(N, 2)


def test_somde():
    run_somde(EXP, COORD)
