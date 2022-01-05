from uuid import uuid4

from sqlalchemy import Column, Boolean, Float, Integer, String, create_engine
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.ext.declarative import declarative_base

from .query import get_config

PGBase = declarative_base()


class DataRecord(PGBase):
    __tablename__ = "data_records"

    id = Column(Integer, autoincrement=True)
    data_uuid = Column(String, primary_key=True)

    technology = Column(String)
    species = Column(String)
    tissue = Column(String)
    disease = Column(String)
    molecule = Column(String)
    markers = Column(ARRAY(String))

    source_name = Column(String)
    source_url = Column(String)
    journal = Column(String)
    year = Column(Integer)
    cell_count = Column(Integer)
    marker_count = Column(Integer)
    roi_count = Column(Integer)
    is_single_cell = Column(Boolean)
    has_cell_type = Column(Boolean)

    extra_info = Column(String)


class CellInfo(PGBase):
    __tablename__ = "cell_info"

    roi_id = Column(String, primary_key=True)
    data_uuid = Column(String, index=True)
    cell_x = Column(ARRAY(Float))
    cell_y = Column(ARRAY(Float))
    cell_type = Column(ARRAY(String))


class CellExp(PGBase):
    __tablename__ = "cell_exp"

    id = Column(Integer, primary_key=True, autoincrement=True)
    roi_id = Column(String, index=True)
    data_uuid = Column(String, index=True)
    marker = Column(String)
    expression = Column(ARRAY(Float))


class ROIInfo(PGBase):
    __tablename__ = "roi_info"

    roi_id = Column(String, primary_key=True)
    data_uuid = Column(String, index=True)
    meta = Column(String)  # JSON format string


def init_db(engine=None):
    config = get_config()
    engine = create_engine(config['ENGINE'])
    PGBase.metadata.create_all(engine)

def clean_db(engine=None):
    config = get_config()
    engine = create_engine(config['ENGINE'])
    Base.metadata.drop_all(engine)

