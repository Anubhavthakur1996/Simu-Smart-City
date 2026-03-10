import Config from "../../components/config";
import LineChartComp from "../../helpers/graphs/LinehartComp";
// import PieChartComp from "../../helpers/graphs/PieChartComp";
import "./HomeUI.scss";

type SplashUIProps = {
  Logo: string;
  runSim: () => void;
  loading: boolean;
  response?: string | null;
  data?: unknown[];
};

const HomeUI: React.FC<SplashUIProps> = ({
  Logo,
  runSim,
  loading,
  response,
  data,
}) => {
  return (
    <div className="splash-container">
      <div className="top-panel">
        <img className="logo" src={Logo} alt="Logo" />{" "}
        <text className="splash-text">Simulating Smart Cities</text>
      </div>
      <div className="panel-wrapper">
        <div className="panel">
          {data && (
            <LineChartComp
              data={data}
              title="Baseline Emissions Based on Available Data (20 Samples)"
            />
          )}

          {/* {data && <PieChartComp data={data} />} */}
        </div>
        <div className="panel">
          <br />
          <Config />
          <br />
          <button onClick={runSim} disabled={loading}>
            {loading ? "Running Simulation..." : "Run Simulation"}
          </button>
        </div>
      </div>
      {response && (
        <>
          <h3>Simulation Response</h3>
          <textarea
            className="text-area"
            readOnly
            value={JSON.stringify(response, null, 2)}
          />
        </>
      )}
    </div>
  );
};

export default HomeUI;
