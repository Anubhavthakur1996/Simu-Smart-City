// backend-node/src/services/pythonClient.js
import axios from "axios";

export async function runSimulation() {
  const response = await axios.post("http://localhost:8000/simulate");
  return response.data;
}
