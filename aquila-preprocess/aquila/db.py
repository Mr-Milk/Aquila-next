from sqlalchemy import Column, Boolean, Float, Integer, String, create_engine, text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.declarative import declarative_base

from .query import get_config

PGBase = declarative_base()


class DataRecord(PGBase):
    __tablename__ = "data_records"

    data_uuid = Column(String, primary_key=True)

    technology = Column(String)
    species = Column(String)
    organ = Column(String)
    tissue = Column(String)
    disease = Column(String)
    disease_details = Column(String)
    molecule = Column(String)
    markers = Column(ARRAY(String))

    source_name = Column(String)
    source_url = Column(String)  # normally is doi
    journal = Column(String)
    year = Column(String)

    cell_count = Column(Integer)
    marker_count = Column(Integer)
    roi_count = Column(Integer)
    is_single_cell = Column(Boolean)
    has_cell_type = Column(Boolean)
    is_3d = Column(Boolean)

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


class CellInfo3D(PGBase):
    __tablename__ = "cell_info_3d"

    roi_id = Column(String, primary_key=True)
    data_uuid = Column(String, index=True)
    cell_x = Column(ARRAY(Float))
    cell_y = Column(ARRAY(Float))
    cell_z = Column(ARRAY(Float))
    cell_type = Column(ARRAY(String))


def check_uuid(data_uuid):
    config = get_config()
    engine = create_engine(config['ENGINE'])
    with engine.connect() as conn:
        result = conn.execute(text(f"""select data_uuid from data_records where data_uuid='{data_uuid}';"""))
        if result.first() is None:
            return True
        return False


def get_records(data_uuid):
    config = get_config()
    engine = create_engine(config['ENGINE'])
    with engine.connect() as conn:
        result = conn.execute(text(f"""select * from data_records where data_uuid='{data_uuid}';"""))
        return result.first()


def init_db(engine=None):
    config = get_config()
    engine = create_engine(config['ENGINE'])
    PGBase.metadata.create_all(engine)


def clean_db(engine=None):
    config = get_config()
    engine = create_engine(config['ENGINE'])
    PGBase.metadata.drop_all(engine)


def delete_data(data_uuid):
    config = get_config()
    engine = create_engine(config['ENGINE'])
    with engine.connect() as conn:
        conn.execute(text(f"""DELETE FROM data_records WHERE data_uuid='{data_uuid}'"""))
        conn.execute(text(f"""DELETE FROM roi_info WHERE data_uuid='{data_uuid}'"""))
        conn.execute(text(f"""DELETE FROM cell_info WHERE data_uuid='{data_uuid}'"""))
        conn.execute(text(f"""DELETE FROM cell_exp WHERE data_uuid='{data_uuid}'"""))
        conn.execute(text(f"""DELETE FROM roi_info_3d WHERE data_uuid='{data_uuid}'"""))
        conn.execute(text(f"""DELETE FROM cell_info_3d WHERE data_uuid='{data_uuid}'"""))
        conn.execute(text(f"""DELETE FROM cell_exp_3d WHERE data_uuid='{data_uuid}'"""))
