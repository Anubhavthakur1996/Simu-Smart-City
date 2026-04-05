"use strict";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { runSimulation } = require("./src/services/pythonClient");
const { fetchBaseData } = require("./src/routes/data/fetchBaseData");

// Create the express app
const app = express();

// Enable CORS for all routes and all origins
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());

// Routes and middleware
// app.use(/* ... */)

/** Data Paths */
// Fetech initial data (/api/data)
app.get("/api/data", fetchBaseData);

/** Simulation Paths */
// Run simulation (/api/run-simulation)
app.post("/api/run-simulation", async (req, res) => {
  try {
    // const policyConfig = req.body.policies;
    // const timesteps = req.body.timesteps || 10;

    const result = await runSimulation(req.body.payload);
    res.json(result);
  } catch (error) {
    console.error("Simulation error:", error.message);
    res.status(500).json({ error: "Simulation failed" });
  }
});

// Error handlers
app.use(function fourOhFourHandler(req, res) {
  res.status(404).send();
});
app.use(function fiveHundredHandler(err, req, res, next) {
  console.error(err);
  res.status(500).send();
});

// Start server
app.listen(1234, function (err) {
  if (err) {
    return console.error(err);
  }

  console.log("Started at http://localhost:1234");
});
