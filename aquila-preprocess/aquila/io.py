import hashlib
import json
import logging
from pathlib import Path
from subprocess import Popen
from uuid import uuid4

import numpy as np
import pandas as pd
from orjson import orjson
from sqlalchemy import create_engine

from .db import PGBase, DataRecord, CellInfo, CellExp, ROIInfo
from .query import get_doi_info, get_config
from .scheme import Meta, check_type, Technology, Molecule, Species

log = logging.getLogger("rich")
log.setLevel("INFO")
config = get_config()

if config is None:
    raise FileNotFoundError("Failed to load .env file")


def copy2remote(source, remote, ssh_config=None) -> Popen:
    """Copy files from local to a remote place using scp

    >>> copy2remote('a.txt', '/path/to/dest', 'net@10.1.1.110')

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


def get_data_uuid(doi, tissue, cell_count) -> str:
    hash_seed = doi + tissue + str(cell_count)
    h = hashlib.blake2s(digest_size=16)
    h.update(hash_seed.encode())
    return h.hexdigest()


def read_meta(meta_file):
    meta = Meta(**json.load(open(meta_file, 'r')))

    meta._replace(technology=check_type(meta.technology, Technology))
    meta._replace(molecule=check_type(meta.molecule, Molecule))
    meta._replace(species=check_type(meta.species, Species))
    assert isinstance(meta.is_single_cell, bool)
    assert isinstance(meta.has_cell_type, bool)

    return meta


def create_roi_id(roi_info):
    log.info(f"ROI INFO has columns: {roi_info.columns.tolist()}")
    roi_group = roi_info.groupby(roi_info.columns.tolist(), sort=False)
    roi_count = 0
    roi_id_list = []
    for _, df in roi_group:
        roi_count += 1
        id_ = str(uuid4())
        roi_id_list += [id_ for _ in range(len(df))]
    return roi_id_list, roi_count


def group_roi_info(roi_info, data_uuid):
    # group roi_info
    roi_info_db = []
    for roi_id, df in roi_info.groupby('roi_id', sort=False, group_keys=False):
        roi_info_db.append([
            roi_id, data_uuid, json.dumps(df.to_dict("records")[0])
        ])
    roi_info_db = pd.DataFrame(roi_info_db, columns=['roi_id', 'data_uuid', 'meta'])
    return roi_info_db


def group_cell_info(cell_info, data_uuid, meta):
    cell_info_db = []
    for roi_id, roi_cells in cell_info.groupby('roi_id', sort=False, group_keys=False):
        cell_type = roi_cells['cell_type'].tolist() if meta.has_cell_type else []
        cell_info_db.append([
            roi_id, data_uuid, roi_cells['cell_x'].tolist(),
            roi_cells['cell_y'].tolist(), cell_type
        ])
    cell_info_db = pd.DataFrame(cell_info_db, columns=['roi_id', 'data_uuid', 'cell_x', 'cell_y', 'cell_type'])
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


def create_record(
        entry,
):
    """Create a record in database on remote and copy static to remote

    There should be three files

    - `roi_info.txt`: Record the roi information, an ROI_ID column will be auto-generated
    - `cell_info.txt`: Contains [cell_x, cell_y, cell_type]
    - `cell_exp.txt`: Headers are markers

    The row number of three files should match

    """
    # path for each file
    entry = Path(entry)
    meta_file = entry / 'meta.json'
    roi_info_file = entry / 'roi_info.tsv.gz'
    cell_info_file = entry / 'cell_info.tsv.gz'
    cell_exp_file = entry / 'cell_exp.tsv.gz'

    # load meta and check each field
    meta = read_meta(meta_file)

    # load spatial info
    roi_info = pd.read_csv(roi_info_file, sep="\t", compression="gzip")
    cell_info = pd.read_csv(cell_info_file, sep="\t", compression="gzip")
    cell_exp = pd.read_csv(cell_exp_file, sep="\t", compression="gzip")

    doi_info = get_doi_info(meta.doi)
    cell_count = len(cell_info)
    markers = cell_exp.columns
    marker_count = cell_exp.shape[1]
    data_uuid = get_data_uuid(doi_info.doi, meta.tissue, cell_count)
    # process ROI
    roi_id_list, roi_count = create_roi_id(roi_info)

    # add extra information to table
    # to satisfy sql scheme
    roi_info['data_uuid'] = data_uuid
    cell_info['data_uuid'] = data_uuid
    cell_exp['data_uuid'] = data_uuid

    roi_info['roi_id'] = roi_id_list
    cell_info['roi_id'] = roi_id_list
    cell_exp['roi_id'] = roi_id_list

    roi_info_db = group_roi_info(roi_info, data_uuid)
    cell_info_db = group_cell_info(cell_info, data_uuid, meta)
    cell_exp_db = group_cell_exp(cell_exp, data_uuid, markers)

    record = pd.DataFrame(dict(
        data_uuid=data_uuid,
        technology=meta.technology,
        species=meta.species,
        tissue=meta.tissue,
        disease=meta.disease,
        molecule=meta.molecule,
        markers=[markers.tolist()],
        source_name=doi_info.source_name,
        source_url=doi_info.source_url,
        journal=doi_info.journal,
        year=doi_info.year,
        cell_count=cell_count,
        marker_count=marker_count,
        roi_count=roi_count,
        is_single_cell=meta.is_single_cell,
        has_cell_type=meta.has_cell_type,
        extra_info="",
    ))
    # print(record)
    # print(roi_info_db)
    # print(cell_exp_db)
    # print(cell_info_db)
    df2sql(record, DataRecord)
    df2sql(roi_info_db, ROIInfo)
    df2sql(cell_exp_db, CellExp)
    df2sql(cell_info_db, CellInfo)
    log.info("Successfully dump to database")

    copy2remote(entry/'all.zip', f"{config['REMOTE_DIR']}/{data_uuid}.zip")
