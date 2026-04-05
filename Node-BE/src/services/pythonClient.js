// backend-node/src/services/pythonClient.js
import axios from "axios";

export async function runSimulation(params) {
  const response = await axios.post("http://localhost:8000/simulate", {
    ...params,
  });
  return response.data;
}
