import "./SplashUI.scss";

type SplashUIProps = {
  Logo: string;
};

const SplashUI: React.FC<SplashUIProps> = ({ Logo }) => {
  return (
    <div className="splash-container">
      <img className="logo" src={Logo} alt="Logo" />{" "}
      <text className="splash-text">Simulating Smart Cities</text>
    </div>
  );
};

export default SplashUI;
