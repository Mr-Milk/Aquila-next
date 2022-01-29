import logging
from typing import List, Union

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from svgene import run_spatialde, run_sepal

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


@app.get("/")
async def index():
    return "The aquila FastAPI server is running"


class SVParams(BaseModel):
    method: str
    exp: List[float] = []
    x: List[float] = []
    y: List[float] = []


class SVResult(BaseModel):
    isSV: bool


@app.post("/svgene")
async def run_svgene(params: SVParams):
    exp = np.array(params.exp)
    coord = np.array([[a, b] for (a, b) in zip(params.x, params.y)])
    if params.method == 'spatialde':
        status = run_spatialde(exp=exp, coord=coord)
    # elif params.method == 'somde':
    #     status = run_somde(exp=exp, coord=coord)
    elif params.method == 'sepal':
        status = run_sepal()
    else:
        return HTTPException(status_code=400, detail="Unrecognized method")

    return SVResult(isSV=status)
