import numpy as np
import pandas as pd
from pointpats.ripley import k_test, f_test, g_test, l_test

ripley_func = {
    "K": k_test,
    "F": f_test,
    "G": g_test,
    "L": l_test,
}


def run_ripley(x, y, types, support=10, mode="F"):
    # Get the distance bins

    if len(types) == 0:
        types = np.zeros(len(x))

    x = np.array(x)
    y = np.array(y)
    side = np.min([np.abs(x.min() - x.max()), np.abs(y.min() - y.max())]) / 2
    data = pd.DataFrame({
        "x": x,
        "y": y,
        "type": types
    })

    respond = []
    ripley_call = ripley_func[mode]
    for t, g in data.groupby('type'):
        points = g[['x', 'y']].to_numpy()
        test = ripley_call(points, support=(0, side, support), n_simulations=0)
        respond.append(
            {
                "type": t,
                "distance": test.support.tolist(),
                "value": test.statistic.tolist(),
            }
        )
    return respond
