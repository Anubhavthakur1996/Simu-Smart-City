from mesa import Agent, Model
from mesa.time import RandomActivation
from mesa.space import MultiGrid
import random

# Vehicle agent
class VehicleAgent(Agent):
  def __init__(self, unique_id, model):
    super().__init__(unique_id, model)
    self.emission_rate = random.uniform(1, 5)  # PM2.5 units per step

  def step(self):
    # Move randomly
    possible_steps = self.model.grid.get_neighborhood(
      self.pos,
      moore=True,
      include_center=False
    )
    new_position = random.choice(possible_steps)
    self.model.grid.move_agent(self, new_position)

    # Emit pollution into environment
    self.model.pollution_level += self.emission_rate


# Model (Like a video game engine)
class PollutionModel(Model):
  def __init__(self, N, width, height, baseline_pollution=100):
    self.num_agents = N
    self.grid = MultiGrid(width, height, True)
    self.schedule = RandomActivation(self)
    self.pollution_level = baseline_pollution  # from real/synthetic data

    # Instantiating agents (number of cars)
    for i in range(self.num_agents):
      a = VehicleAgent(i, self)
      self.schedule.add(a)
      x = self.random.randrange(self.grid.width)
      y = self.random.randrange(self.grid.height)
      self.grid.place_agent(a, (x, y))

  def step(self):
    self.schedule.step()
    # Here we can log pollution_level each step
