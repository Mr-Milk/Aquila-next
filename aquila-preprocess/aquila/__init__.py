import logging

from rich.logging import RichHandler

from .io import save_data, data2db
from .guards import full_meta
from .db import init_db, clean_db

FORMAT = "%(message)s"
logging.basicConfig(handlers=[RichHandler()])
