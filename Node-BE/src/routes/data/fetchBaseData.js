import { readFile } from "fs/promises";

export const fetchBaseData = async (req, res) => {
  const rawData = await readFile(
    new URL("../../data/emissions.json", import.meta.url),
  );
  const rawPoliciesData = await readFile(
    new URL("../../data/policies.json", import.meta.url),
  );
  const emissions = JSON.parse(rawData);
  const policies = JSON.parse(rawPoliciesData);

  try {
    const response = await fetch("http://127.0.0.1:8000/data");
    const data = await response.json();

    const result = {
      data: data.data,
      emissionData: emissions,
      policies,
    };
    res.json(result);
  } catch (error) {
    console.error("Data fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch initial data" });
  }
};
