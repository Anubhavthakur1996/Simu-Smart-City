import Loader from "../../assets/loading socks.gif";
import "./NewRule.scss";

type SplashUIProps = {
  Logo: string;
  runSim: () => void;
  loading: boolean;
  polData?: unknown[];
  emissionData?: unknown[];
  policies?: unknown[];
  addNew: () => void;
};

const NewRuleUI: React.FC<SplashUIProps> = ({
  Logo,
  loading,
  addNew,
  so2,
  setSo2,
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
            Adding New Rule...
          </span>
        </div>
      ) : (
        <>
          <h2>New Rule</h2>
          <div className="panel-wrapper" style={{ flexWrap: "wrap" }}>
            {/* Fuel Type */}
            <div className="input-group">
              <h3>Fuel Type</h3>
              <input className="rule-input" placeholder="Enter name"></input>
              <>
                {/* SO2 */}
                <div className="pol-row">
                  <h5 className="pol-text">SO2</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>

                {/* NOx */}
                <div className="pol-row">
                  <h5 className="pol-text">NOx</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>

                {/* CO */}
                <div className="pol-row">
                  <h5 className="pol-text">CO</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>

                {/* CO2 */}
                <div className="pol-row">
                  <h5 className="pol-text">CO2</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>

                {/* Pm2.5 */}
                <div className="pol-row">
                  <h5 className="pol-text">Pm2.5</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>

                {/* PM10 */}
                <div className="pol-row">
                  <h5 className="pol-text">PM10</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>
              </>
            </div>
            {/* Speed Control */}
            <div className="input-group">
              <h3>Speed Control</h3>
              <input className="rule-input" placeholder="Enter name"></input>
              <>
                {/* SO2 */}
                <div className="pol-row">
                  <h5 className="pol-text">SO2</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>

                {/* NOx */}
                <div className="pol-row">
                  <h5 className="pol-text">NOx</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>

                {/* CO */}
                <div className="pol-row">
                  <h5 className="pol-text">CO</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>

                {/* CO2 */}
                <div className="pol-row">
                  <h5 className="pol-text">CO2</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>

                {/* Pm2.5 */}
                <div className="pol-row">
                  <h5 className="pol-text">Pm2.5</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>

                {/* PM10 */}
                <div className="pol-row">
                  <h5 className="pol-text">PM10</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>
              </>
            </div>

            {/* Custom Policy */}
            <div className="input-group">
              <h3>Custom Rule</h3>
              <input className="rule-input" placeholder="Enter name"></input>
              <>
                {/* SO2 */}
                <div className="pol-row">
                  <h5 className="pol-text">SO2</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>

                {/* NOx */}
                <div className="pol-row">
                  <h5 className="pol-text">NOx</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>

                {/* CO */}
                <div className="pol-row">
                  <h5 className="pol-text">CO</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>

                {/* CO2 */}
                <div className="pol-row">
                  <h5 className="pol-text">CO2</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>

                {/* Pm2.5 */}
                <div className="pol-row">
                  <h5 className="pol-text">Pm2.5</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>

                {/* PM10 */}
                <div className="pol-row">
                  <h5 className="pol-text">PM10</h5>
                  <input
                    className="pol-val"
                    type="number"
                    placeholder="Enter multiplier(number)"
                  />
                </div>
              </>
            </div>
          </div>
          <button onClick={addNew}>Add New Rule</button>
        </>
      )}
    </div>
  );
};

export default NewRuleUI;
