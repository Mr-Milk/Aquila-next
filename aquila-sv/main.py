from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from svgene import run_spatialde, run_sepal, run_somde

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

    if params.method == 'spatialde':
        status = run_spatialde()
    elif params.method == 'somde':
        status = run_somde()
    elif params.method == 'sepal':
        status = run_sepal()
    else:
        return HTTPException(status_code=400, detail="Unrecognized method")

    return SVResult(isSV=status)
