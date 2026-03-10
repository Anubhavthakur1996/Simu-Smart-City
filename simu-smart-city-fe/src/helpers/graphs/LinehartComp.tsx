import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";

// #endregion
const LineChartComp = ({
  isAnimationActive = true,
  data,
  title,
}: {
  isAnimationActive?: boolean;
  data: unknown[];
  title?: string;
}) => (
  <>
    <h3>{title || "A Line Chart"}</h3>
    <LineChart
      style={{
        width: "100%",
        maxWidth: "700px",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={data.slice(0, 20)}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="parameter" width="auto" />
      <YAxis dataKey="value" width="auto" />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="value"
        name="AQI Value"
        stroke="#8884d8"
        isAnimationActive={isAnimationActive}
      />
      {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" isAnimationActive={isAnimationActive} /> */}
      <RechartsDevtools />
    </LineChart>
  </>
);

export default LineChartComp;
