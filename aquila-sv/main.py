from typing import List

import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from svgene import run_spatialde, run_sepal

app = FastAPI()


@app.get("/")
async def index():
    return "The aquila FastAPI server is running"


class SVParams(BaseModel):
    method: str
    exp: List[float]
    x: List[float]
    y: List[float]


class SVResult(BaseModel):
    isSV: bool


@app.post("/svgene")
async def run_svgene(params: SVParams):
    exp = np.array(params.exp)
    coord = np.array([[a, b] for a, b in (params.x, params.y)])
    if params.method == 'spatialde':
        status = run_spatialde(exp=exp, coord=coord)
    # elif params.method == 'somde':
    #     status = run_somde(exp=exp, coord=coord)
    elif params.method == 'sepal':
        status = run_sepal()
    else:
        return HTTPException(status_code=400, detail="Unrecognized method")

    return SVResult(isSV=status)
