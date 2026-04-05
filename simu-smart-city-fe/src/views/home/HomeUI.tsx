import Config from "../../components/config";
import LineChartV2 from "../../helpers/graphs/LineChartV2";
import BarChartV2Vehi from "../../helpers/graphs/ChartV2Vehi";
import Loader from "../../assets/loading socks.gif";
import "./HomeUI.scss";

type SplashUIProps = {
  Logo: string;
  runSim: () => void;
  loading: boolean;
  polData?: unknown[];
  emissionData?: unknown[];
  policies?: unknown[];
};

const HomeUI: React.FC<SplashUIProps> = ({
  Logo,
  runSim,
  loading,
  polData,
  emissionData,
  policies,
}) => {
  return (
    <div className="splash-container">
      <div className="top-panel">
        <img className="logo" src={Logo} alt="Logo" />{" "}
        <span className="splash-text">Simulating Smart Cities</span>
      </div>

      {loading ? (
        <div className="loader-container">
          <span className="loading">
            <img alt="loading" src={Loader} height={150} />
            Doing Some AI Woo Doo...
          </span>
        </div>
      ) : (
        <>
          <div className="panel-wrapper">
            <div className="panel">
              {/* baseline Polution chart */}
              {polData &&
                renderChart(
                  "Baseline Pollution Based On Some Random Samples From Sec 22 Data",
                  polData,
                  false,
                )}

              {/* baseline Vehical Emission chart */}
              {emissionData &&
                renderChart(
                  "Average Vehicle Emissions Based On Studies (Rajya Sabha OGD, IIT Roorkee, IISc Bangalore)",
                  emissionData,
                  true,
                )}
            </div>
            <div className="panel">
              <br />
              <Config loading={loading} runSim={runSim} policies={policies} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const renderChart = (
  title: string | undefined,
  data: unknown[],
  change: boolean,
) => {
  if (!change) {
    return <LineChartV2 data={data} title={title} />;
  }

  return (
    <BarChartV2Vehi
      data={data as unknown as Record<string, Record<string, number>>}
      title={title}
    />
  );
};

export default HomeUI;
