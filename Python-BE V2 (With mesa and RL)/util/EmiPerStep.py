import os
import random
import json

current_dir = os.path.dirname(os.path.abspath(__file__))

def EmissionPerStep(fType=None):
  # Load emission table
  with open(os.path.join(current_dir, "../data/emission_data.json"), "r") as f:
    emissionTableDict = json.load(f)

  # valid fuel keys as list
  fuel_keys = list(emissionTableDict.keys())
  if not fuel_keys:
    raise ValueError("emission_data.json contains no fuel entries")

  # choose fuel only if not provided
  if fType is None:
    fType = random.choice(fuel_keys)

  # safe accessor
  def val(k):
    return float(emissionTableDict[fType].get(k, 0))

  # variability factors
  varFactStabLow = 0.1
  varFactStabHigh = 0.3
  varFactUnstabLow = 0.25
  varFactUnstabHigh = 0.75

  # compute ranges
  coMin = val("co") * (1 - varFactStabLow)
  coMax = val("co") * (1 + varFactStabHigh)

  noxMin = val("nox") * (1 - varFactUnstabLow)
  noxMax = val("nox") * (1 + varFactUnstabHigh)

  so2Min = val("so2") * (1 - varFactStabLow)
  so2Max = val("so2") * (1 + varFactStabHigh)

  pm25_mg = val("pm25")
  pm10_mg = val("pm10")
  # convert mg -> g here so agent code can assume grams
  pm25Min = (pm25_mg / 1000.0) * (1 - varFactUnstabLow)
  pm25Max = (pm25_mg / 1000.0) * (1 + varFactUnstabHigh)
  pm10Min = (pm10_mg / 1000.0) * (1 - varFactUnstabLow)
  pm10Max = (pm10_mg / 1000.0) * (1 + varFactUnstabHigh)

  # helper to avoid degenerate ranges
  def sample(a, b):
    return a if abs(a - b) < 1e-12 else random.uniform(a, b)

  emissions = {
    "fuel_type": fType,
    "co": sample(coMin, coMax),
    "nox": sample(noxMin, noxMax),
    "so2": sample(so2Min, so2Max),
    "pm25": sample(pm25Min, pm25Max),
    "pm10": sample(pm10Min, pm10Max),
  }
  return emissions
