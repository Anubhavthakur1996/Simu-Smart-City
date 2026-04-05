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
              <div style={{ fontWeight: 600 }}>
                {change == null ? "N/A" : `${change.toFixed(2)}%`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="charts-wrapper">
        {/* Line Chart: PM pollutants */}
        <div style={smallCardStyle}>
          <h4 style={{ margin: ".6em 0" }}>PM pollutants (µg/m³)</h4>
          <ResponsiveContainer width={450} height={350}>
            <LineChart data={combined} margin={{ top: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="cycle"
                label={{
                  value: "Steps",
                  position: "insideBottom",
                  offset: -20,
                }}
              />
              <YAxis
                label={{
                  value: "µg/m³",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              <Tooltip />
              <Legend verticalAlign="top" align="center" height={50} />

              {/* PM2.5 */}
              {showBaseline && (
                <Line
                  type="monotone"
                  dataKey="pm25_base"
                  name="PM2.5 (base)"
                  stroke={COLORS.pm25}
                  dot={false}
                />
              )}
              {showPolicies && (
                <Line
                  type="monotone"
                  dataKey="pm25_pol"
                  name="PM2.5 (pol)"
                  stroke={COLORS.policies}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}

              {/* PM10 */}
              {showBaseline && (
                <Line
                  type="monotone"
                  dataKey="pm10_base"
                  name="PM10 (base)"
                  stroke={COLORS.pm10}
                  dot={false}
                />
              )}
              {showPolicies && (
                <Line
                  type="monotone"
                  dataKey="pm10_pol"
                  name="PM10 (pol)"
                  stroke={COLORS.pm10}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart: Gaseous pollutants */}
        <div style={smallCardStyle}>
          <h4 style={{ margin: ".6em 0" }}>Gaseous pollutants (ppb)</h4>
          <ResponsiveContainer width={450} height={350}>
            <LineChart data={combined} margin={{ top: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="cycle"
                label={{
                  value: "Steps",
                  position: "insideBottom",
                  offset: -20,
                }}
              />
              <YAxis
                label={{
                  value: "ppb",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              <Tooltip />
              <Legend verticalAlign="top" align="center" height={50} />

              {/* NOx */}
              {showBaseline && (
                <Line
                  type="monotone"
                  dataKey="nox_base"
                  name="NOx (base)"
                  stroke={COLORS.nox}
                  dot={false}
                />
              )}
              {showPolicies && (
                <Line
                  type="monotone"
                  dataKey="nox_pol"
                  name="NOx (pol)"
                  stroke="#2ca02c"
                  strokeDasharray="5 5"
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
                  dot={false}
                />
              )}
              {showPolicies && (
                <Line
                  type="monotone"
                  dataKey="so2_pol"
                  name="SO2 (pol)"
                  stroke="#ffbb28"
                  strokeDasharray="5 5"
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
                  dot={false}
                />
              )}
              {showPolicies && (
                <Line
                  type="monotone"
                  dataKey="co_pol"
                  name="CO (pol)"
                  stroke="#d62728"
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: focus distribution */}
        <div style={smallCardStyle}>
          <h4 style={{ margin: ".6em 0" }}>Objective focus per cycle</h4>
          <ResponsiveContainer width={450} height={350}>
            <BarChart data={focusCombined} margin={{ top: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cycle" interval={0} />
              <YAxis interval={0} />
              <Tooltip />
              <Legend />
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
              {showPolicies && (
                <Bar
                  dataKey="mobility_pol"
                  name="Mobility (pol)"
                  stackId="b"
                  fill="#8884d8"
                  fillOpacity={0.35}
                />
              )}
              {showPolicies && (
                <Bar
                  dataKey="emission_pol"
                  name="Emission (pol)"
                  stackId="b"
                  fill="#82ca9d"
                  fillOpacity={0.35}
                />
              )}
              {showPolicies && (
                <Bar
                  dataKey="congestion_pol"
                  name="Congestion (pol)"
                  stackId="b"
                  fill="#ffc658"
                  fillOpacity={0.35}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scatter Chart: agent positions */}
        <div style={smallCardStyle}>
          <h4 style={{ margin: ".6em 0" }}>Agent positions (grid)</h4>
          <ResponsiveContainer width={450} height={350}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="X" interval={0} />
              <YAxis type="number" dataKey="y" name="Y" interval={0} />
              <ZAxis dataKey="reward" range={[60, 400]} name="reward" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
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
          <h4 style={{ margin: ".6em 0" }}>
            Action distribution & average reward
          </h4>
          <ResponsiveContainer width={450} height={350}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis />
              {showBaseline && (
                <Radar
                  name="Baseline"
                  dataKey="baseline"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.4}
                />
              )}
              {showPolicies && (
                <Radar
                  name="With Policies"
                  dataKey="policies"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.4}
                />
              )}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: fleet composition */}
        <div style={smallCardStyle}>
          <h4 style={{ margin: ".6em 0" }}>Fleet composition per cycle</h4>
          <ResponsiveContainer width={450} height={350}>
            <BarChart data={fleetCombined} margin={{ top: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cycle" interval={0} />
              <YAxis interval={0} />
              <Tooltip />
              <Legend />
              {showBaseline && (
                <>
                  <Bar
                    dataKey="petrol_base"
                    name="Petrol (base)"
                    stackId="a"
                    fill="#ff7f0e"
                  />
                  <Bar
                    dataKey="diesel_base"
                    name="Diesel (base)"
                    stackId="a"
                    fill="#1f77b4"
                  />
                  <Bar
                    dataKey="cng_base"
                    name="CNG (base)"
                    stackId="a"
                    fill="#2ca02c"
                  />
                  <Bar
                    dataKey="ev_base"
                    name="EV (base)"
                    stackId="a"
                    fill="#9467bd"
                  />
                </>
              )}
              {showPolicies && (
                <>
                  <Bar
                    dataKey="petrol_pol"
                    name="Petrol (pol)"
                    stackId="b"
                    fill="#ff7f0e"
                    fillOpacity={0.35}
                  />
                  <Bar
                    dataKey="diesel_pol"
                    name="Diesel (pol)"
                    stackId="b"
                    fill="#1f77b4"
                    fillOpacity={0.35}
                  />
                  <Bar
                    dataKey="cng_pol"
                    name="CNG (pol)"
                    stackId="b"
                    fill="#2ca02c"
                    fillOpacity={0.35}
                  />
                  <Bar
                    dataKey="ev_pol"
                    name="EV (pol)"
                    stackId="b"
                    fill="#9467bd"
                    fillOpacity={0.35}
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;
