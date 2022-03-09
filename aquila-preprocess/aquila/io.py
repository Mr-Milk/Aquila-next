import hashlib
import json
import logging
import os
import warnings
from pathlib import Path
from subprocess import Popen
from typing import Union, Optional, Dict
from uuid import uuid4
from zipfile import ZipFile

import anndata as ad
import pandas as pd
import scanpy as sc
import ujson
from sqlalchemy import create_engine

from .db import (PGBase,
                 DataRecord,
                 CellInfo,
                 CellExp,
                 ROIInfo,
                 CellInfo3D,
                 check_uuid)
from .guards import check_adata
from .query import get_config

File = Union[Path, str]

log = logging.getLogger("rich")
log.setLevel("INFO")
config = get_config()

if config is None:
    warnings.warn("Failed to load .env file")


def copy2remote(source, remote, ssh_config=None) -> Popen:
    """Copy files from local to a remote place using scp

    >>> copy2remote('a.txt', '/path/to/dest/a.txt', 'net@10.1.1.110')

    :param source: Source file to be copied
    :param remote: Destination location, make sure it exists
    :param ssh_config: user@remote_host
    :return:
    """

    import paramiko

    if config is None:
        raise FileNotFoundError("Failed to load .env file")
    hostname = config['HOST']
    username = config['SSH_USER']
    password = config['SSH_PASSWORD']

    source = Path(source)
    if not source.exists():
        raise FileNotFoundError(f"Source file {source} not exist")
    source = str(source.absolute())

    log.info(f"Copy {source} to {remote} on host {hostname}")

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname, username=username, password=password)
    sftp = ssh.open_sftp()
    try:
        sftp.stat(remote)
        log.info("File already exists on the remote server, skip!")
    except IOError:
        sftp.put(source, remote)
    sftp.close()
    ssh.close()
    log.info("Success! Copied to remoted")


def df2sql(df: pd.DataFrame, sql_tb: PGBase):
    if config is None:
        raise FileNotFoundError("Failed to load .env file")
    engine = create_engine(config['ENGINE'])
    insert_policy = dict(if_exists="append", index=False)
    df.to_sql(sql_tb.__tablename__, engine, **insert_policy)


def get_data_uuid(meta: Dict) -> str:
    obscure = ""
    if meta.get("obscure") is not None:
        obscure = meta["obscure"]

    hash_seed = meta["doi"] + meta["technology"] + meta["molecule"] + meta["organ"] + obscure
    h = hashlib.blake2s(digest_size=16)
    h.update(hash_seed.encode())
    return h.hexdigest()


def create_roi_id(roi_info: pd.DataFrame):
    log.info(f"ROI INFO has columns: {roi_info.columns.tolist()}")
    roi_group = roi_info.groupby(roi_info.columns.tolist(), sort=False)
    roi_count = 0
    roi_id_list = []
    for _, df in roi_group:
        roi_count += 1
        id_ = str(uuid4())
        roi_id_list += [id_ for _ in range(len(df))]
    return roi_id_list, roi_count


def group_roi_info(roi_info: pd.DataFrame, data_uuid: str):
    # group roi_info
    roi_info_db = []
    for roi_id, df in roi_info.groupby('roi_id', sort=False, group_keys=False):
        roi_info_db.append([
            roi_id, data_uuid, json.dumps(df.to_dict("records")[0])
        ])
    roi_info_db = pd.DataFrame(roi_info_db, columns=['roi_id', 'data_uuid', 'meta'])
    return roi_info_db


def group_cell_info(cell_info, data_uuid, cell_info_cols):
    cell_info_db = []
    has_cell_type = ('cell_type' in cell_info_cols)
    is_3d = ('cell_z' in cell_info_cols)
    for roi_id, roi_cells in cell_info.groupby('roi_id', sort=False, group_keys=False):
        cell_type = roi_cells['cell_type'].tolist() if has_cell_type else []
        if is_3d:
            cell_info_db.append([roi_id, data_uuid,
                                 roi_cells['cell_x'].tolist(),
                                 roi_cells['cell_y'].tolist(),
                                 roi_cells['cell_z'].tolist(),
                                 cell_type
                                 ])
        else:
            cell_info_db.append([roi_id, data_uuid,
                                 roi_cells['cell_x'].tolist(),
                                 roi_cells['cell_y'].tolist(),
                                 cell_type
                                 ])
    cols = ['cell_x', 'cell_y', 'cell_z'] if is_3d else ['cell_x', 'cell_y']
    cell_info_db = pd.DataFrame(cell_info_db, columns=['roi_id', 'data_uuid', *cols, 'cell_type'])
    return cell_info_db


def group_cell_exp(cell_exp, data_uuid, markers):
    cell_exp_db = []
    for roi_id, roi_cells in cell_exp.groupby('roi_id', sort=False, group_keys=False):
        for m in markers:
            cell_exp_db.append([
                roi_id, data_uuid, m, roi_cells[m].tolist()
            ])
    cell_exp_db = pd.DataFrame(cell_exp_db, columns=['roi_id', 'data_uuid', 'marker', 'expression'])
    return cell_exp_db


def filter_adata(data: ad.AnnData):
    dmin = data.X.min()
    if dmin < 0:
        data.X = data.X + abs(dmin)

    sc.pp.filter_cells(data, min_genes=2)
    sc.pp.filter_genes(data, min_cells=5)
    sc.pp.normalize_total(data, target_sum=1e6, exclude_highly_expressed=True)


def data2db(data: Union[ad.AnnData, File],
            static_dir: Optional[File] = None,
            override: bool = False,
            ):
    if static_dir is None:
        static_dir = Path("static_files")
    else:
        static_dir = Path(static_dir)
    static_dir.mkdir(exist_ok=True, parents=True)
    if not isinstance(data, ad.AnnData):
        data = ad.read_h5ad(data)

    meta = data.uns['meta']
    roi_cols = data.uns['roi_cols']
    cell_info_cols = ['cell_x', 'cell_y']
    has_cell_type = meta["has_cell_type"]
    is_3d = meta["is_3d"]

    # explicitly type coerce
    meta['is_single_cell'] = bool(meta['is_single_cell'])
    meta['has_cell_type'] = bool(meta['has_cell_type'])
    meta['is_3d'] = bool(meta['is_3d'])

    if is_3d:
        cell_info_cols.append("cell_z")
    if has_cell_type:
        cell_info_cols.append("cell_type")

    # Get info for data records
    markers = data.var['markers']
    cell_count, marker_count = data.shape

    data_uuid = get_data_uuid(meta)
    if not check_uuid(data_uuid):
        raise ValueError("DATA UUID already exist, add `obscure` to meta make things different")

    roi_info: pd.DataFrame = data.obs[roi_cols].copy()
    cell_info: pd.DataFrame = data.obs[cell_info_cols].copy()
    cell_exp = pd.DataFrame(data=data.X)
    cell_exp.columns = markers

    # create static files
    static_zip = static_dir / f"{data_uuid}.zip"
    roi_static = static_dir / "roi_info.csv.gz"
    cell_info_staic = static_dir / "cell_info.csv.gz"
    cell_exp_static = static_dir / "cell_exp.csv.gz"
    info_static = static_dir / "info.json"
    if not static_zip.exists() | override:
        save_options = dict(sep=",", index=False, compression="gzip")
        roi_info.to_csv(roi_static, **save_options)
        cell_info.to_csv(cell_info_staic, **save_options)
        cell_exp.to_csv(cell_exp_static, **save_options)
        ujson.dump(dict(**meta,
                        cell_count=cell_count,
                        marker_count=marker_count,
                        ),
                   open(info_static, 'w'))

        with ZipFile(static_zip, "w") as zipped:
            zipped.write(static_dir / "roi_info.csv.gz")
            zipped.write(static_dir / "cell_info.csv.gz")
            zipped.write(static_dir / "cell_exp.csv.gz")
            zipped.write(static_dir / "info.json")

        # clean file afterwards
        os.remove(roi_static)
        os.remove(cell_info_staic)
        os.remove(cell_exp_static)
        os.remove(info_static)
    else:
        log.info("Found existed static zip, skipping generating static files")

    # process ROI
    log.info("Generating ROI IDs")
    roi_id_list, roi_count = create_roi_id(roi_info)
    # add data uuid
    roi_info['data_uuid'] = data_uuid
    cell_info['data_uuid'] = data_uuid
    cell_exp['data_uuid'] = data_uuid
    # add roi id
    roi_info['roi_id'] = roi_id_list
    cell_info['roi_id'] = roi_id_list
    cell_exp['roi_id'] = roi_id_list

    log.info("Creating dataframe")
    roi_info_db = group_roi_info(roi_info, data_uuid)
    cell_info_db = group_cell_info(cell_info, data_uuid, cell_info_cols)
    cell_exp_db = group_cell_exp(cell_exp, data_uuid, markers)
    record = pd.DataFrame(dict(
        data_uuid=data_uuid,
        **meta,
        roi_count=roi_count,
        cell_count=cell_count,
        marker_count=marker_count,
        markers=[markers.tolist()],
        extra_info=""
    ))
    try:
        del record['doi']
        del record['obscure']
    except:
        pass

    log.info("Write to database")
    df2sql(record, DataRecord)
    df2sql(roi_info_db, ROIInfo)
    df2sql(cell_exp_db, CellExp)
    if is_3d:
        df2sql(cell_info_db, CellInfo3D)
    else:
        df2sql(cell_info_db, CellInfo)
    log.info("Successfully dump to database")

    copy2remote(static_zip, f"{config['REMOTE_DIR']}/{static_zip.name}")


def save_data(data, export):
    export = Path(export)
    export.mkdir(exist_ok=True, parents=True)

    check_adata(data)
    filter_adata(data)
    meta = data.uns['meta']

    name = [meta['technology'], "3D" if meta['is_3d'] else "2D",
            meta['year'], meta['journal'], f"{data.shape[0]}×{data.shape[1]}"]
    data.write(export / f"{'-'.join(name)}.h5ad")
