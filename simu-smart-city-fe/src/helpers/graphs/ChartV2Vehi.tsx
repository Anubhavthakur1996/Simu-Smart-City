import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
  Pie,
  PieChart,
  LabelList,
  Sector,
  type LabelProps,
  type PieSectorShapeProps,
} from "recharts";
// import { RechartsDevtools } from "@recharts/devtools";

// #endregion
const ChartV2Vehi = ({
  data,
  title,
}: {
  data: Record<string, Record<string, number>>;
  title?: string;
}) => {
  // 1. Transform: Extract keys from the first available fuel type
  const pollutantKeys = data.petrol ? Object.keys(data.petrol) : [];

  // Normalize PM pollutants from mg/km → g/km
  const chartData = pollutantKeys.map((key) => {
    const normalize = (val: number | undefined) => {
      if (!val) return 0;
      return key.toLowerCase().includes("pm") ? val / 1000 : val;
    };

    return {
      name: key.toUpperCase(),
      petrol: normalize(data.petrol?.[key]),
      diesel: normalize(data.diesel?.[key]),
      cng: normalize(data.cng?.[key]),
      ev: normalize(data.ev?.[key]),
    };
  });

  // Split into CO2 vs other pollutants
  const co2Data = chartData.filter((d) => d.name === "CO2");
  const traceData = chartData.filter((d) => d.name !== "CO2");

  const COLORS = ["#4E79A7", "#F28E2B", "#76B7B2", "#E15759"];

  // Custom sector renderer
  const MyCustomPie = (props: PieSectorShapeProps) => (
    <Sector {...props} fill={COLORS[props.index ?? 0]} />
  );

  // Custom label renderer
  const MyCustomLabel = (props: LabelProps) => (
    <text
      x={props.x}
      y={props.y}
      dy={props.dy}
      dx={props.dx}
      textAnchor={props.textAnchor}
      fill={COLORS[(props.index ?? 0) % COLORS.length]}
    >
      {`${props.value} g/km`}
    </text>
  );

  return (
    <>
      <h3>{title || "Emission Comparison"}</h3>
      <ResponsiveContainer width="100%" height={400}>
        {/* Chart 1: CO2 only */}
        {/* <ResponsiveContainer width="100%" height={300}>
          <BarChart data={co2Data} margin={{ top: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{ value: "g/km", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="petrol" fill="#8884d8" name="Petrol" />
            <Bar dataKey="diesel" fill="#82ca9d" name="Diesel" />
            <Bar dataKey="cng" fill="#ffc658" name="CNG" />
            <Bar dataKey="ev" fill="#00C49F" name="EV" />
          </BarChart>
        </ResponsiveContainer> */}

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: "Petrol", value: co2Data[0].petrol },
                { name: "Diesel", value: co2Data[0].diesel },
                { name: "CNG", value: co2Data[0].cng },
                { name: "EV", value: co2Data[0].ev },
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              shape={MyCustomPie}
              isAnimationActive={true}
              label={({ name, value }) => `${name}: ${value.toFixed(1)} g/km`}
            >
              <LabelList
                content={MyCustomLabel}
                position="outside"
                offset={12}
              />
            </Pie>
            <Tooltip formatter={(val: number) => `${val.toFixed(2)} g/km`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {/* Chart 2: Trace pollutants */}
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={traceData}
            margin={{ top: 20, bottom: 40 }}
            barCategoryGap="30%"
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{
                value: "g/km (normalized)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="petrol" fill="#8884d8" name="Petrol" />
            <Bar dataKey="diesel" fill="#82ca9d" name="Diesel" />
            <Bar dataKey="cng" fill="#ffc658" name="CNG" />
            <Bar dataKey="ev" fill="#00C49F" name="EV" />
          </BarChart>
        </ResponsiveContainer>
      </ResponsiveContainer>
    </>
  );
};

export default ChartV2Vehi;
