import gzip
import hashlib
import json
import logging
from typing import Union
from zipfile import ZipFile
from pathlib import Path

import anndata as ad
import pandas as pd
import scanpy as sc

log = logging.getLogger("rich")


def filter_adata(data: ad.AnnData):
    sc.pp.log1p(data)
    sc.pp.normalize_total(data, target_sum=1e6, exclude_highly_expressed=True)
    return data


def anndata2static(data: Union[ad.AnnData, Path, str], save_dir=None, dry_run=False):
    """
    The input anndata should have following field:
    - obs: 'cell_x', 'cell_y', if 'cell_type' is available, the data will include cell type information
    - var: 'markers'
    - uns: 'roi_cols' should be a list of string

    If `dry_run=True`, no file will be saved to the disk

    """
    if save_dir is None:
        save_dir = Path(".")
    else:
        save_dir = Path(save_dir)

    if not isinstance(data, ad.AnnData):
        data = ad.read_h5ad(data)

    obs_keys = data.obs_keys()
    var_keys = data.var_keys()

    for f in ['cell_x', 'cell_y']:
        assert f in obs_keys, f"`{f}` not in obs keys"
    assert 'markers' in var_keys, "`markers` not in var keys"
    has_cell_type = True if 'cell_type' in obs_keys else False

    roi_cols = data.uns['roi_cols']
    cell_info_cols = ['cell_x', 'cell_y', 'cell_type'] if has_cell_type else ['cell_x', 'cell_y']

    data = filter_adata(data)

    roi_info: pd.DataFrame = data.obs[roi_cols]
    cell_info: pd.DataFrame = data.obs[cell_info_cols]
    if marker_col is None:
        markers = data.var.index
    else:
        markers = data.var[marker_col]

    cell_exp = pd.DataFrame(data=data.X)
    cell_exp.columns = markers

    hash_seed = str(len(roi_info)) + str(cell_exp.shape[1])
    h = hashlib.blake2s(digest_size=16)
    h.update(hash_seed.encode())
    save_dir = save_dir / h.hexdigest()

    if not dry_run:
        save_dir.mkdir(exist_ok=True)

        save_options = dict(sep="\t", index=False, compression="gzip")
        roi_info.to_csv(save_dir / "roi_info.tsv.gz", **save_options)
        cell_info.to_csv(save_dir / "cell_info.tsv.gz", **save_options)
        cell_exp.to_csv(save_dir / "cell_exp.tsv.gz", **save_options)

        with ZipFile(save_dir / "all.zip", "w") as zip:
            zip.write(save_dir / "roi_info.tsv.gz")
            zip.write(save_dir / "cell_info.tsv.gz")
            zip.write(save_dir / "cell_exp.tsv.gz")

        # create meta.json to fill manually
        if not Path(save_dir / 'meta.json').exists():
            json.dump(
                {
                    "technology": "",
                    "species": "",
                    "tissue": "",
                    "molecule": "",
                    "disease": "",
                    "doi": "",
                    "is_single_cell": True,
                    "has_cell_type": True
                },
                open(save_dir / 'meta.json', 'w')
            )
        log.info(f"All files saved to {save_dir}")
    return save_dir
