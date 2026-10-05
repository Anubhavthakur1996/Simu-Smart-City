# Node.js Middleware (`Node-BE`)

## Overview

This directory houses the **asynchronous middleware layer** of the Simu-Smart-City framework. Built on **Express.js**, it operates as a high-speed traffic controller bridging the React frontend (`simu-smart-city-fe`) with the computationally heavy Python simulation engine (`Python-BE V2`).

**Core Responsibilities:**

- Decouples heavy Mesa simulation execution from UI event loops to maintain frontend responsiveness.
- Marshals simulation configuration parameters (fleet distributions, policy active flags, cycle counts) into structured API payloads.
- Routes execution requests to the FastAPI backend via an asynchronous Axios client.
- Serves baseline air quality metrics (Sector 22 Chandigarh, OpenAQ) to initialize frontend dashboards.
- Provides standard HTTP logging for request monitoring and debugging.

---

## Directory Structure

```text
Node-BE/
├── index.js                     # Express initialization, middleware configuration, and routing
├── package.json                 # Node dependencies and execution scripts
├── src/
│   ├── data/                    # Reserved for local caching of empirical baselines
│   ├── routes/
│   │   └── data/
│   │       └── fetchBaseData.js # Endpoint: GET /api/data
│   └── services/
│       └── pythonClient.js      # Axios client for communicating with Python FastAPI
└── node_modules/                # Installed project dependencies
```

---

## Communication Architecture

```text
React Frontend (simu-smart-city-fe)
       │
       ▼  POST /api/run-simulation (Payload: fleet, policies, cycles)
Node-BE Middleware (Express)
       │
       ├─ Parses JSON payload & validates structure
       ├─ Dispatches asynchronous request via pythonClient.js
       │
       ▼  POST http://localhost:8000/simulate
Python Engine (FastAPI + Mesa)
       │
       ├─ Runs multi-agent spatial simulation & policy reward shifts
       └─ Calculates cumulative emissions & returns metrics object
       │
       ▼
Node-BE Middleware
       │
       ▼  Streams structured response
React Frontend (Renders scatter plots, radar charts, and comparative tables)
```

---

## API Endpoints

### 1. Baseline Data Ingestion

- **Endpoint:** `GET /api/data`
- **Handler:** `src/routes/data/fetchBaseData.js`
- **Description:** Retrieves baseline environmental metrics and configurable parameters for dashboard setup.

**Sample Response:**

```json
{
  "data": "...",
  "emissionData": {
    "petrol": {
      "co2": 200,
      "co": 0.3,
      "nox": 0.25,
      "pm25": 10,
      "pm10": 20,
      "so2": 0.02
    }
  },
  "policies": "..."
}
```

### 2. Simulation Execution Pipeline

- **Endpoint:** `POST /api/run-simulation`
- **Handler:** `index.js` -> `src/services/pythonClient.js`
- **Description:** Ingests frontend simulation parameters and forwards execution to the Python backend.

**Sample Request Body:**

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

---

## Tech Stack & Dependencies

| Package         | Version | Purpose                                               |
| :-------------- | :------ | :---------------------------------------------------- |
| **express**     | ^5.2.1  | Core HTTP routing framework                           |
| **axios**       | ^1.13.5 | Promise-based client for Python service orchestration |
| **cors**        | ^2.8.6  | Cross-origin resource sharing for React UI            |
| **body-parser** | ^2.2.2  | Ingestion and parsing of simulation JSON payloads     |

---

## Installation & Setup

### Prerequisites

- Node.js (v18+) & yarn
- Python simulation service active on `http://localhost:8000`

### 1. Install Dependencies

```bash
yarn install
```

### 2. Environment Configuration (Optional)

Create a `.env` file in the root of `Node-BE/` if customizing hosts or ports:

```env
PORT=3001
PYTHON_BACKEND_URL=http://localhost:8000
NODE_ENV=development
```

### 3. Execution

**Development (with Nodemon hot reloading):**

```bash
yarn dev
```

**Production:**

```bash
yarn start
```

The middleware defaults to `http://localhost:3001`.

---

## Error Handling & Diagnostics

- **`ECONNREFUSED` (Port 8000):** Indicates `Python-BE V2` is offline. Ensure FastAPI is running via `uvicorn` before triggering simulations.
- **500 Status Responses:** Occurs when simulation iterations exceed allocated Python memory or when agent configuration parameters contain invalid datatypes. Inspect terminal logs for traceback propagation.
- **CORS Failures:** If the React dashboard cannot communicate with port 3001, verify that origins are unblocked in `index.js`.
