import logging
import shutil
import zipfile
from uuid import uuid4
from functools import lru_cache
from typing import List

from pathlib import Path

import numpy as np
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.background import BackgroundTask
from starlette.responses import FileResponse

from config import Settings

from aquila_spatial import run_spatialde, run_sepal, run_ripley, run_community, run_centrality

log = logging.getLogger("uvicorn.info")

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://aquila.cheunglab.org",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@lru_cache()
def get_settings():
    return Settings()


@app.get("/")
async def index():
    return "The aquila FastAPI server is running"


class RequestFiles(BaseModel):
    files: List[str]


def delete_temp(temp_dir):
    if Path(temp_dir).exists():
        shutil.rmtree(temp_dir)


@app.get("/download")
async def zip_multiple_files(
        files: str,
        settings: Settings = Depends(get_settings)
):
    temp_dir = Path(f"/{uuid4().hex}")
    temp_dir.mkdir(exist_ok=True)
    log.info(f"Creating temp folder at {temp_dir}")
    temp_zip = temp_dir / "Aquila-download.zip"

    static_dir = Path(settings.static_dir)
    with zipfile.ZipFile(temp_zip, 'w') as fp:
        for request_zip in files.split(","):
            fp.write(static_dir / f"{request_zip}.zip", arcname=f"{request_zip}.zip")

    delete_after = BackgroundTask(delete_temp, temp_dir)

    return FileResponse(path=temp_zip, filename="Aquila-download.zip", background=delete_after)


class ExpVec(BaseModel):
    marker: str
    exp: List[float]


class SVParams(BaseModel):
    method: str
    pval: float
    exp_matrix: List[ExpVec]
    x: List[float]
    y: List[float]


class SVResult(BaseModel):
    marker: str
    status: bool


@app.post("/svgene")
async def run_svgene(params: SVParams):
    exp_matrix = []
    markers = []
    for exp_vec in params.exp_matrix:
        exp_matrix.append(exp_vec.exp)
        markers.append(exp_vec.marker)
    exp = np.array(exp_matrix).T
    coord = np.array([[a, b] for (a, b) in zip(params.x, params.y)])
    if params.method == 'spatialde':
        status = run_spatialde(exp=exp, coord=coord, pval=params.pval)
    # elif params.method == 'somde':
    #     status = run_somde(exp=exp, coord=coord)
    elif params.method == 'sepal':
        status = run_sepal()
    else:
        return HTTPException(status_code=400, detail="Unrecognized method")

    return [SVResult(status=s, marker=m) for (s, m) in zip(status, markers)]


class RipleyParams(BaseModel):
    method: str  # K, F, G, L
    support: int
    x: List[float]
    y: List[float]
    types: List[str]


class RipleyResult(BaseModel):
    type: str
    distance: List[float]
    value: List[float]


@app.post("/ripley")
async def ripley(params: RipleyParams):
    response = run_ripley(params.x, params.y, params.types, support=params.support, mode=params.method)
    return response


class CommunityParams(BaseModel):
    method: str  # leiden, louvain, infomap
    trials: int  # infomap
    resolution: float  # leiden
    e1: List[int] = []
    e2: List[int] = []
    weights: List[float] = []


@app.post("/community")
async def community(params: CommunityParams):
    response = run_community(params.e1, params.e2,
                             params.weights,
                             trials=params.trials,
                             resolution=params.resolution,
                             method=params.method
                             )
    return response


class CentralityParams(BaseModel):
    e1: List[int]
    e2: List[int]
    types: List[str]
    method: str  # closeness, betweenness, degree


@app.post("/centrality")
async def centrality(params: CentralityParams):
    response = run_centrality(
        params.e1,
        params.e2,
        params.types,
        measure=params.method
    )
    return response
