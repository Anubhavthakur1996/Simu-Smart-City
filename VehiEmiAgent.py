import random

class Vehicle:
  def __init__(self, fuel_type="diesel", speed_policy="normal"):
    self.fuel_type = fuel_type
    self.speed_policy = speed_policy

  def simulate_emission(self, road_condition):
    # Base emission factors by fuel type
    fuel_emission = {"diesel": 2.5, "petrol": 2.0, "electric": 0.5}
    
    # Speed policy multiplier
    speed_factor = {"slow": 0.8, "normal": 1.0, "fast": 1.5}
    
    # Road condition multiplier (congestion, smooth, etc.)
    road_factor = {"congested": 1.5, "smooth": 1.0}
    
    # Calculate emissions
    base = fuel_emission[self.fuel_type]
    emission = base * speed_factor[self.speed_policy] * road_factor[road_condition]
    return emission

# Example usage
vehicle = Vehicle(fuel_type="diesel", speed_policy="fast")
for step in range(5):
  road = random.choice(["smooth", "congested"])
  emission = vehicle.simulate_emission(road)
  print(f"Step {step}: Road={road}, Emission={emission:.2f}")
