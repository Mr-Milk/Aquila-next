from dataclasses import dataclass
from enum import Enum

import anndata as ad
from thefuzz import process

from .query import get_doi_info


class Technology(Enum):
    # Cytometry based
    IMC = "IMC"
    MIBI = "MIBI"
    # IF based
    CODEX: str = "CODEX"
    CyCIF: str = "CyCIF"
    # Microscopy based
    MERFISH: str = "MERFISH"
    osmFISH: str = "osmFISH"
    seqFISH: str = "seqFISH"
    STARmap: str = "STARmap"
    # Single-cell seq
    # Non single-cell seq
    Visium: str = "Visium"
    ApexSeq: str = "APEX-seq"
    BaristaSeq: str = "Barista-seq"
    DbitSeq: str = "DBiT-seq"
    ExSeq: str = "ExSeq"
    PciSeq: str = "pciSeq"
    HDST: str = "HDST"
    SciSpace: str = "sci-Space"
    seqScope: str = "seq-scope"
    SlideSeq: str = "Slide-seq"
    StereoSeq: str = "Stereo-seq"
    XYZeq: str = "XYZeq"
    ISS: str = "ISS"


class Molecule(Enum):
    RNA: str = "RNA"
    DNA: str = "DNA"
    Protein: str = "Protein"


class Species(Enum):
    Human: str = "Human"
    Mouse: str = "Mouse"
    HM: str = "Human+Mouse"
    Chicken: str = "Chicken"
    Pig: str = "Pig"


class Organ(Enum):
    Appendix: str = "Appendix"
    Brain: str = "Brain"
    Bone: str = "Bone"
    BonesMarrow: str = "Bones Marrow"
    Breast: str = "Breast"
    Bladder: str = "Bladder"
    Intestine: str = "Intestine"
    Colon: str = "Colon"
    Cerebellum: str = "Cerebellum"
    Eye: str = "Eye"
    Heart: str = "Heart"
    Hypothalamus: str = "Hypothalamus"
    Kidney: str = "Kidney"
    Liver: str = "Liver"
    Lung: str = "Lung"
    LymphNode: str = "Lymph Node"
    Ovary: str = "Ovary"
    Organoid: str = "Organoid"
    Pancreas: str = "Pancreas"
    Prostate: str = "Prostate"
    Rectum: str = "Rectum"
    Skin: str = "Skin"
    SpinalCord: str = "Spinal Cord"
    Spleen: str = "Spleen"
    Stomach: str = "Stomach"
    Tonsil: str = "Tonsil"
    Thyroid: str = "Thyroid"
    Uterus: str = "Uterus"
    Embryo: str = "Embryo"
    Mixed: str = "Mixed"
    Muscle: str = "Muscle"
    Joint: str = "Joint"


def check_type(raw: str, target):
    raw_p = raw.lower()
    choices = []
    for t in target:
        v = t.value
        choices.append(v)
        if raw_p == v.lower():
            return v
    else:
        replace = process.extractOne(raw_p, choices)
        raise ValueError(f"Input field {raw} not found in {target}, do you mean {replace[0]}")


@dataclass
class Meta:
    technology: str
    species: str
    organ: str
    molecule: str
    doi: str
    is_single_cell: bool
    has_cell_type: bool
    is_3d: bool

    # optional
    tissue: str = ""
    disease: str = ""
    disease_details: str = ""
    # add by crossref query
    source_name: str = ""
    source_url: str = ""
    year: str = ""
    journal: str = ""


def _default_false(meta, key):
    if meta.get(key) is None:
        meta[key] = False
    assert isinstance(meta[key], bool)


tech_molecule_mapper = {
# Cytometry based
    "IMC": "Protein",
    "MIBI": "Protein",
    "CODEX": "Protein",
    "CyCIF": "Protein",
    # Microscopy based
    "MERFISH": "RNA",
    "osmFISH": "RNA",
    "seqFISH": "RNA",
    "STARmap": "RNA",
    # Single-cell seq
    # Non single-cell seq
    "Visium": "RNA",
    "APEX-seq": "RNA",
    "Barista-seq": "RNA",
    "DBiT-seq": "RNA",
    "ExSeq": "RNA",
    "HDST": "RNA",
    "sci-Space": "RNA",
    "seq-scope": "RNA",
    "Slide-seq": "RNA",
    "Stereo-seq": "RNA",
    "XYZeq": "RNA",
    "pciSeq": "RNA",
}


def full_meta(meta):
    meta = meta.copy()
    meta["organ"] = check_type(meta["organ"], Organ)
    meta["technology"] = check_type(meta["technology"], Technology)
    meta["molecule"] = check_type(meta["molecule"], Molecule)
    meta["species"] = check_type(meta["species"], Species)

    assert tech_molecule_mapper[meta["technology"]] == meta["molecule"]

    _default_false(meta, "is_single_cell")
    _default_false(meta, "has_cell_type")
    _default_false(meta, "is_3d")

    if meta.get("tissue") is None:
        meta["tissue"] = meta["organ"]
    if meta.get("disease") is None:
        meta["disease"] = "Normal"
    if meta.get("disease_details") is None:
        meta["disease_details"] = ""

    if meta.get("doi") is None:
        not_doi = []
        for i in ["source_name", "source_url", "journal", "year"]:
            if i not in meta.keys():
                not_doi.append(i)
        raise ValueError(f"No DOI is provided, please manually filled fields: {', '.join(not_doi)}")
    doi_info = get_doi_info(meta['doi'])
    meta["source_name"] = doi_info.source_name
    meta["source_url"] = doi_info.source_url
    meta["journal"] = doi_info.journal
    meta["year"] = str(doi_info.year)
    print(f"Dataset from {doi_info.year} {doi_info.journal} {doi_info.source_name}")

    return meta


def check_meta(data: ad.AnnData):
    KEYS = ['technology', 'species', 'tissue', 'organ',
            'molecule', 'disease', 'doi',
            'source_name', 'source_url', 'journal', 'year',
            'has_cell_type', 'is_single_cell', 'is_3d']
    meta = data.uns['meta']
    not_meta = []
    for f in KEYS:
        if f not in meta.keys():
            not_meta.append(f)

    if len(not_meta) > 0:
        raise ValueError(f"{' '.join(not_meta)} not in `meta`")


def check_adata(data: ad.AnnData):
    OBS_FIELDs = ['cell_x', 'cell_y']
    VAR_FIELDs = ['markers']
    UNS_FIELDs = ['meta', 'roi_cols']

    for f in UNS_FIELDs:
        if f not in data.uns.keys():
            raise ValueError(f"{f} not in `data.uns`")

    # check meta
    check_meta(data)
    meta = data.uns['meta']
    if meta['has_cell_type']:
        OBS_FIELDs.append('cell_type')
    if meta['is_3d']:
        OBS_FIELDs.append('cell_z')

    # check field
    obs_keys = data.obs_keys()
    not_obs = []
    for f in OBS_FIELDs:
        if f not in obs_keys:
            not_obs.append(f)
    if len(not_obs) > 0:
        raise ValueError(f"{', '.join(not_obs)} not in `data.obs`")

    if data.obs.isnull().values.any():
        raise ValueError("NaN value in obs, please fill it")

    var_keys = data.var_keys()
    not_var = []
    for f in VAR_FIELDs:
        if f not in var_keys:
            not_var.append(f)
    if len(not_var) > 0:
        raise ValueError(f"{', '.join(not_var)} not in `data.var`")
