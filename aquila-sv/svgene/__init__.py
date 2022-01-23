from typing import List
import numpy as np
import pandas as pd
import anndata as ad

from .spatialde import test


def run_sepal() -> bool:
    return False


def run_spatialde(
        exp: np.ndarray,
        coord: np.ndarray,
) -> bool:
    X = exp.reshape(len(exp), 1)
    var = pd.DataFrame({'gene': ['0']})
    var.set_index('gene', inplace=True)
    data = ad.AnnData(X=X, var=var)
    data.obsm['coord'] = np.array(coord)
    result, _ = test(data, omnibus=True, spatial_key='coord', use_cache=True)
    return True
