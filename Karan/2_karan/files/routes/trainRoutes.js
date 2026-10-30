import express from "express";
import TrainRoute from "../src/models/TrainRoute.js";

const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const { trainName, plannedRoute } = req.body;
    const newRoute = new TrainRoute({ trainName, plannedRoute });
    await newRoute.save();
    res.status(201).json({ message: "Route saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save route" });
  }
});

// optional GET to list saved routes
router.get("/", async (_req, res) => {
  const routes = await TrainRoute.find().sort({ createdAt: -1 });
  res.json(routes);
});

export default router;
