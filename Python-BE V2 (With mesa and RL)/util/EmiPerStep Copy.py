import os
import random
import json

current_dir = os.path.dirname(os.path.abspath(__file__))

# # Derived from empirical studies (ICCT, IISc Bangalore, GLEC framework).
# emissionTableDictH = {
#   "petrol": {
#     "co2": 200,   # grams per km avg
#     "co": 0.3,   # grams per km avg
#     "nox": 0.25,  # grams per km avg
#     "pm25": 10,   # mgrams per km avg
#     "pm10": 20,   # mgrams per km avg
#     "so2": 0.02,   # grams per km avg
#   },
#   "diesel": {
#     "co2": 250,   # grams per km avg
#     "co": 0.5,   # grams per km avg
#     "nox": 0.6,  # grams per km avg
#     "pm25": 20,   # mgrams per km avg
#     "pm10": 40,   # mgrams per km avg
#     "so2": 0.05,   # grams per km avg
#   },
#   "cng": {
#     "co2": 180,   # grams per km avg
#     "co": 0.2,   # grams per km avg
#     "nox": 0.15,  # grams per km avg
#     "pm25": 8,   # mgrams per km avg
#     "pm10": 15,   # mgrams per km avg
#     "so2": 0.01,   # grams per km avg
#   },
#   "ev": {
#     "co2": 0,   # grams per km avg but in idia lifetime emissions are approx. 120 g/km due to coal based electricity generation
#     "co": 0,   # grams per km avg but in idia lifetime emissions are approx. 120 g/km due to coal based electricity generation
#     "nox": 0,  # grams per km avg
#     "pm25": 0,   # mgrams per km avg
#     "pm10": 0,   # mgrams per km avg
#     "so2": 0,   # grams per km avg
#   },
#   "inTransSector": {
#     "co2": [180-260],   # grams per km avg (includes public transport, freight, etc.)
#     "co": "variable",  
#     "nox": "variable",  
#     "pm25": "variable", 
#     "pm10": "variable", 
#     "so2": "variable", 
#   }
# }

# def EmissionPerStep(fType=None):
def EmissionPerStep():
  # setting default type to petrol
  # if not fType: fType = "petrol"

  # Reading Emission data from json
  with open(os.path.join(current_dir, "../data/emission_data.json"), 'r') as file:
    emissionTableDict = json.load(file) # Note: load() for file objects

  fuelKeys = emissionTableDict.keys()
  fType = random.choice(fuelKeys)

  # variability factor for stable emissionTableDict[fType] = 10-30%
  # variability factor for unstable emissionTableDict[fType] = 25-75%
  # Derived from empirical studies (ICCT, IISc Bangalore, GLEC framework).
  varFactStabLow = 0.1
  varFactStabHigh = 0.3
  varFactUnstabLow = 0.25
  varFactUnstabHigh = 0.75

  # stabPolList = ["co2", "co", "so2"]
  # unstabPolList = ["pm25", "no2", "so2", "o3", "pm10"]

  # varFactLow = varFactStabLow if fType in stabPolList else varFactUnstabLow
  # varFactHigh = varFactStabHigh if fType in stabPolList else varFactUnstabHigh

  # co2 range
  # co2Min = round((emissionTableDict[fType]["co2"] * (1 - varFactStabLow)), 2)
  # co2Max = round((emissionTableDict[fType]["co2"] * (1 + varFactStabLow)), 2)

  # co range
  coMin = round((emissionTableDict[fType]["co"] * (1 - varFactStabLow)), 2)
  coMax = round((emissionTableDict[fType]["co"] * (1 + varFactStabHigh)), 2)

  # nox range
  noxMin = round((emissionTableDict[fType]["nox"] * (1 - varFactUnstabLow)), 2)
  noxMax = round((emissionTableDict[fType]["nox"] * (1 + varFactUnstabHigh)), 2)

  # so2 range
  so2Min = round((emissionTableDict[fType]["so2"] * (1 - varFactStabLow)), 2)
  so2Max = round((emissionTableDict[fType]["so2"] * (1 + varFactStabHigh)), 2)
  
  # pm2.5 range
  pm25Min = round(((emissionTableDict[fType]["pm25"]/1000) * (1 - varFactUnstabLow)), 2)  # Because data in mg
  pm25Max = round(((emissionTableDict[fType]["pm25"]/1000) * (1 + varFactUnstabHigh)), 2) # Because data in mg
  
  # pm10 range
  pm10Min = round(((emissionTableDict[fType]["pm10"]/1000) * (1 - varFactUnstabLow)), 2)  # Because data in mg
  pm10Max = round(((emissionTableDict[fType]["pm10"]/1000) * (1 + varFactUnstabHigh)), 2) # Because data in mg

  # pollution units per step (petrol car)
  emissions = {
    # "co2": random.uniform(co2Min, co2Max),
    "co": random.uniform(coMin, coMax),
    "nox": random.uniform(noxMin, noxMax),
    "so2": random.uniform(so2Min, so2Max),
    "pm25": random.uniform(pm25Min, pm25Max),
    "pm10": random.uniform(pm10Min, pm10Max),
  }
  
  return emissions