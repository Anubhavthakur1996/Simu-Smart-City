import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import HomeUI from "./HomeUI";
import Logo from "../../assets/logo.png";
import { runSimulation } from "../../API/simulation";
import {
  setEmData,
  setPolData,
  setPoliciesData,
  setResults,
} from "../../redux/slices/dataSlice";

const Home: React.FC = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const { polData, emissionData, policies } = useSelector(
    (state: any) => state.data,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    // Only dispatch if Redux state is empty (e.g., after a refresh)
    if (!polData || !emissionData) {
      const data = JSON.parse(sessionStorage.getItem("initData") || "{}");

      if (data.data || data.emissionData) {
        // Defer to the next tick to ensure we aren't mid-reducer
        setTimeout(() => {
          dispatch(setPolData(data.data));
          dispatch(setEmData(data.emissionData));
          dispatch(setPoliciesData(data.policies));
        }, 0);
      }
    }
  }, [dispatch, polData, emissionData]);

  const runSim = (config) => {
    setLoading(true);

    const data = {
      ...config,
      emissionData,
      policies,
    };

    runSimulation(data)
      .then((res) => {
        sessionStorage.setItem("results", JSON.stringify(res.result));
        dispatch(setResults(res.result));
        setLoading(false);

        nav("/result-dashboard");
      })
      .catch(() => {
        alert("Something went wrong while fetching data!");
        setLoading(false);
      });
  };

  const props = {
    Logo,
    runSim,
    loading,
    polData,
    policies,
    emissionData,
  };
  return <HomeUI {...props} />;
};

export default Home;
