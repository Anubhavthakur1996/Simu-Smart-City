import Axios from "./APIBase";

type Policy = () => Promise<unknown>;

export const fetchData: Policy = async () => {
  const response = await Axios.get("/data");
  if (response.status !== 200) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  return response.data;
};
