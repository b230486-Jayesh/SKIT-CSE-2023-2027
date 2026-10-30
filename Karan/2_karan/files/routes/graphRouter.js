import express from "express";
import fs from "fs";
const router = express.Router();
import graphRouter from "./routes/graphRouter.js";
app.use("/api/graph", graphRouter);


// Load graph once
const graph = JSON.parse(fs.readFileSync("./data/rail_network.json", "utf-8"));

// Dijkstra algorithm
function dijkstra(start, end, blockedEdges = []) {
  const dist = {};
  const prev = {};
  const pq = new Set(Object.keys(graph));

  // init
  for (const node in graph) dist[node] = Infinity;
  dist[start] = 0;

  while (pq.size) {
    // find min
    let u = [...pq].reduce((a,b) => dist[a] < dist[b] ? a : b);
    pq.delete(u);
    if (u === end) break;

    for (const edge of graph[u].connections) {
      if (blockedEdges.includes(`${u}-${edge.to}`)) continue; // skip blocked track
      const alt = dist[u] + edge.distanceKm;
      if (alt < dist[edge.to]) {
        dist[edge.to] = alt;
        prev[edge.to] = u;
      }
    }
  }

  // reconstruct path
  const path = [];
  let u = end;
  while (u) {
    path.unshift(u);
    u = prev[u];
  }
  return { distanceKm: dist[end], path };
}

router.post("/plan-route", (req, res) => {
  const { from, to, blocked = [] } = req.body;
  if (!graph[from] || !graph[to]) {
    return res.status(400).json({ error: "Invalid station" });
  }
  const result = dijkstra(from, to, blocked);
  res.json(result);
});

export default router;
