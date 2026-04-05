
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