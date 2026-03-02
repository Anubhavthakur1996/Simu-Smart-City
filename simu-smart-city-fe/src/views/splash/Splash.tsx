import { useEffect } from "react";
import { useNavigate } from "react-router";
import SplashUI from "./SplashUI";
import Logo from "../../assets/logo.png";

const Splash: React.FC = () => {
  const nav = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      nav("/home");
    }, 1000);
  }, [nav]);

  const props = {
    Logo: Logo,
  };
  return <SplashUI {...props} />;
};

export default Splash;
