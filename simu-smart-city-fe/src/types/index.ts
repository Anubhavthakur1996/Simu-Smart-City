// Types for simulation results
export interface CycleResult {
  Step: number;
  pm25_ug_m3?: number;
  pm10_ug_m3?: number;
  co_ppb?: number;
  nox_ppb?: number;
  so2_ppb?: number;
  fuel_petrol?: number;
  fuel_diesel?: number;
  fuel_cng?: number;
  fuel_ev?: number;
  mobility_focus?: number;
  emission_focus?: number;
  congestion_focus?: number;
  avg_reward?: number;
  moves?: number;
  reroutes?: number;
  stops?: number;
}

export interface AgentResult {
  Step: number;
  AgentID: number;
  action?: string | null;
  objective?: string | null;
  reward?: number;
  position?: [number, number];
}

export interface ResultsPayload {
  regularResults?: CycleResult[];
  resultsWithPolicies?: CycleResult[];
  agentsResults?: AgentResult[];
  agentResultsWithPolicies?: AgentResult[];
}

// Props passed to DashboardUI
export interface DashboardUIProps {
  className?: string;
  COLORS: Record<string, string>;
  smallCardStyle: React.CSSProperties;
  showBaseline: boolean;
  setShowBaseline: React.Dispatch<React.SetStateAction<boolean>>;
  showPolicies: boolean;
  setShowPolicies: React.Dispatch<React.SetStateAction<boolean>>;
  scatterBase: { x: number; y: number; id: number; reward: number }[];
  scatterPol: { x: number; y: number; id: number; reward: number }[];
  combined: any[];
  focusCombined: any[];
  radarData: { metric: string; baseline: number; policies: number }[];
  percentChange: { pm25: number | null; nox: number | null };
  results: ResultsPayload;
  fleetCombined: any[];
}
