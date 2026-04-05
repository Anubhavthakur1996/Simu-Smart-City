import json
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

from .SynthSimulation import runSimulation
from .RealSynthData import generateSyntheticData

app = FastAPI()

class SimulationBody(BaseModel):
  emissionData: dict
  cycles: int
  agents: int
  policies: dict
  activePolicies: list
  # vehicle: str
  

@app.get("/")
def read_root():
  return {"Hello": "World"}



@app.get("/data")
def get_data():
  return JSONResponse(content={"data": json.loads(generateSyntheticData())})

@app.post("/simulate")
def simulate(simulationBody: SimulationBody):

  cycles = simulationBody.cycles
  agents = simulationBody.agents
  policies = simulationBody.policies
  emissionData = simulationBody.emissionData 
  activePolicies = simulationBody.activePolicies
  # vehicle = simulationBody.vehicle

  result = runSimulation(emissionsData=emissionData, cycles=cycles, numAgents=agents, 
                         policies=policies, activePolicies=activePolicies) 
  return {"result": result}


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: str | None = None):
#   return {"item_id": item_id, "q": q}