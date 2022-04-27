import igraph as ig
import numpy as np
import pandas as pd


def run_community(e1, e2, weights,
                  trials=10,
                  resolution=0.1,
                  method="leiden"):
    edges_list = [(a, b) for a, b in zip(e1, e2)]
    G = ig.Graph(edges_list)
    G.es.set_attribute_values('weight', weights)
    if method == "leiden":
        part = G.community_leiden(resolution_parameter=resolution, weights="weight")
    elif method == 'louvain':
        part = G.community_multilevel(weights="weight")
    else:
        part = G.community_infomap(edge_weights='weight', trials=trials)
    return part.membership


def run_centrality(e1, e2, types, measure="closeness"):
    edges_list = [(a, b) for a, b in zip(e1, e2)]
    G = ig.Graph(edges_list)

    if measure == 'closeness':
        centrality = G.closeness()
    elif measure == 'betweenness':
        centrality = G.betweenness()
    else:
        centrality = G.degree()

    if len(types) == 0:
        types = np.zeros(len(centrality))
    data = pd.DataFrame({
        "value": centrality,
        "type": types
    })
    response = []
    for n, g in data.groupby('type'):
        response.append({
            'type': n,
            'centrality': g['value'].tolist(),
        })
    return response
