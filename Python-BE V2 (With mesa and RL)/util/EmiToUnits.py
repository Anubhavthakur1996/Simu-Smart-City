# Molecular weights (g/mol) for gases
MW = {
  "co": 28.01,
  # "co2": 44.01,
  "nox": 46.0,   # using NO2 proxy
  "so2": 64.07
}

# Unit schema: what unit each pollutant should be reported in
UNIT_SCHEMA = {
  "pm10": "ug/m3",
  "pm25": "ug/m3",
  "co": "ppb",
  # "co2": "ppm",
  "nox": "ppb",
  "so2": "ppb"
}


def convert_emission_to_unit(pollutant, delta_conc_ugm3):
  unit = UNIT_SCHEMA.get(pollutant, "ug/m3")

  if unit == "ug/m3":
    return delta_conc_ugm3
  elif unit == "ppb":
    return (delta_conc_ugm3 * 24.45) / MW[pollutant]
  elif unit == "ppm":
    return ((delta_conc_ugm3 * 24.45) / MW[pollutant]) / 1000.0
  else:
    raise ValueError(f"Unknown unit for {pollutant}: {unit}")

def reporter_with_units(pollutant):
  return lambda m: m.pollution_levels[pollutant]


