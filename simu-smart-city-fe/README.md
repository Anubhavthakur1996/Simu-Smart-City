# React Frontend (`simu-smart-city-fe`)

## Overview

This directory contains the **interactive visualization dashboard** for the Simu-Smart-City framework. Built with **React 19**, **Vite**, **TypeScript**, and **Redux Toolkit**, it provides a responsive UI to configure multi-agent simulations and visualize real-time pollutant metrics.

**Core Capabilities:**
- **Simulation Configuration:** Set agent parameters, fuel types, and active environmental policies (eco-speed, congestion).
- **Data Visualization:** Renders real-time scatter plots, line charts, and radar charts via custom Recharts helper components.
- **Centralized State:** Manages simulation payloads, baseline empirical data, and API responses through a unified Redux store.

---

## Architecture: Container/Presenter Pattern

To maintain a clean separation of concerns, the application views implement the Container/Presenter (Smart/Dumb) component pattern. 

For example, inside `src/views/Dashboard/`:
- `Dashboard.tsx` acts as the **Container**: It hooks into the Redux store (`dataSlice`), dispatches API calls, and handles business logic.
- `DashboardUI.tsx` acts as the **Presenter**: It receives data exclusively via props and focuses solely on rendering the UI, charts, and handling user interactions.

This pattern is strictly replicated across all core views (`home/`, `NewRule/`, `splash/`).

---

## Directory Structure

```text
simu-smart-city-fe/
├── index.html                 # Entry HTML file
├── package.json               # Dependencies & scripts
├── yarn.lock                  # Yarn dependency tree
├── vite.config.ts             # Vite build configuration
├── tsconfig.json              # TypeScript root config
├── eslint.config.js           # ESLint configuration
├── public/                    # Static public assets
└── src/
    ├── main.tsx               # App initialization & Redux/Router setup
    ├── index.scss             # Global styles (Sass)
    ├── API/                   # HTTP client & calls
    │   ├── APIBase.ts         # Axios instance configuration
    │   ├── fetchData.ts       # GET /data call for baselines
    │   └── simulation.ts      # POST /simulate call
    ├── components/config/     # Reusable UI configuration blocks
    │   ├── Config.tsx         
    │   └── Config.scss        
    ├── data/                  # Local cached baselines
    │   ├── polldata.csv       
    │   └── synthetic_aqi.json 
    ├── helpers/graphs/        # Modular Recharts wrappers
    │   ├── ChartV2Vehi.tsx    # Vehicle/fleet chart component
    │   └── LineChartV2.tsx    # Multi-pollutant line chart
    ├── redux/                 # State management
    │   ├── store.ts           # Redux store initialization
    │   └── slices/
    │       └── dataSlice.ts   # Unified state management slice
    ├── router/                # React Router setup
    │   └── index.ts           # Route definitions
    ├── services/              
    │   └── PythonClient.ts    # Legacy/Secondary middleware client
    ├── types/                 # TypeScript interfaces
    │   └── index.ts
    ├── views/                 # Full page layouts (Container/Presenter split)
        ├── Dashboard/         # Dashboard.tsx & DashboardUI.tsx
        ├── Error/             # ErrorBoundary.tsx
        ├── home/              # Home.tsx & HomeUI.tsx
        ├── NewRule/           # NewRule.tsx & NewRuleUI.tsx
        └── splash/            # Splash.tsx & SplashUI.tsx
```

---

## State Management (Redux Toolkit)

The application utilizes a consolidated `dataSlice` to handle the entire data lifecycle, avoiding fragmented state across components.

**Slice:** `data`
**File:** `src/redux/slices/dataSlice.ts`

**Initial State Map:**
```typescript
{
  polData: null,          // Baseline empirical pollution data
  configData: {           // Active frontend configuration payload
    vType: "petrol",
    fType: "regular",
    speedCon: "normal",
    congestion: "none",
  },
  emissionData: null,     // Base emission factors per vehicle/fuel type
  policies: null,         // Available policy intervention matrices
  results: null           // Structured response from the Python-BE simulation
}
```

**Core Reducers:**
- `setPolData`: Initializes the dashboard with `polldata.csv` baselines.
- `setEmData`: Loads emission configurations.
- `setPoliciesData`: Registers available policy constraints.
- `setResults`: Parses and stores the final multi-agent simulation output for graph rendering.

---

## Tech Stack & Dependencies

| Package | Version | Purpose |
| :--- | :--- | :--- |
| **react** / **react-dom** | ^19.2.0 | Core UI rendering |
| **@reduxjs/toolkit** | ^2.11.2 | Centralized state management |
| **react-redux** | ^9.2.0 | Redux bindings for React components |
| **recharts** | ^3.7.0 | Data visualization engine |
| **react-router** | ^7.13.0 | Client-side routing |
| **vite** | ^7.3.1 | Development server and SWC-based build tool |
| **typescript** | ^5.9.3 | Static typing |
| **axios** | ^1.13.5 | HTTP client |
| **sass** | ^1.97.3 | CSS preprocessing (`.scss`) |

---

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- Yarn package manager
- Active Node-BE middleware running locally

### 1. Install Dependencies
```bash
yarn install
```

### 2. API Environment Configuration
Edit `src/API/APIBase.ts` to ensure the Axios instance points to your active middleware port, or use an environment variable:
```typescript
const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});
```

### 3. Execution

**Start Development Server (with HMR):**
```bash
yarn dev
```
The dashboard will be available at `http://localhost:5173`.

**Production Build:**
```bash
yarn build
```

---

## Available Scripts

```bash
yarn dev       # Dev server with hot reload
yarn build     # Production build (tsc -b && vite build)
yarn lint      # Run ESLint
yarn preview   # Preview production build locally
```

---

## Troubleshooting

- **CORS Errors:** If API calls fail in the browser console, verify that the Node middleware (`Node-BE`) has CORS enabled for `localhost:5173`.
- **Charts Failing to Render:** Verify that the `cycles` parameter in `configData` is greater than 0, as Recharts requires sequential data points to render time-series line charts.
- **Build Fails with Type Errors:** Run `npx tsc --noEmit` to trace specific TypeScript interface mismatches before running `yarn build`.

---

## License

MIT License — See LICENSE file in the root directory.
