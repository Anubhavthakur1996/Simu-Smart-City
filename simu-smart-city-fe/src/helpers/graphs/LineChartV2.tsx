import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";
// import { RechartsDevtools } from "@recharts/devtools";

// #endregion
const LineChartV2 = ({
  isAnimationActive = true,
  data,
  title,
}: {
  isAnimationActive?: boolean;
  data: unknown[];
  title?: string;
}) => {
  return (
    <>
      <h3>{title || "A Line Chart"}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="datetimeUtc"
            tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
            // tickCount={1} // more ticks along the time axis
            // interval={0} // show all ticks
          />
          <YAxis
            tickCount={10} // forces more ticks
            interval={0} // show all ticks
            // domain={[0, "dataMax + 5"]} // custom range
          />
          {/* <Tooltip /> */}
          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleString()}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="co"
            stroke="#f82828"
            isAnimationActive={isAnimationActive}
          />
          <Line
            type="monotone"
            dataKey="so2"
            stroke="#6969f0"
            isAnimationActive={isAnimationActive}
          />
          <Line
            type="monotone"
            dataKey="nox"
            stroke="#73fc73"
            isAnimationActive={isAnimationActive}
          />
          {/* <Line
            type="monotone"
            dataKey="co2"
            stroke="#63edff"
            isAnimationActive={isAnimationActive}
          /> */}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default LineChartV2;
