import mongoose from "mongoose";

const routePointSchema = new mongoose.Schema({
  city: { type: String, required: true },
  lat: Number,
  lng: Number,
  time: { type: Date, default: Date.now }
});

const trainRouteSchema = new mongoose.Schema({
  trainName: { type: String, required: true },
  plannedRoute: [routePointSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("TrainRoute", trainRouteSchema);
