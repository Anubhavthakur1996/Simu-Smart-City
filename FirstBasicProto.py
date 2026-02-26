# import json
# import random

# -------------------------------
# Policy Engine
# -------------------------------
class PolicyEngine:
  def __init__(self, policy_config):
    self.policies = policy_config

  def apply_policy(self, agent, environment):
    """Modify agent/environment behavior based on policies"""
    for policy in self.policies:
      if policy["target"] == "vehicle" and agent.fuel_type == policy["fuel_type"]:
        agent.emission_factor *= policy.get("emission_multiplier", 1.0)
      if policy["target"] == "road":
        environment.road_modifiers[policy["road_id"]] = policy.get("emission_multiplier", 1.0)


# -------------------------------
# Petrol Car Agent
# -------------------------------
class PetrolCarAgent:
  def __init__(self, agent_id, fuel_type="petrol", speed=40, emission_factor=2.5):
    self.id = agent_id
    self.fuel_type = fuel_type
    self.speed = speed
    self.emission_factor = emission_factor
    self.location = 0  # road segment index

  def step(self, environment):
    """Move through environment and calculate emissions"""
    road_info = environment.get_road_info(self.location)
    emissions = self.calculate_emissions(road_info)
    environment.log_emissions(self.id, emissions)
    self.location = (self.location + 1) % len(environment.roads)  # simple loop

  def calculate_emissions(self, road_info):
    return self.speed * self.emission_factor * road_info.get("modifier", 1.0)


# -------------------------------
# Environment
# -------------------------------
class UrbanEnvironment:
  def __init__(self, roads):
    self.roads = roads  # list of road segments
    self.road_modifiers = {i: 1.0 for i in range(len(roads))}
    self.emissions_log = []

  def get_road_info(self, road_id):
    return {"modifier": self.road_modifiers.get(road_id, 1.0)}

  def log_emissions(self, agent_id, emissions):
    self.emissions_log.append({"agent": agent_id, "emissions": emissions})


# -------------------------------
# Forecasting Model
# -------------------------------
class ForecastingModel:
  def __init__(self, environment):
    self.environment = environment

  def generate_report(self):
    total_emissions = sum(entry["emissions"] for entry in self.environment.emissions_log)
    return {
      "total_emissions": total_emissions,
      "average_emissions": total_emissions / len(self.environment.emissions_log)
    }


# -------------------------------
# Example Run
# -------------------------------
if __name__ == "__main__":
  # Define simple policy config
  policy_config = [
    {"target": "vehicle", "fuel_type": "petrol", "emission_multiplier": 0.8},  # EV subsidy style
    {"target": "road", "road_id": 0, "emission_multiplier": 1.2}               # congestion toll style
  ]

  # Initialize components
  environment = UrbanEnvironment(roads=["road1", "road2", "road3"])
  agent = PetrolCarAgent(agent_id=1)
  policy_engine = PolicyEngine(policy_config)

  # Apply policies
  policy_engine.apply_policy(agent, environment)

  # Run simulation
  for t in range(10):  # 10 timesteps
    agent.step(environment)

  # Forecast results
  forecasting = ForecastingModel(environment)
  report = forecasting.generate_report()
  print("Pollution Forecast Report:", report)
