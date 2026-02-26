"use strict";
const express = require("express");
const cors = require("cors");

const { runSimulation } = require("./src/services/pythonClient");

// Create the express app
const app = express();

// Enable CORS for all routes and all origins
app.use(cors());

// Routes and middleware
// app.use(/* ... */)

// /api/run-simulation
app.post("/api/run-simulation", async (req, res) => {
  try {
    // const policyConfig = req.body.policies;
    // const timesteps = req.body.timesteps || 10;
    const result = await runSimulation();
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
