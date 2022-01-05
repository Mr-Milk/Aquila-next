from collections import namedtuple
from enum import Enum


class Technology(Enum):
    IMC = "IMC"
    MIBI = "MIBI"
    CODEX: str = "CODEX"
    CyCIF: str = "CyCIF"

    MERFISH: str = "MERFISH"
    osmFISH: str = "osmFISH"
    seqFISH: str = "seqFISH"
    Visium = "Visium"


class Molecule(Enum):
    RNA: str = "RNA"
    DNA: str = "DNA"
    Protein: str = "Protein"
    Metabolite: str = "Metabolite"


class Species(Enum):
    Human: str = "Human"
    Mouse: str = "Mouse"


def check_type(raw, target):
    raw_p = raw.lower()
    for t in target:
        v = t.value
        if raw_p == v.lower():
            return v
    else:
        raise ValueError(f"Input field {raw} not found in {target}")


Meta = namedtuple('Meta', [
    'technology',
    'species',
    'tissue',
    'molecule',
    'disease',
    'doi',
    'is_single_cell',
    'has_cell_type',
])

DataInfo = namedtuple('DataInfo', [
    'technology',
    'species',
    'tissue',
    'molecule',
    'disease',
    'is_single_cell',
    'has_cell_type',
    'doi',

    # the following field will be generated upon processing
    'data_uuid',
    'markers',
    'source_name',
    'source_url',
    'year',
    'journal',
    'cell_count',
    'marker_count',
    'roi_count',
    'notice',
])


DoiInfo = namedtuple('DoiInfo', [
    'doi',
    'source_name',
    'source_url',
    'year',
    'journal',
])
