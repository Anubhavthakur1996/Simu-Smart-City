import { useState } from "react";
import "./Config.scss";

type ConfigProps = {
  loading: boolean;
  runSim: () => void;
  policies: any;
};

const Config: React.FC<ConfigProps> = ({ loading, runSim, policies }) => {
  const [cycles, setCycles] = useState(3);
  const [agents, setAgents] = useState(5);
  const [config, setConfig] = useState({
    vehicle: "petrol",
    fuel: "regular",
    speed: "normal",
    congestion: "none",
  });

  // payload prepared for backend
  const payload = {
    vehicle: config.vehicle,
    activePolicies: [config.fuel, config.speed, config.congestion],
  };

  const makePayload = () => {
    const data = { ...payload, agents, cycles };

    runSim(data);
  };

  // helper to generate numeric options
  const generateOptions = (min: number, max: number) =>
    Array.from({ length: max - min + 1 }, (_, i) => min + i);

  // helper to format pollutant values
  const formatPollutants = (data: any) => {
    if (!data) return "";

    return [
      data.co !== undefined && `CO: ${data.co}`,
      data.nox !== undefined && `NOx: ${data.nox}`,
      data.pm25 !== undefined && `PM2.5: ${data.pm25}`,
      data.co2 !== undefined && `CO2: ${data.co2}`,
      data.so2 !== undefined && `SO2: ${data.so2}`,
    ]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <>
      <h2>Configuration</h2>

      {/* Vehicle Type */}
      {/* <div className="input-group">
        <h3>Vehicle Type</h3>
        <select
          value={config.vehicle}
          onChange={(e) => setConfig({ ...config, vehicle: e.target.value })}
        >
          <option value="petrol">Petrol</option>
          <option value="ev">EV</option>
        </select>
        <input
          className="greyed"
          type="text"
          value={
            policies
              ? formatPollutants(policies[config.vehicle])
              : config.vehicle
          }
          readOnly
        />
      </div> */}

      {/* Fuel Type */}
      <div className="input-group">
        <h3>Fuel Type</h3>
        <select
          disabled={config.vehicle !== "petrol"}
          value={config.fuel}
          onChange={(e) => setConfig({ ...config, fuel: e.target.value })}
        >
          <option value="regular">Regular</option>
          <option value="low_sulfur">Low Sulfur</option>
        </select>
        <input
          className="greyed"
          type="text"
          value={
            policies ? formatPollutants(policies[config.fuel]) : config.fuel
          }
          readOnly
        />
      </div>

      {/* Speed Control */}
      <div className="input-group">
        <h3>Speed Control</h3>
        <select
          value={config.speed}
          onChange={(e) => setConfig({ ...config, speed: e.target.value })}
        >
          <option value="speed_normal">Normal</option>
          <option value="speed_eco">Eco</option>
        </select>
        <input
          className="greyed"
          type="text"
          value={
            policies ? formatPollutants(policies[config.speed]) : config.speed
          }
          readOnly
        />
      </div>

      {/* Congestion Control */}
      <div className="input-group">
        <h3>Congestion Control</h3>
        <select
          value={config.congestion}
          onChange={(e) => setConfig({ ...config, congestion: e.target.value })}
        >
          <option value="none">None</option>
          <option value="congestion_tax">Congestion Taxed</option>
        </select>
        <input
          className="greyed"
          type="text"
          value={
            policies
              ? formatPollutants(policies[config.congestion])
              : config.congestion
          }
          readOnly
        />
      </div>

      {/* Simulation Cycles */}
      <div className="input-group">
        <h3>Simulation Cycles (Steps taken by AI agents)</h3>
        <select value={cycles} onChange={(e) => setCycles(e.target.value)}>
          {generateOptions(3, 20).map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
        <input className="greyed" type="text" value={cycles} readOnly />
      </div>

      {/* Number of AI Agents */}
      <div className="input-group">
        <h3>Number of Vehicles (Vehicle AI agents)</h3>
        <select value={agents} onChange={(e) => setAgents(e.target.value)}>
          {generateOptions(5, 50).map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
        <input className="greyed" type="text" value={agents} readOnly />
      </div>

      {/* Live JSON preview */}
      <h3>Payload Preview</h3>
      <pre>
        {JSON.stringify(
          {
            config: { ...payload },
            agents,
            cycles,
          },
          null,
          2,
        )}
      </pre>
      <br />
      <button onClick={makePayload} disabled={loading}>
        {loading ? "Running Simulation..." : "Run Simulation"}
      </button>
    </>
  );
};

export default Config;
