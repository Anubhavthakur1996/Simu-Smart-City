import Axios from "./APIBase";

// type Policy = (
//   policies: string,
//   timesteps: Record<string, any>,
// ) => Promise<any>;

// type Policy = ({ emissionData: any; cycles: number; agents: number; config: any; }) => Promise<any>;

export const runSimulation: Policy = async (payload): Promise<any> => {
  const response = await Axios.post("/run-simulation", {
    payload
  });
  if (response.status !== 200) {
    throw new Error(`Failed to run simulation: ${response.statusText}`);
  }
  return response.data;
};
