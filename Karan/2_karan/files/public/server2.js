import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect("mongodb://127.0.0.1:27017/railwayRoutes", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("MongoDB connected"));

// --- Mongoose Model ---
const routeSchema = new mongoose.Schema({
  trainName: { type: String, required: true },
  plannedRoute: [
    {
      city: String,
      lat: Number,
      lng: Number,
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});
const TrainRoute = mongoose.model("TrainRoute", routeSchema);

// --- API Endpoints ---

// Save or update a route
app.post("/api/trainRoutes", async (req, res) => {
  try {
    const { trainName, plannedRoute } = req.body;
    const route = await TrainRoute.findOneAndUpdate(
      { trainName },
      { plannedRoute, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    res.json(route);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save route" });
  }
});

// Get all routes
app.get("/api/trainRoutes", async (_req, res) => {
  try {
    const routes = await TrainRoute.find();
    res.json(routes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch routes" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
