// SimulationDashboardWithToggle.jsx
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DashboardUI from "./DashboardUI";
import { setResults } from "../../redux/slices/dataSlice";
import type { DashboardUIProps } from "../../types";

const COLORS = {
  pm25: "#8884d8",
  nox: "#82ca9d",
  so2: "#ffc658",
  co: "#ff7f50",
  pm10: "#8dd1e1",
  baseline: "#8884d8",
  policies: "#82ca9d",
};

const smallCardStyle = {
  border: ".1em solid #eee",
  borderRadius: 6,
  padding: 10,
  background: "#fff",
  boxShadow: "0 .1em .5em rgba(0,0,0,0.04)",
};

const Dashboard = () => {
  const { results } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  useEffect(() => {
    const res = JSON.parse(sessionStorage.getItem("results"));
    if (res) {
      dispatch(setResults(res));
    }
  }, [dispatch]);

  // toggles
  const [showBaseline, setShowBaseline] = useState(true);
  const [showPolicies, setShowPolicies] = useState(true);

  // Defensive defaults
  const regular = results?.regularResults || [];
  const pol = results?.resultsWithPolicies || [];
  const agentsBase = results?.agentsResults || [];
  const agentsPol = results?.agentResultsWithPolicies || [];

  // Add cycle index to each entry (1-based)
  const regularWithCycle = useMemo(
    () => regular.map((d, i) => ({ cycle: d.Step, ...d })),
    [regular],
  );
  const polWithCycle = useMemo(
    () => pol.map((d, i) => ({ cycle: d.Step, ...d })),
    [pol],
  );

  // Fleet Data (Basically vehicle agents)
  const fleetCombined = useMemo(() => {
    const maxLen = Math.max(regularWithCycle.length, polWithCycle.length);
    const out = [];
    for (let i = 0; i < maxLen; i++) {
      out.push({
        cycle: i + 1,
        petrol_base: regularWithCycle[i]?.fuel_petrol ?? 0,
        diesel_base: regularWithCycle[i]?.fuel_diesel ?? 0,
        cng_base: regularWithCycle[i]?.fuel_cng ?? 0,
        ev_base: regularWithCycle[i]?.fuel_ev ?? 0,
        petrol_pol: polWithCycle[i]?.fuel_petrol ?? 0,
        diesel_pol: polWithCycle[i]?.fuel_diesel ?? 0,
        cng_pol: polWithCycle[i]?.fuel_cng ?? 0,
        ev_pol: polWithCycle[i]?.fuel_ev ?? 0,
      });
    }
    return out;
  }, [regularWithCycle, polWithCycle]);

  // Combined dataset for overlay line chart (merge baseline & policies by cycle)
  const combined = useMemo(() => {
    const maxLen = Math.max(regularWithCycle.length, polWithCycle.length);
    const out = [];
    for (let i = 0; i < maxLen; i++) {
      out.push({
        cycle: i + 1,
        pm25_base: regularWithCycle[i]?.["pm25_ug/m3"],
        nox_base: regularWithCycle[i]?.nox_ppb,
        so2_base: regularWithCycle[i]?.so2_ppb,
        co_base: regularWithCycle[i]?.co_ppb,
        pm10_base: regularWithCycle[i]?.["pm10_ug/m3"],
        pm25_pol: polWithCycle[i]?.["pm25_ug/m3"],
        nox_pol: polWithCycle[i]?.nox_ppb,
        so2_pol: polWithCycle[i]?.so2_ppb,
        co_pol: polWithCycle[i]?.co_ppb,
        pm10_pol: polWithCycle[i]?.["pm10_ug/m3"],
      });
    }

    return out;
  }, [regularWithCycle, polWithCycle]);

  // Bar chart dataset: focus counts per cycle (baseline vs policies)
  const focusCombined = useMemo(() => {
    const maxLen = Math.max(regularWithCycle.length, polWithCycle.length);
    const out = [];
    for (let i = 0; i < maxLen; i++) {
      out.push({
        cycle: i + 1,
        mobility_base: regularWithCycle[i]?.mobility_focus ?? 0,
        emission_base: regularWithCycle[i]?.emission_focus ?? 0,
        congestion_base: regularWithCycle[i]?.congestion_focus ?? 0,
        mobility_pol: polWithCycle[i]?.mobility_focus ?? 0,
        emission_pol: polWithCycle[i]?.emission_focus ?? 0,
        congestion_pol: polWithCycle[i]?.congestion_focus ?? 0,
      });
    }
    return out;
  }, [regularWithCycle, polWithCycle]);

  // Scatter results: convert agent positions to {x, y}
  const scatterBase = agentsBase
    .map((a, idx) => {
      if (!a?.position) return null;
      return {
        x: a.position[0],
        y: a.position[1],
        id: idx,
        reward: a.reward ?? 0,
      };
    })
    .filter(Boolean);

  const scatterPol = agentsPol
    .map((a, idx) => {
      if (!a?.position) return null;
      return {
        x: a.position[0],
        y: a.position[1],
        id: idx,
        reward: a.reward ?? 0,
      };
    })
    .filter(Boolean);

  // Radar chart: aggregate moves/reroutes/stops and avg_reward for baseline & policies
  const radarData = useMemo(() => {
    const sum = (arr, key) => arr.reduce((s, it) => s + (it?.[key] ?? 0), 0);
    const avg = (arr, key) => (arr.length ? sum(arr, key) / arr.length : 0);

    const baseline = {
      moves: avg(regularWithCycle, "moves"),
      reroutes: avg(regularWithCycle, "reroutes"),
      stops: avg(regularWithCycle, "stops"),
      avg_reward: avg(regularWithCycle, "avg_reward"),
    };
    const policies = {
      moves: avg(polWithCycle, "moves"),
      reroutes: avg(polWithCycle, "reroutes"),
      stops: avg(polWithCycle, "stops"),
      avg_reward: avg(polWithCycle, "avg_reward"),
    };

    return [
      { metric: "moves", baseline: baseline.moves, policies: policies.moves },
      {
        metric: "reroutes",
        baseline: baseline.reroutes,
        policies: policies.reroutes,
      },
      { metric: "stops", baseline: baseline.stops, policies: policies.stops },
      {
        metric: "avg_reward",
        baseline: baseline.avg_reward,
        policies: policies.avg_reward,
      },
    ];
  }, [regularWithCycle, polWithCycle]);

  // Percent change summary (final cycle/end of simulation)
  const percentChange = useMemo(() => {
    const lastBase = regularWithCycle[regularWithCycle.length - 1] || {};
    const lastPol = polWithCycle[polWithCycle.length - 1] || {};

    const pct = (base: number | undefined, pol: number | undefined) => {
      if (base === undefined || pol === undefined) return null;
      if (base === 0) return pol === 0 ? 0 : null;
      return ((pol - base) / Math.abs(base)) * 100;
    };

    // Pollutant substrings we care about
    const pollutantKeys = ["co", "nox", "so2", "pm10", "pm25"];

    const result: Record<string, number | null> = {};

    Object.keys(lastBase).forEach((key) => {
      const match = pollutantKeys.find((p) =>
        key.toLowerCase().includes(p.toLowerCase()),
      );
      if (match) {
        result[match] = pct(lastBase[key], lastPol[key]);
      }
    });

    return result;
  }, [regularWithCycle, polWithCycle]);

  const props: DashboardUIProps = {
    COLORS,
    smallCardStyle,
    showBaseline,
    setShowBaseline,
    showPolicies,
    setShowPolicies,
    scatterBase,
    combined,
    focusCombined,
    scatterPol,
    radarData,
    percentChange,
    results,
    fleetCombined,
  };

  return <DashboardUI {...props} />;
};

export default Dashboard;
