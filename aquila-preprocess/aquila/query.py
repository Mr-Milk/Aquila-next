from collections import namedtuple
from pathlib import Path

from crossref.restful import Etiquette, Works
from dotenv import dotenv_values

DoiInfo = namedtuple('DoiInfo', [
    'doi',
    'source_name',
    'source_url',
    'year',
    'journal',
])

info = Etiquette("aquila", contact_email="yb97643@um.edu.mo")


def get_doi_info(doi: str):
    r = Works(etiquette=info)
    result = r.doi(doi)

    if len(result["container-title"]) > 0:
        journal = result["container-title"][0]
    else:
        journal = result["publisher"]

    year = result["issued"]["date-parts"][0][0]
    if (year is None) | (year == 0):
        try:
            year = result["created"]["date-parts"][0][0]
        except:
            pass

    return DoiInfo(
        doi=result["DOI"],
        source_url=result["URL"],
        journal=journal,
        source_name=result["title"][0],
        year=int(year),
    )


def get_config():
    default_env = Path(".env")

    config = None
    if default_env.exists():
        config = dotenv_values(default_env)
    return config
