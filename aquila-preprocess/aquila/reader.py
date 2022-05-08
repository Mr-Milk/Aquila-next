import warnings
from pathlib import Path

import numpy as np
import pandas as pd
import anndata as ad
import h5py
from scipy.io import mmread
from scipy.sparse import csr_matrix


def read_10x_batch(h5files, stfiles, roi_names=None):
    """Prepare a list of h5files and spatial list files

    This will convert them all to aquila ready file

    """
    coords = []
    exp_dfs = []
    roi_names_collect = []

    if roi_names is None:
        roi_names = pd.DataFrame({"ROI": [f"ROI{i + 1}" for i in range(len(h5files))]})

    roi_header = roi_names.columns

    for h5, st, (_, names) in zip(h5files, stfiles, roi_names.iterrows()):
        print(h5)
        if Path(h5).is_dir():
            coord, gnames, exp_mtx = read_10x_folder(h5, st)
        else:
            coord, gnames, exp_mtx = read_10x(h5, st)

        coords.append(coord)
        sparse_exp = pd.DataFrame.sparse.from_spmatrix(data=exp_mtx, columns=gnames)
        exp_dfs.append(sparse_exp)
        roi_names_collect += [names.values for _ in range(len(coord))]

    obs = pd.concat(coords)
    obs['barcodes'] = obs.index
    obs.columns = ['cell_x', 'cell_y', 'barcodes']
    obs = obs.reset_index(drop=True)
    obs.index = obs.index.astype(str)
    obs[roi_header] = roi_names_collect

    exp_all = pd.concat(exp_dfs).fillna(0)
    return ad.AnnData(obs=obs, var=pd.DataFrame({"markers": exp_all.columns}), X=exp_all.to_numpy())


def read_10x(h5file, stfile):
    bc, gene_names, exp_mtx = read_10x_h5(h5file)
    coord = read_10x_spatial(stfile)
    # sort the coord based on barcode
    coord = coord.loc[bc, :]
    return coord, gene_names, exp_mtx


def read_10x_folder(path, stfile):
    coord = read_10x_spatial(stfile)
    path = Path(path)
    bc = [i for i in path.glob("*barcodes*")][0]
    features = [i for i in path.glob("*features*")][0]
    mtx = [i for i in path.glob("*matrix.mtx*")][0]

    try:
        bc_data = pd.read_csv(bc, sep="\t", header=None)
    except OSError:
        bc_data = pd.read_csv(bc, sep="\t", header=None, compression=None)

    try:
        f_data = pd.read_csv(features, sep="\t", header=None)
    except OSError:
        f_data = pd.read_csv(features, sep="\t", header=None, compression=None)

    try:
        exp = mmread(mtx)
    except OSError:
        exp = mmread(open(mtx))
    barcodes = bc_data.to_numpy().flatten()
    gene_names = f_data.iloc[:, 1].to_numpy().flatten()
    gene_ids = f_data.iloc[:, 0].to_numpy().flatten()
    genes = [f"{n} {i}" for n, i in zip(gene_names, gene_ids)]
    # sort the coord based on barcode
    sort_bc = pd.concat([coord, bc_data.set_index(0)], join="inner", axis=1).index
    coord = coord.loc[sort_bc, :]
    if len(sort_bc) != len(barcodes):
        warnings.warn(f"{len(barcodes) - len(sort_bc)} barcodes are missing")
        exp = pd.DataFrame.sparse.from_spmatrix(exp, columns=barcodes).T.loc[sort_bc, :].sparse.to_coo()
    else:
        exp = exp.T
    return coord, genes, exp


def read_10x_h5(h5file):
    with h5py.File(h5file) as h:
        # csr_matrix((data, indices, indptr), [shape=(M, N)])
        mtx = h.get('matrix')
        shape = mtx.get('shape')[:]
        exp = csr_matrix((mtx.get('data'), mtx.get('indices'), mtx.get('indptr')), shape=(shape[1], shape[0]))

        features = mtx.get('features')
        gene_names = features['name'][:].astype(str)
        gene_ids = features['id'][:].astype(str)
        barcodes = mtx.get('barcodes')[:].astype(str)
        genes = [f"{n} {i}" for n, i in zip(gene_names, gene_ids)]

        return barcodes, genes, exp


def read_10x_spatial(stlist):
    coord = pd.read_csv(stlist, header=None, index_col=0)
    coord = coord[coord.iloc[:, 0] == 1]
    return coord.iloc[:, [1, 2]].copy()


