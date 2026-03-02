from fastapi import FastAPI

from .Simulation import run_simulation

app = FastAPI()


@app.get("/")
def read_root():
  return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
  return {"item_id": item_id, "q": q}

@app.post("/simulate")
def simulate():
  result = run_simulation() 
  return {"Result": result}