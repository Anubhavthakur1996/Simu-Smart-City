import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as d3 from "d3";
import HomeUI from "./HomeUI";
import Logo from "../../assets/logo.png";
import { runSimulation } from "../../API/simulation";

const Home: React.FC = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    d3.csv("../../data/polldata.csv").then((data: any) => {
      setData(data);
    });
  }, [nav, data]);

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
