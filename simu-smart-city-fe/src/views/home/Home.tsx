import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import HomeUI from "./HomeUI";
import Logo from "../../assets/logo.png";
import { runSimulation } from "../../API/simulation";

import synthData from "../../data/synthetic_aqi.json";

const Home: React.FC = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [data, setData] = useState<unknown[]>(synthData);


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
    data,
  };
  return <HomeUI {...props} />;
};

export default Home;
