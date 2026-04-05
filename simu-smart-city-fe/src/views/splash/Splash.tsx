import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { fetchData } from "../../API/fetchData";
import {
  setPolData,
  setEmData,
  setPoliciesData,
} from "../../redux/slices/dataSlice";
import SplashUI from "./SplashUI";
import Logo from "../../assets/logo.png";

const Splash: React.FC = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData()
      .then((result: any) => {
        sessionStorage.setItem("initData", JSON.stringify(result));

        const { data, emissionData, policies } = result;

        dispatch(setPolData(data));
        dispatch(setEmData(emissionData));
        dispatch(setPoliciesData(policies));

        nav("/home");
      })
      .catch(() => {
        alert(`Something went wrong while fetching data!
            Try again later or try contacting the Engineer.
          `);
      });
  }, [dispatch, nav]);

  const props = {
    Logo: Logo,
  };

  return <SplashUI {...props} />;
};

export default Splash;
