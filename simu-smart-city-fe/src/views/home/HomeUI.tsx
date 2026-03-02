import LinePlot from "../../helpers/graphs/LinePlot";
import "./HomeUI.scss";

type SplashUIProps = {
  Logo: string;
  runSim: () => void;
  loading: boolean;
  response?: string | null;
  data?: any;
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
      <img className="logo" src={Logo} alt="Logo" />{" "}
      <text className="splash-text">Simulating Smart Cities</text>
      <button onClick={runSim} disabled={loading}>
        {loading ? "Running Simulation..." : "Run Simulation"}
      </button>
      {response && (
        <textarea
          className="text-area"
          readOnly
          value={JSON.stringify(response, null, 2)}
        />
      )}

      <LinePlot data={data} />
    </div>
  );
};

export default HomeUI;
