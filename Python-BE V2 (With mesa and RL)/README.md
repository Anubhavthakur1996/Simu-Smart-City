# Python Backend: Simulation Engine (Mesa + RL)

## Overview

This is the **core computational engine** of Simu-Smart-City. Built with **Mesa** (agent-based modeling framework) and **FastAPI**, it handles grid-based scaffolding, multi-agent urban traffic simulation, hierarchical reinforcement learning, and emission factor calculations.

The module orchestrates:

- **Agent-based simulation** of heterogeneous vehicles (petrol, diesel, CNG, EV)
- **Hierarchical Q-learning** for agent behavior adaptation
- **Policy application engine** for environmental regulations
- **Emission tracking & conversion** (µg/m³ to ppb/ppm units)
- **Real-time data collection** via Mesa's DataCollector

---

## Directory Structure

```text
Python-BE V2 (With mesa and RL)/
├── PyServer.py                 # FastAPI entry point; exposes /simulate and /data endpoints
├── SynthSimulation.py          # Core simulation logic: PollutionModel, VehicleAgent, PolicyEngine
├── RealSynthData.py            # Synthetic data generation via GaussianCopulaSynthesizer
├── data/
│   ├── emission_data.json      # Emission profiles per fuel type (g/km per pollutant)
│   ├── synthetic_aqi.csv       # Generated via GaussianCopulaSynthesizer (Legacy/Unused in V2)
│   ├── synthetic_aqi.json      # JSON representation of synthetic AQI
│   └── openaq chd sec22.csv    # Real OpenAQ observations (Sector 22 Chandigarh ground truth)
├── util/
│   ├── EmiPerStep.py           # Samples per-km emissions with variability factors
│   ├── EmiToUnits.py           # Converts µg/m³ ↔ ppb/ppm using molecular weights
│   └── __init__.py
└── requirements.txt            # Python dependency list
```

---

## Core Components

### 1. **VehicleAgent** (`SynthSimulation.py`)

Represents individual vehicles navigating the toroidal grid.

**Attributes:**

- `fuel_type` — Randomly assigned or pre-configured (petrol, diesel, CNG, EV)
- `emissions` — Per-kilometer emission profile (NOx, CO, PM2.5, PM10, SO2)
- `objectives` — Multi-objective priorities: mobility, emission, congestion
- `high_Q` — Hierarchical Q-table for objective selection
- `low_Q` — Per-objective action Q-tables (move, reroute, stop)

**Key Methods:**

- `select_action(state_idx)` — ε-greedy objective & action selection
- `update(...)` — Q-learning updates for both hierarchical levels
- `step()` — Executes action, calculates emissions, applies policies, updates Q-tables

### 2. **PollutionModel** (`SynthSimulation.py`)

The Mesa Model orchestrating agents and the spatial environment.

**Initialization Parameters:**

- `N` — Number of vehicle agents
- `width`, `height` — Grid dimensions (toroidal wrap-around)
- `baseline_pollution` — Initial pollutant concentrations (µg/m³)
- `policy_engine` — PolicyEngine instance for regulation rules
- `cell_volume_m3` — Atmospheric mixing volume (default: 1000m × 1000m × 100m height)

**Key Methods:**

- `encode_state(agent)` — Encodes pollution level, congestion, and position into discrete state index
- `step()` — Activates all agents, collects global data
- `datacollector` — Mesa DataCollector tracking pollutant levels, fuel distribution, and behavioral shifts

### 3. **PolicyEngine** (`SynthSimulation.py`)

Applies environmental regulations to alter agent emission logic and trigger behavioral shifts.

**Supported Policies:**

- **Eco-driving incentives** — Reduce specific gaseous emissions by a configured factor
- **Low-sulfur fuel mandates** — Target specific pollutants (e.g., SO2 reduction)
- **Congestion taxation** — Penalize agents in taxed zones; triggers rerouting logic

**Method:**

- `apply(agent, emissions)` — Returns adjusted emissions and optional behavior adaptation flag

### 4. **Emission Utilities**

#### `EmiPerStep.py`

Samples per-km emissions for a given fuel type with realistic variability:

- Stable pollutants (CO, SO2): ±10–30% variance
- Unstable pollutants (NOx, PM): ±25–75% variance

#### `EmiToUnits.py`

Converts raw mass units to standardized atmospheric concentrations:

- **PM10 & PM2.5** — µg/m³ (particulate matter)
- **NOx, CO, SO2** — ppb (parts per billion) via molecular weight

**Molecular weights utilized:**

- CO: 28.01 g/mol
- NOx: 46.0 g/mol (NO₂ proxy)
- SO2: 64.07 g/mol

---

## FastAPI Endpoints

### `GET /`

Health check endpoint.

**Response:**

```json
{ "Hello": "World" }
```

### `GET /data`

Fetches synthetic AQI baseline data.

<!-- **Response:**
```json
{
  "data": [
    {"parameter": "pm25", "value": 45.2, "unit": "ug/m3"},
    {"parameter": "nox", "value": 32.5, "unit": "ppb"}
  ]
}
``` -->

### `POST /simulate`

Executes multi-agent pollution simulation with frontend-defined constraints.

<!-- **Sample Request Body:**
```json
{
  "config": {
    "vehicle": "petrol",
    "activePolicies": ["low_sulfur", "speed_eco", "none"]
  },
  "agents": "10",
  "cycles": "20"
}
```

**Response:**
```json
{
  "result": {
    "model_data": {...},
    "model_policy_data": {...},
    "policy_impact_summary": {...}
  }
}
``` -->

---

## Installation & Setup

### Prerequisites

- Python 3.8+
- Virtual environment (recommended)

### 1. Create Virtual Environment

```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # Windows PowerShell
source .venv/bin/activate     # macOS/Linux
```

### 2. Install Dependencies

```bash
pip install fastapi mesa numpy pandas plotly sdv scikit-learn torch
```

### 3. Run the Server

```bash
fastapi dev PyServer.py
```

The API will be available at `http://localhost:8000`
OpenAPI documentation: `http://localhost:8000/docs`

---

## Key Simulation Parameters

| Parameter               | Default | Description                       |
| ----------------------- | ------- | --------------------------------- |
| `num_agents (N)`        | 10      | Number of vehicle agents          |
| `grid_width`            | 15      | Grid width (cells)                |
| `grid_height`           | 40      | Grid height (cells)               |
| `cycles`                | 20      | Simulation time steps             |
| `distance_per_step_km`  | 1.0     | Distance traveled per step (km)   |
| `cell_length_m`         | 1000    | Cell side length (meters)         |
| `mixing_height_m`       | 100     | Atmospheric layer height (meters) |
| `epsilon` (exploration) | 0.1     | Random action probability (RL)    |
| `alpha` (learning rate) | 0.5     | Q-learning step size              |
| `gamma` (discount)      | 0.9     | Future reward importance (RL)     |

---

## Troubleshooting

- **Issue:** `ModuleNotFoundError: No module named 'mesa'`
  **Solution:** Ensure `.venv` is activated and dependencies are installed (`pip install mesa`).
- **Issue:** Slow simulation execution
  **Solution:** Reduce `num_agents` in the frontend payload or disable verbose print statements in `encode_state()`.
- **Issue:** Emission concentrations scaling incorrectly
  **Solution:** Review `cell_volume_m3` calculation inside `SynthSimulation.py`—smaller volumes yield exponentially higher concentration deltas.

---

## License

MIT License — See LICENSE file in the root directory.
