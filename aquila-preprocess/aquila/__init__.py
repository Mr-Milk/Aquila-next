from .io import create_record
from .preprocess import anndata2static


import logging
from rich.logging import RichHandler

FORMAT = "%(message)s"
logging.basicConfig(handlers=[RichHandler()])
