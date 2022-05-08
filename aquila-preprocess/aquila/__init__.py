import logging

from rich.logging import RichHandler

from .io import save_data, data2db, get_data_uuid
from .guards import full_meta
from .db import init_db, clean_db, delete_data, get_records
from .watcher import fire
from .reader import read_10x_batch, read_10x, read_10x_spatial

FORMAT = "%(message)s"
logging.basicConfig(handlers=[RichHandler()])
