from typing import Sequence
import numpy as np
import pandas as pd
import anndata as ad

from .spatialde import test
from .ripley import run_ripley
from .spatial_community import run_community, run_centrality


def run_sepal() -> bool:
    return False


def run_spatialde(
        exp: np.ndarray,
        coord: np.ndarray,
        pval: float = 0.05
) -> Sequence[bool]:
    X = exp
    var = pd.DataFrame({'gene': [str(i) for i in range(X.shape[1])]})
    var.set_index('gene', inplace=True)
    data = ad.AnnData(X=X, var=var)
    data.obsm['coord'] = np.array(coord)
    result, ir = test(data, omnibus=True, spatial_key='coord', use_cache=True)
    print(result, ir)
    return (result['padj'] < pval).astype(bool)
