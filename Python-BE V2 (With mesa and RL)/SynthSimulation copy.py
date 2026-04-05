import os
import numpy as np

from mesa import Agent, Model
from mesa.space import MultiGrid
from mesa.datacollection import DataCollector
import random
import pandas as pd

# My custom helper function for baseline emissions
from .util.EmiPerStep import EmissionPerStep
from .util.EmiToUnits import convert_emission_to_unit, UNIT_SCHEMA, reporter_with_units

current_dir = os.path.dirname(os.path.abspath(__file__))

synthetic_data = pd.read_csv(os.path.join(current_dir, "./data/synthetic_aqi.csv"))

# only numeric columns contribute to the baseline
# numeric = synthetic_data.select_dtypes(include=[np.number])
# baseline_pollution = numeric.mean().to_dict()
baseline_pollution = synthetic_data[synthetic_data['parameter']
                                  .isin(['nox', 'co', 'pm10', 'pm25', 'so2'])].groupby('parameter')['value'].mean().to_dict()

# Vehicle agent with hierarchichal Q-tables
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

    # pollution units per step (petrol car)
    self.emissions = EmissionPerStep()

    # distance per step in km (configurable)
    self.distance_per_step_km = 1.0

    # Agent Objectives
    self.objectives = ["mobility", "emission", "congestion"]
    
    # # Objective Selection
    # self.high_Q = np.zeros((100, len(self.objectives)))  # adjust state size
    
    # # Action Selection per Objective
    # self.low_Q = {obj: np.zeros((100, 3)) for obj in self.objectives}  # 3 actions: move, reroute, stop

    # Objectives and actions but dynamically
    # 3 is bucket size for pollution(low, med, high), 2 is congestion flag,
    #  and grid size is width*height for position
    num_states = (3 * 2) * (self.model.grid.width * self.model.grid.height)
    self.high_Q = np.zeros((num_states, len(self.objectives)))
    self.low_Q = {obj: np.zeros((num_states, 3)) for obj in self.objectives}

    # Hyperparameters
    self.epsilon, self.alpha, self.gamma = 0.1, 0.5, 0.9

  def select_action(self, state_idx):
    # choosing objective
    obj_idx = np.argmax(self.high_Q[state_idx]) if random.random() > self.epsilon else random.randrange(len(self.objectives))
    obj = self.objectives[obj_idx]

    # choosing action
    action_idx = np.argmax(self.low_Q[obj][state_idx]) if random.random() > self.epsilon else random.randrange(3)
    return obj_idx, obj, action_idx

  def update(self, state_idx, obj_idx, action_idx, reward, next_state_idx):
    obj = self.objectives[obj_idx]
    self.high_Q[state_idx, obj_idx] += self.alpha * (reward + self.gamma * np.max(self.high_Q[next_state_idx]) - self.high_Q[state_idx, obj_idx])
    self.low_Q[obj][state_idx, action_idx] += self.alpha * (reward + self.gamma * np.max(self.low_Q[obj][next_state_idx]) - self.low_Q[obj][state_idx, action_idx])


  # Old Step function (before hierarchical Q-learning):
  # def step(self):
  #   # Move randomly
  #   possible_steps = self.model.grid.get_neighborhood(
  #     self.pos,
  #     # moore=True → Uses a Moore neighborhood,
  #     # meaning the agent can move to any of
  #     # the 8 surrounding cells (diagonal + orthogonal).
  #     # If moore=False, it would be a Von Neumann neighborhood
  #     # (only 4 orthogonal directions: up, down, left, right).
  #     moore=True,
  #     # include_center=False → Excludes the agent’s current cell
  #     # from the list of possible moves.
  #     # If it were True, the agent could “move” to its current position
  #     # (i.e., stay put). Setting it to False forces actual movement.
  #     include_center=False
  #   )
  #   new_position = random.choice(possible_steps)

  #   # Apply policies 
  #   adjusted_emissions, behavior = self.model.policy_engine.apply(self, self.emissions) 
    
  #   if behavior == "reroute": 
  #     return # agent skips move this step
    
  #   self.model.grid.move_agent(self, new_position)

  #   # Emit pollution into environment
  #   for pollutant, value in adjusted_emissions.items():
  #     self.model.pollution_levels[pollutant] += value

  def step(self):
    state_idx = self.model.encode_state(self)
    obj_idx, obj, action_idx = self.select_action(state_idx)

    # Execute action
    if action_idx == 0:  # move
      possible_steps = self.model.grid.get_neighborhood(self.pos, moore=True, include_center=False)
      new_position = random.choice(possible_steps)
      self.model.grid.move_agent(self, new_position)
    elif action_idx == 1:  # reroute
      return
    elif action_idx == 2:  # stop
      return

    # Apply policies and emit pollution
    scaled_emissions = {
      pollutant: value * self.distance_per_step_km    # binding emissions per km (here 1step = 1km)
      for pollutant, value in self.emissions.items()
    }

    # Convert to concentration increments (µg/m³)
    increments = {}
    for pollutant, mass_g in scaled_emissions.items():
      mass_ug = mass_g * 1e6  # g → µg
      delta_conc = mass_ug / self.model.cell_volume_m3
      increments[pollutant] = convert_emission_to_unit(pollutant, delta_conc)
    
    # Apply policies
    adjusted_emissions, behavior = self.model.policy_engine.apply(self, increments)

    # Update pollution levels (µg/m³)
    for pollutant, delta_conc in adjusted_emissions.items():
      if pollutant in self.model.pollution_levels:
        self.model.pollution_levels[pollutant] += delta_conc


    # Reward vector
    reward_vector = {
      "mobility": 1 if action_idx == 0 else 0,
      "emission": -sum(adjusted_emissions.values()),
      "congestion": -1 if self.pos in self.model.taxed_zones else 0
    }

    # Update Q-tables
    next_state_idx = self.model.encode_state(self)
    reward = reward_vector[obj]

    # Logging actions, objectives and rewards of agents for analysis
    self.last_action = ["move", "reroute", "stop"][action_idx]
    self.last_objective = obj
    self.last_reward = reward

    self.update(state_idx, obj_idx, action_idx, reward, next_state_idx)



# Model (Like a video game engine)
class PollutionModel(Model):
  def __init__(self, N, width, height, baseline_pollution=None, policy_engine=None, 
               distance_per_step_km=1.0, cell_length_m=1000.0, mixing_height_m=100.0):
    super().__init__() # this initializes self.agents and other base attributes

    self.num_agents = N   # N = number of agents (cars)
    self.grid = MultiGrid(width, height, True)  # true → toroidal grid (edges wrap around) like a donut(goes infinite)
    self.policy_engine= policy_engine or PolicyEngine([])  # Placeholder for future policy implementation

    self.distance_per_step_km = distance_per_step_km
    self.cell_length_m = cell_length_m
    self.mixing_height_m = mixing_height_m
    self.cell_volume_m3 = (self.cell_length_m ** 2) * self.mixing_height_m

    # Calculated cell volume
    print(f"Cell volume = {self.cell_volume_m3:.2e} m³")

    # Example taxed zones (needed for congestion_tax) 
    self.taxed_zones = [(2, 2), (3, 3)]

    # In PollutionModel.__init__:
    pollutant_reporters = {
      f"{pollutant}_{UNIT_SCHEMA[pollutant]}": reporter_with_units(pollutant)
      for pollutant in UNIT_SCHEMA
    }

    self.datacollector = DataCollector(
      model_reporters=pollutant_reporters | {
        # Behavioral metrics
        "mobility_focus": lambda m: sum(1 for a in m.agents if getattr(a, "last_objective", None) == "mobility"),
        "emission_focus": lambda m: sum(1 for a in m.agents if getattr(a, "last_objective", None) == "emission"),
        "congestion_focus": lambda m: sum(1 for a in m.agents if getattr(a, "last_objective", None) == "congestion"),
        "avg_reward": lambda m: np.mean([getattr(a, "last_reward", 0) for a in m.agents]),
        "moves": lambda m: sum(1 for a in m.agents if getattr(a, "last_action", None) == "move"),
        "reroutes": lambda m: sum(1 for a in m.agents if getattr(a, "last_action", None) == "reroute"),
        "stops": lambda m: sum(1 for a in m.agents if getattr(a, "last_action", None) == "stop"),
      },
      agent_reporters={
        "action": lambda a: getattr(a, "last_action", None),
        "objective": lambda a: getattr(a, "last_objective", None),
        "reward": lambda a: getattr(a, "last_reward", 0),
        "position": lambda a: a.pos,
      }
    )

    # Track multiple pollutants 
    self.pollution_levels = baseline_pollution.copy()

    # Instantiating agents (number of cars)
    for i in range(self.num_agents):
      a = VehicleAgent(i, self)
      self.agents.add(a)
      x = self.random.randrange(self.grid.width)
      y = self.random.randrange(self.grid.height)
      self.grid.place_agent(a, (x, y))

  def encode_state(self, agent):
    # Example - bucket pollution into 3 levels (low/med/high)
    pollution_bucket = 0
    if self.pollution_levels["pm25"] < 50:
      pollution_bucket = 0
    elif self.pollution_levels["pm25"] < 100:
      pollution_bucket = 1
    else:
      pollution_bucket = 2

    # Congestion is 1 if agent is in taxed zone, else 0
    congestion_flag = 1 if agent.pos in self.taxed_zones else 0

    # Position bucket - flatten grid coordinates into a single index
    pos_index = agent.pos[0] * self.grid.height + agent.pos[1]

    # Combine into a single state index
    # Example formula - (pollution_bucket * 2 + congestion_flag) * (grid_size) + pos_index
    state_idx = (pollution_bucket * 2 + congestion_flag) * (self.grid.width * self.grid.height) + pos_index
    return state_idx


  def step(self):
    # Shuffle and activate all agents 
    self.agents.shuffle_do("step")
    # Here we can log pollution_level each step
    # Log pollution levels 
    self.datacollector.collect(self)

# Adding policy engine
class PolicyEngine:
  def __init__(self, active_policies=None, policies=None):
    # active_policies is a list like ["EV", "low_sulfur", "congestion_tax"]
    self.active_policies = active_policies or []

    # Using Dynamic rules(created from the front end)
    self.rules = policies

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



# # RUnning our model
# if __name__ == "__main__":
#   # With baseline pollution levels from synthetic data
#   model = PollutionModel(N=10, width=10, height=10, baseline_pollution=baseline_pollution)
#   modelPol = PollutionModel(N=10, width=10, height=10, baseline_pollution=baseline_pollution, policy_engine=PolicyEngine(["low_sulfur", "congestion_tax"]))
#   for i in range(5):
#     model.step()
#     modelPol.step()
  
#   # After collecting data, we can print or analyze it
#   results = model.datacollector.get_model_vars_dataframe()
#   resultsPol = modelPol.datacollector.get_model_vars_dataframe()

#   agent_results = model.datacollector.get_agent_vars_dataframe()
#   agent_resultsPol = modelPol.datacollector.get_agent_vars_dataframe()

#   print("Results without policy (Model-level)")
#   # print(results.head())
#   print(results)

#   print("\n Results with policies (Model-level)")
#   # print(resultsPol.head())
#   print(resultsPol)

#   print("\n Agent-level results without policy")
#   # print(agent_results.head())
#   print(agent_results)

#   print("\n Agent-level results with policies")
#   # print(agent_resultsPol.head())
#   print(agent_resultsPol)

def runSimulation(emissionsData=None, cycles=None, numAgents=None, policies=None, activePolicies=None):
  # With baseline pollution levels from synthetic data
  model = PollutionModel(N=numAgents or 10, width=15, height=40, baseline_pollution=baseline_pollution)
  modelPol = PollutionModel(N=numAgents or 10, width=15, height=40, baseline_pollution=baseline_pollution, policy_engine=PolicyEngine(active_policies=activePolicies, policies=policies))
  
  # Steps or cycles for which the simulation needs to be run
  for _ in range(cycles or 5):
    model.step()
    modelPol.step()
  
  # Collectings results
  results = model.datacollector.get_model_vars_dataframe()
  resultsPol = modelPol.datacollector.get_model_vars_dataframe()

  agent_results = model.datacollector.get_agent_vars_dataframe()
  agent_resultsPol = modelPol.datacollector.get_agent_vars_dataframe()

  print("Results without policy (Model-level)")
  # print(results.head())
  print(results)

  print("\n Results with policies (Model-level)")
  # print(resultsPol.head())
  print(resultsPol)

  print("\n Agent-level results without policy")
  # print(agent_results.head())
  print(agent_results)

  print("\n Agent-level results with policies")
  # print(agent_resultsPol.head())
  print(agent_resultsPol)
  
  
  # Reset index to expose Step/AgentID
  results = results.reset_index().rename(columns={"index": "Step"})
  resultsPol = resultsPol.reset_index().rename(columns={"index": "Step"})
  agent_results = agent_results.reset_index().rename(columns={"index": "Step"})
  agent_resultsPol = agent_resultsPol.reset_index().rename(columns={"index": "Step"})

  return {
    "regularResults": results.to_dict(orient="records"),
    "resultsWithPolicies": resultsPol.to_dict(orient="records"),
    "agentsResults": agent_results.to_dict(orient="records"),
    "agentResultsWithPolicies": agent_resultsPol.to_dict(orient="records")
  }


