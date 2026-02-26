import Axios from "./APIBase";

// type Policy = (
//   policies: string,
//   timesteps: Record<string, any>,
// ) => Promise<any>;

type Policy = () => Promise<any>;

export const runSimulation: Policy = async () => {
  const response = await Axios.post("/run-simulation");
  return response.data;
};
