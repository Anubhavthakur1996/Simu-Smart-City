from mesa import Agent, Model
from mesa.space import MultiGrid
from mesa.datacollection import DataCollector
import random

# Vehicle agent
class VehicleAgent(Agent):
  def __init__(self, unique_id, model, policy=None):
    # I am keeping it here just in case mesa updates the 
    # Agent class in the future and adds a need for it again.
    super().__init__(model)
    
    # unique_id is a unique identifier for the agent,
    # and model is a reference to the overall model instance.
    self.unique_id = unique_id 
    self.model = model
    self.policy = policy  # Placeholder for future policy implementation

    # pollution units per step
    self.emissions = {
    "PM2.5": random.uniform(0.005, 0.02),
    "CO": random.uniform(1, 10),
    "NOx": random.uniform(0.2, 0.6),
    "SO2": random.uniform(0.01, 0.05),
    "CO2": random.uniform(120, 180)
  }


  def step(self):
    # Move randomly
    possible_steps = self.model.grid.get_neighborhood(
      self.pos,
      # moore=True → Uses a Moore neighborhood,
      # meaning the agent can move to any of
      # the 8 surrounding cells (diagonal + orthogonal).
      # If moore=False, it would be a Von Neumann neighborhood
      # (only 4 orthogonal directions: up, down, left, right).
      moore=True,
      # include_center=False → Excludes the agent’s current cell
      # from the list of possible moves.
      # If it were True, the agent could “move” to its current position
      # (i.e., stay put). Setting it to False forces actual movement.
      include_center=False
    )
    new_position = random.choice(possible_steps)
    self.model.grid.move_agent(self, new_position)

    # Emit pollution into environment
    for pollutant, value in self.emissions.items():
      self.model.pollution_levels[pollutant] += value


# Model (Like a video game engine)
class PollutionModel(Model):
  def __init__(self, N, width, height, baseline_pollution=None, policy=None):
    super().__init__() # <-- this initializes self.agents and other base attributes

    self.num_agents = N   # N = number of agents (cars)
    self.grid = MultiGrid(width, height, True)  # true → toroidal grid (edges wrap around) like a donut(goes infinite)
    self.policy= policy  # Placeholder for future policy implementation

    # Setting up data collector to track pollution levels
    self.datacollector = DataCollector( 
      model_reporters= { 
        "PM2.5": lambda m: m.pollution_levels["PM2.5"],
        "CO": lambda m: m.pollution_levels["CO"],
        "NOx": lambda m: m.pollution_levels["NOx"],
        "SO2": lambda m: m.pollution_levels["SO2"],
        "CO2": lambda m: m.pollution_levels["CO2"]
      } 
    )

    # Setting baseline pollution levels (can be passed as argument or default)
    if baseline_pollution is None: 
      baseline_pollution = { 
        "PM2.5": 100,
        "CO": 200,
        "NOx": 50,
        "SO2": 20,
        "CO2": 1000 
      }

    self.pollution_levels = baseline_pollution.copy()

    # Track multiple pollutants 
    self.pollution_levels = { 
      "PM2.5": baseline_pollution.get("PM2.5", 100),
      "CO": baseline_pollution.get("CO", 200),
      "NOx": baseline_pollution.get("NOx", 50),
      "SO2": baseline_pollution.get("SO2", 20),
      "CO2": baseline_pollution.get("CO2", 1000)
    }
    
    # Instantiating agents (number of cars)
    for i in range(self.num_agents):
      a = VehicleAgent(i, self, policy=self.policy)
      self.agents.add(a)
      x = self.random.randrange(self.grid.width)
      y = self.random.randrange(self.grid.height)
      self.grid.place_agent(a, (x, y))

  def step(self):
    # Shuffle and activate all agents 
    self.agents.shuffle_do("step")
    # Here we can log pollution_level each step
    # Log pollution levels 
    self.datacollector.collect(self)

# RUnning our model
if __name__ == "__main__":
  model = PollutionModel(N=10, width=10, height=10)
  for i in range(5):
    model.step()
  
  # After collecting data, we can print or analyze it
  results = model.datacollector.get_model_vars_dataframe()
  print(results.head())
