import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

import type { DashboardUIProps } from "../../types";
import "./Dashboard.scss";

const DashboardUI: React.FC<DashboardUIProps> = ({
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
  fleetCombined,
}) => {
  return (
    <div className="dashboard-wrapper">
      {/* Toggle controls */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={showBaseline}
              onChange={() => setShowBaseline((s) => !s)}
            />
            <span style={{ fontSize: 13 }}>Show baseline</span>
          </label>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={showPolicies}
              onChange={() => setShowPolicies((s) => !s)}
            />
            <span style={{ fontSize: 13 }}>Show policies</span>
          </label>
        </div>

        {/* small percent-change summary */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {Object.entries(percentChange).map(([pollutant, change]) => (
            <div key={pollutant} style={{ ...smallCardStyle, padding: 8 }}>
              <div style={{ fontSize: 12, color: "#666" }}>
                {pollutant.toUpperCase()} change (final)
              </div>
              <div style={{ fontWeight: 600, color: "#666" }}>
                {change == null ? "N/A" : `${change.toFixed(2)}%`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="charts-wrapper">
        {/* Line Chart: PM pollutants */}
        <div style={smallCardStyle}>
          <h3 style={{ margin: ".6em 0", textAlign: "center", color: "black" }}>
            PM pollutants (µg/m³)
          </h3>
          <ResponsiveContainer width={450} height={350}>
            <LineChart
              data={combined}
              margin={{ top: 15, right: 20, bottom: 45, left: 55 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="cycle"
                label={{
                  value: "Simulation Steps",
                  position: "bottom",
                  offset: 15,
                  style: { fontSize: "0.75rem", fill: "#888", fontWeight: 500 },
                }}
              />

              <YAxis
                domain={[33, 42]}
                tickFormatter={(value) => value.toFixed(1)}
                label={{
                  value: "Concentration (µg/m³)",
                  angle: -90,
                  position: "left",
                  offset: 15,
                  style: {
                    textAnchor: "middle",
                    fontSize: "0.75rem",
                    fill: "#888",
                    fontWeight: 500,
                  },
                }}
              />

              <Tooltip />

              <Legend
                verticalAlign="top"
                height={40}
                wrapperStyle={{ paddingBottom: "2rem" }}
              />

              {/* PM2.5 Lines */}
              {showBaseline && (
                <Line
                  type="monotone"
                  dataKey="pm25_base"
                  name="PM2.5 (base)"
                  stroke={COLORS.pm25}
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {showPolicies && (
                <Line
                  type="monotone"
                  dataKey="pm25_pol"
                  name="PM2.5 (pol)"
                  stroke={COLORS.pm25_pol}
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              )}

              {/* PM10 Lines */}
              {showBaseline && (
                <Line
                  type="monotone"
                  dataKey="pm10_base"
                  name="PM10 (base)"
                  stroke={COLORS.pm10}
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {showPolicies && (
                <Line
                  type="monotone"
                  dataKey="pm10_pol"
                  name="PM10 (pol)"
                  stroke={COLORS.pm10_pol}
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart: Gaseous pollutants */}
        <div style={smallCardStyle}>
          <h3 style={{ margin: ".6em 0", textAlign: "center", color: "black" }}>
            Gaseous pollutants (ppb)
          </h3>
          <ResponsiveContainer width={450} height={350}>
            <LineChart
              data={combined}
              margin={{ top: 15, right: 20, bottom: 45, left: 55 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="cycle"
                label={{
                  value: "Simulation Steps",
                  position: "bottom",
                  offset: 15,
                  style: { fontSize: "0.75rem", fill: "#888", fontWeight: 500 },
                }}
              />

              <YAxis
                domain={[0, 60]}
                tickFormatter={(value) => value.toFixed(0)}
                label={{
                  value: "Concentration (ppb)",
                  angle: -90,
                  position: "left",
                  offset: 15,
                  style: {
                    textAnchor: "middle",
                    fontSize: "0.75rem",
                    fill: "#888",
                    fontWeight: 500,
                  },
                }}
              />

              <Tooltip />
              <Legend
                verticalAlign="top"
                height={40}
                wrapperStyle={{ paddingBottom: "2rem" }}
              />

              {/* NOx */}
              {showBaseline && (
                <Line
                  type="monotone"
                  dataKey="nox_base"
                  name="NOx (base)"
                  stroke={COLORS.nox}
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {showPolicies && (
                <Line
                  type="monotone"
                  dataKey="nox_pol"
                  name="NOx (pol)"
                  stroke={COLORS.nox_pol}
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              )}

              {/* SO2 */}
              {showBaseline && (
                <Line
                  type="monotone"
                  dataKey="so2_base"
                  name="SO2 (base)"
                  stroke={COLORS.so2}
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {showPolicies && (
                <Line
                  type="monotone"
                  dataKey="so2_pol"
                  name="SO2 (pol)"
                  stroke={COLORS.so2_pol}
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              )}

              {/* CO */}
              {showBaseline && (
                <Line
                  type="monotone"
                  dataKey="co_base"
                  name="CO (base)"
                  stroke={COLORS.co}
                  strokeWidth={2}
                  dot={false}
                />
              )}
              {showPolicies && (
                <Line
                  type="monotone"
                  dataKey="co_pol"
                  name="CO (pol)"
                  stroke={COLORS.co_pol}
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: focus distribution */}
        <div style={smallCardStyle}>
          <h3 style={{ margin: ".6em 0", textAlign: "center", color: "black" }}>
            Objective focus per cycle
          </h3>
          <ResponsiveContainer width={450} height={350}>
            <BarChart
              data={focusCombined}
              margin={{ top: 15, right: 20, bottom: 45, left: 55 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="cycle"
                interval={0}
                label={{
                  value: "Simulation Cycles",
                  position: "bottom",
                  offset: 15,
                  style: { fontSize: "0.75rem", fill: "#888", fontWeight: 500 },
                }}
              />

              <YAxis
                label={{
                  value: "Objective Score",
                  angle: -90,
                  position: "left",
                  offset: 15,
                  style: {
                    textAnchor: "middle",
                    fontSize: "0.75rem",
                    fill: "#888",
                    fontWeight: 500,
                  },
                }}
              />

              <Tooltip />
              {/* Placed top legend inside standard height box for error-free tracking */}
              <Legend
                verticalAlign="top"
                height={40}
                wrapperStyle={{ paddingBottom: "3rem" }}
              />

              {/* Baseline Stacks */}
              {showBaseline && (
                <Bar
                  dataKey="mobility_base"
                  name="Mobility (base)"
                  stackId="a"
                  fill="#8884d8"
                />
              )}
              {showBaseline && (
                <Bar
                  dataKey="emission_base"
                  name="Emission (base)"
                  stackId="a"
                  fill="#82ca9d"
                />
              )}
              {showBaseline && (
                <Bar
                  dataKey="congestion_base"
                  name="Congestion (base)"
                  stackId="a"
                  fill="#ffc658"
                />
              )}

              {/* Policy Stacks */}
              {showPolicies && (
                <Bar
                  dataKey="mobility_pol"
                  name="Mobility (pol)"
                  stackId="b"
                  fill="#5148ff"
                  fillOpacity={0.35}
                />
              )}
              {showPolicies && (
                <Bar
                  dataKey="emission_pol"
                  name="Emission (pol)"
                  stackId="b"
                  fill="#09ff67"
                  fillOpacity={0.35}
                />
              )}
              {showPolicies && (
                <Bar
                  dataKey="congestion_pol"
                  name="Congestion (pol)"
                  stackId="b"
                  fill="#ffaa00"
                  fillOpacity={0.35}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scatter Chart: agent positions */}
        <div style={smallCardStyle}>
          <h3 style={{ margin: ".6em 0", textAlign: "center", color: "black" }}>
            Agent positions (grid)
          </h3>
          <ResponsiveContainer width={450} height={350}>
            <ScatterChart margin={{ top: 15, right: 20, bottom: 45, left: 55 }}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                type="number"
                dataKey="x"
                name="X Position"
                label={{
                  value: "Horizontal Position (East-West)",
                  position: "bottom", // Changed from insideBottom to bottom
                  offset: 15, // Safe positive offset
                  style: { fontSize: "0.75rem", fill: "#888", fontWeight: 500 },
                }}
              />

              <YAxis
                type="number"
                dataKey="y"
                name="Y Position"
                // REMOVED: interval={0}
                label={{
                  value: "Vertical Position (North-South)",
                  angle: -90,
                  position: "left", // Changed from insideLeft to left
                  offset: 15, // Safe positive offset
                  style: {
                    textAnchor: "middle",
                    fontSize: "0.75rem",
                    fill: "#888",
                    fontWeight: 500,
                  },
                }}
              />

              <ZAxis
                dataKey="reward"
                range={[20, 100]}
                name="Agent Reward"
                unit=" pts"
              />

              <Tooltip cursor={{ strokeDasharray: "3 3" }} />

              <Legend verticalAlign="top" height={40} />

              {showBaseline && (
                <Scatter
                  name="Baseline"
                  data={scatterBase}
                  fill={COLORS.baseline}
                />
              )}
              {showPolicies && (
                <Scatter
                  name="With Policies"
                  data={scatterPol}
                  fill={COLORS.policies}
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart: actions & avg reward */}
        <div style={smallCardStyle}>
          <h3 style={{ margin: ".6em 0", textAlign: "center", color: "black" }}>
            Action distribution & average reward
          </h3>
          <ResponsiveContainer width={450} height={350}>
            {/* Explicit chart margins matching the baseline grid bounds layout */}
            <RadarChart
              cx="50%"
              cy="53%" // Pushed down slightly to give the top legend breathing room
              outerRadius="70%" // Slightly reduced to prevent long metric labels from clipping out of bounds
              data={radarData}
              margin={{ top: 15, right: 20, bottom: 20, left: 20 }}
            >
              <PolarGrid />

              {/* Dynamic relative typography applied to the outermost text labels */}
              {/* For normalised data */}
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fontSize: "0.75rem", fill: "#888", fontWeight: 500 }}
              />

              {/* For raw regular data */}
              {/* <PolarAngleAxis
                dataKey="metric"
                tickFormatter={(value) => {
                  // Map your raw backend metric keys to clean presentation labels
                  const labels = {
                    moves: "Total Moves",
                    reroutes: "Reroutes",
                    stops: "Stops / Idles",
                    avg_reward: "Avg Reward",
                  };
                  return labels[value] || value;
                }}
                tick={{ fontSize: "0.75rem", fill: "#888", fontWeight: 500 }}
              /> */}

              {/* Dynamic typography applied to the inner scaling rings */}
              <PolarRadiusAxis tick={{ fontSize: "0.7rem", fill: "#bbb" }} />

              <Legend verticalAlign="top" height={40} />

              {/* For normalized data */}
              <Tooltip
                formatter={(value, name, props) => {
                  const isBase = name === "Baseline";
                  const rawVal = isBase
                    ? props.payload.rawBaseline
                    : props.payload.rawPolicies;
                  return [`${rawVal}`, name];
                }}
              />

              {/* For regular data */}
              {/* <Tooltip /> */}

              {showBaseline && (
                <Radar
                  name="Baseline"
                  dataKey="baseline"
                  stroke={COLORS.baseline}
                  fill={COLORS.baseline}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              )}
              {showPolicies && (
                <Radar
                  name="With Policies"
                  dataKey="policies"
                  stroke={COLORS.policies}
                  fill={COLORS.policies}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              )}
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: fleet composition */}
        <div style={smallCardStyle}>
          <h3 style={{ margin: ".6em 0", textAlign: "center", color: "black" }}>
            Fleet composition per cycle
          </h3>
          <ResponsiveContainer width={450} height={350}>
            <BarChart
              data={fleetCombined}
              margin={{ top: 40, right: 20, bottom: 45, left: 55 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="cycle"
                interval={0}
                tick={{ fontSize: "0.7rem", fill: "#666" }}
                label={{
                  value: "Simulation Cycles",
                  position: "bottom",
                  offset: 15,
                  style: { fontSize: "0.75rem", fill: "#888", fontWeight: 500 },
                }}
              />

              <YAxis
                tick={{ fontSize: "0.7rem", fill: "#666" }}
                label={{
                  value: "Number of Vehicles",
                  angle: -90,
                  position: "left",
                  offset: 15,
                  style: {
                    textAnchor: "middle",
                    fontSize: "0.75rem",
                    fill: "#888",
                    fontWeight: 500,
                  },
                }}
              />

              <Tooltip />

              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={{ top: 5, fontSize: "0.75rem" }}
              />

              {showBaseline && (
                <Bar
                  dataKey="petrol_base"
                  name="Petrol (base)"
                  stackId="a"
                  fill={COLORS.fleet_petrol || "#ff7f0e"}
                />
              )}
              {showBaseline && (
                <Bar
                  dataKey="diesel_base"
                  name="Diesel (base)"
                  stackId="a"
                  fill={COLORS.fleet_diesel || "#1f77b4"}
                />
              )}
              {showBaseline && (
                <Bar
                  dataKey="cng_base"
                  name="CNG (base)"
                  stackId="a"
                  fill={COLORS.fleet_cng || "#2ca02c"}
                />
              )}
              {showBaseline && (
                <Bar
                  dataKey="ev_base"
                  name="EV (base)"
                  stackId="a"
                  fill={COLORS.fleet_ev || "#9467bd"}
                />
              )}

              {showPolicies && (
                <Bar
                  dataKey="petrol_pol"
                  name="Petrol (pol)"
                  stackId="b"
                  fill={COLORS.fleet_petrol || "#ff7700"}
                  fillOpacity={0.35}
                />
              )}
              {showPolicies && (
                <Bar
                  dataKey="diesel_pol"
                  name="Diesel (pol)"
                  stackId="b"
                  fill={COLORS.fleet_diesel || "#0060a5"}
                  fillOpacity={0.35}
                />
              )}
              {showPolicies && (
                <Bar
                  dataKey="cng_pol"
                  name="CNG (pol)"
                  stackId="b"
                  fill={COLORS.fleet_cng || "#00a300"}
                  fillOpacity={0.35}
                />
              )}
              {showPolicies && (
                <Bar
                  dataKey="ev_pol"
                  name="EV (pol)"
                  stackId="b"
                  fill={COLORS.fleet_ev || "#5c00b3"}
                  fillOpacity={0.35}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;
