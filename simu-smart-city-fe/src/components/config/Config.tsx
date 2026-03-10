import "./Config.scss";

const Config = () => {
  return (
    <>
      <h2>Configuration</h2>
      <p>Here you can configure the rules for the simulation</p>
      {/* Vehicle Type */}
      <div className="input-group">
        <h3>Vehicle Type</h3>
        <select>
          <option value="petrol">Petrol</option>
          <option value="ev">EV</option>
        </select>
        <input className="greyed" type="text" />
      </div>

      {/* Fuel Type */}
      <div className="input-group">
        <h3>Fuel Type</h3>
        <select>
          <option value="regular">Regular</option>
          <option value="low_sulfur">Low Sulfur</option>
        </select>
        <input className="greyed" type="text" />
      </div>

      {/* Speed Control */}
      <div className="input-group">
        <h3>Speed Control</h3>
        <select>
          <option value="normal">Normal</option>
          <option value="eco">Eco</option>
        </select>
        <input className="greyed" type="text" />
      </div>

      {/* Congestion Control */}
      <div className="input-group">
        <h3>Congestion Control</h3>
        <select>
          <option value="none">None</option>
          <option value="congestion_tax">Congestion Taxed</option>
        </select>
        <input className="greyed" type="text" />
      </div>

      {/* <button>Add New Config</button> */}
    </>
  );
};

// self.rules = {
//     "EV": {"co2": 0, "co": 0, "nox": 0, "so2": 0, "pm25": 0},   # PM2.5 is often abbreviated as PM25 for simplicity and our dataset has it like that
//     "low_sulfur": {"so2": 0.2},  # multiplier
//     "speed_limit": {"nox": 0.7, "co2": 1.1},  # efficiency trade-off
//     "congestion_tax": {"behavior": "avoid_taxed_zones"}  # not direct emissions
//   }

export default Config;
