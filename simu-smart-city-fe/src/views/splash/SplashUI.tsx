import Loading from "../../assets/loading socks.gif";
import "./SplashUI.scss";

type SplashUIProps = {
  Logo: string;
};

const SplashUI: React.FC<SplashUIProps> = ({ Logo }) => {
  return (
    <div className="splash-container">
      <img className="logo" src={Logo} alt="Logo" />{" "}
      <span className="splash-text">Simulating Smart Cities</span>
      <span className="loading">
        <img alt="loading" src={Loading} height={150} />
        Loading data ...
      </span>
    </div>
  );
};

export default SplashUI;
