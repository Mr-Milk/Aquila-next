from time import time

import numpy as np
from svgene import run_somde, run_spatialde

N = 10000
EXP = np.random.randn(N).tolist()
COORD = np.random.randn(N, 2).tolist()

print('First run')
print(run_spatialde(EXP, COORD))

print("Second run")
t1 = time()
print(run_spatialde(EXP, COORD))
t2 = time()
print(f"{t2 - t1}s")
