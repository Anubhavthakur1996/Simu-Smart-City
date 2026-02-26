import { useState } from "react";
import { useNavigate } from "react-router";
import HomeUI from "./HomeUI";
import Logo from "../../assets/logo.png";
import { runSimulation } from "../../API/simulation";

const Home: React.FC = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const runSim = () => {
    setLoading(true);
    runSimulation().then((res) => {
      setResponse(res.Result);
      setLoading(false);
    });
  };

  const props = {
    Logo,
    runSim,
    loading,
    response,
  };
  return <HomeUI {...props} />;
};

export default Home;
