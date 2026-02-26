# This agent simulates a petrol car in a smart city environment, 
# kofocusing on fuel consumption and emissions based on speed and road conditions.

import random

class Vehicle:
  def __init__(self, fuel_type="petrol", speed_policy="normal"):
    self.fuel_type = fuel_type
    self.speed_policy = speed_policy

  def simulate_emission(self, road_condition):
    # Base emission factors by fuel type (g/km CO₂ equivalent)
    fuel_emission = {
      "diesel": 2.5,
      "petrol": 2.0,
      "cng": 1.8,
      "electric": 0.5
    }
    
    # Speed policy multiplier
    speed_factor = {"slow": 0.8, "normal": 1.0, "fast": 1.5}
    
    # Road condition multiplier
    road_factor = {"smooth": 1.0, "congested": 1.5}
    
    # Calculate emissions
    base = fuel_emission[self.fuel_type]
    emission = base * speed_factor[self.speed_policy] * road_factor[road_condition]
    return emission

# Example: Petrol car agent
petrol_car = Vehicle(fuel_type="petrol", speed_policy="normal")

for step in range(5):
  road = random.choice(["smooth", "congested"])
  emission = petrol_car.simulate_emission(road)
  print(f"Step {step}: Road={road}, Emission={emission:.2f}")
