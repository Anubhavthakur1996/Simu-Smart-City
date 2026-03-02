import os
import numpy as np

from mesa import Agent, Model
from mesa.space import MultiGrid
from mesa.datacollection import DataCollector
import random
import pandas as pd

current_dir = os.path.dirname(os.path.abspath(__file__))

synthetic_data = pd.read_csv(os.path.join(current_dir, "./data/synthetic_aqi.csv"))

# only numeric columns contribute to the baseline
# numeric = synthetic_data.select_dtypes(include=[np.number])
# baseline_pollution = numeric.mean().to_dict()
baseline_pollution = synthetic_data[synthetic_data['parameter'].isin(['no2', 'o3', 'pm10', 'pm25', 'so2', 'co', 'co2', 'nox'])].groupby('parameter')['value'].mean().to_dict()


# Vehicle agent
class VehicleAgent(Agent):
  def __init__(self, unique_id, model):
    # I am keeping it here just in case mesa updates the 
    # Agent class in the future and adds a need for it again.
    super().__init__(model)
    
    # unique_id is a unique identifier for the agent,
    # and model is a reference to the overall model instance.
    self.unique_id = unique_id 
    self.model = model
    # self.policy = policy  # Placeholder for future policy implementation

    # pollution units per step
    self.emissions = {
    "pm25": random.uniform(0.005, 0.02),    # PM2.5 is often abbreviated as PM25 for simplicity and our dataset has it like that
    "co": random.uniform(1, 10),
    "nox": random.uniform(0.2, 0.6),
    "so2": random.uniform(0.01, 0.05),
    # "co2": random.uniform(120, 180)
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

    # Apply policies 
    adjusted_emissions, behavior = self.model.policy_engine.apply(self, self.emissions) 
    
    if behavior == "reroute": 
      return # agent skips move this step
    
    self.model.grid.move_agent(self, new_position)

    # Emit pollution into environment
    for pollutant, value in adjusted_emissions.items():
      self.model.pollution_levels[pollutant] += value


# Model (Like a video game engine)
class PollutionModel(Model):
  def __init__(self, N, width, height, baseline_pollution=None, policy_engine=None):
    super().__init__() # <-- this initializes self.agents and other base attributes

    self.num_agents = N   # N = number of agents (cars)
    self.grid = MultiGrid(width, height, True)  # true → toroidal grid (edges wrap around) like a donut(goes infinite)
    self.policy_engine= policy_engine or PolicyEngine([])  # Placeholder for future policy implementation

    # Example taxed zones (needed for congestion_tax) 
    self.taxed_zones = [(2, 2), (3, 3)]

    # Setting up data collector to track pollution levels
    self.datacollector = DataCollector( 
      model_reporters= { 
        "pm25": lambda m: m.pollution_levels["pm25"],   # PM2.5 is often abbreviated as PM25 for simplicity and our dataset has it like that
        "co": lambda m: m.pollution_levels["co"],
        "nox": lambda m: m.pollution_levels["nox"],
        "so2": lambda m: m.pollution_levels["so2"],
        # "co2": lambda m: m.pollution_levels["co2"]
      } 
    )

    # Setting baseline pollution levels (can be passed as argument or default)
    if baseline_pollution is None: 
      baseline_pollution = { 
        "pm25": 100,  # PM2.5 is often abbreviated as PM25 for simplicity and our dataset has it like that
        "co": 200,
        "nox": 50,
        "so2": 20,
        # "co2": 1000 
      }

    # Track multiple pollutants 
    self.pollution_levels = baseline_pollution.copy()

   
    # Instantiating agents (number of cars)
    for i in range(self.num_agents):
      a = VehicleAgent(i, self)
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

# Adding policy engine
class PolicyEngine:
  def __init__(self, active_policies=None):
    # active_policies is a list like ["EV", "low_sulfur", "congestion_tax"]
    self.active_policies = active_policies or []

    # Define rules in one place
    self.rules = {
      "EV": {"co2": 0, "co": 0, "nox": 0, "so2": 0, "pm25": 0},   # PM2.5 is often abbreviated as PM25 for simplicity and our dataset has it like that
      "low_sulfur": {"so2": 0.2},  # multiplier
      "speed_limit": {"nox": 0.7, "co2": 1.1},  # efficiency trade-off
      "congestion_tax": {"behavior": "avoid_taxed_zones"}  # not direct emissions
    }

  def apply(self, agent, emissions):
    """Apply active policy adjustments to agent emissions."""
    adjusted = emissions.copy()

    for policy in self.active_policies:
      if policy in self.rules:
        rule = self.rules[policy]

        # Direct emission adjustments
        for pollutant, factor in rule.items():
          if pollutant in adjusted and isinstance(factor, (int, float)):
            adjusted[pollutant] *= factor

      # Behavior rules (like congestion tax)
      if "behavior" in rule and rule["behavior"] == "avoid_taxed_zones":
        if agent.pos in agent.model.taxed_zones:
          # Example: agent skips move or reroutes
          if agent.model.random.random() < 0.5:
            return adjusted, "reroute"

    return adjusted, None



# RUnning our model
if __name__ == "__main__":
  # With baseline pollution levels from synthetic data
  model = PollutionModel(N=10, width=10, height=10, baseline_pollution=baseline_pollution)
  modelPol = PollutionModel(N=10, width=10, height=10, baseline_pollution=baseline_pollution, policy_engine=PolicyEngine(["low_sulfur", "congestion_tax"]))
  for i in range(5):
    model.step()
    modelPol.step()
  
  # After collecting data, we can print or analyze it
  results = model.datacollector.get_model_vars_dataframe()
  resultsPol = modelPol.datacollector.get_model_vars_dataframe() 
  print("Results without policy:")
  print(results.head())
  print("\nResults with policies:")
  print(resultsPol.head())
