import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation } from "react-router-dom";

/* ---------- Initial Graph & Coordinates ---------- */
const initialGraph = {
  Delhi: { Jaipur: 270, Lucknow: 500 },
  Jaipur: { Delhi: 270, Bhopal: 590, Indore: 620 },
  Lucknow: { Delhi: 500, Varanasi: 320, Bhopal: 780 },
  Varanasi: { Lucknow: 320, Bhopal: 700 },
  Bhopal: { Jaipur: 590, Lucknow: 780, Varanasi: 700, Indore: 190 },
  Indore: { Jaipur: 620, Bhopal: 190 },
};

const initialCoords = {
  Delhi: [28.6139, 77.209],
  Jaipur: [26.9124, 75.7873],
  Lucknow: [26.8467, 80.9462],
  Varanasi: [25.3176, 82.9739],
  Bhopal: [23.2599, 77.4126],
  Indore: [22.7196, 75.8577],
};

/* ---------- Dijkstra ---------- */
function dijkstra(graph, start, end, blockedCities = [], blockedEdges = []) {
  const dist = {}, prev = {}, nodes = new Set(Object.keys(graph));
  Object.keys(graph).forEach(c => (dist[c] = Infinity));
  dist[start] = 0;

  while (nodes.size) {
    const u = [...nodes].reduce((a, b) => (dist[a] < dist[b] ? a : b));
    nodes.delete(u);
    if (u === end) break;
    if (blockedCities.includes(u)) continue;

    for (const [v, w] of Object.entries(graph[u] || {})) {
      if (blockedCities.includes(v)) continue;
      const key = [u, v].sort().join("-");
      if (blockedEdges.includes(key)) continue;
      const alt = dist[u] + w;
      if (alt < dist[v]) { dist[v] = alt; prev[v] = u; }
    }
  }

  const path = [];
  for (let u = end; u; u = prev[u]) path.unshift(u);
  return dist[end] === Infinity
    ? { distance: null, path: [] }
    : { distance: dist[end], path };
}

export default function Root() {
  const { state } = useLocation();
  const train = state?.train;

  const [graph, setGraph] = useState(initialGraph);
  const [coords, setCoords] = useState(initialCoords);

  const [start, setStart] = useState("Delhi");
  const [end, setEnd] = useState("Indore");

  const [blockedCities, setBlockedCities] = useState([]);
  const [blockedEdges, setBlockedEdges] = useState([]);
  const [edgeInput, setEdgeInput] = useState("");

  const [result, setResult] = useState(null);
  const [plannedRoute, setPlannedRoute] = useState(train?.route || []);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (train?.route) setPlannedRoute(train.route);
  }, [train]);

  /* ---------- Planned Route ---------- */
  const addStation = () => {
    if (selectedCity && !plannedRoute.includes(selectedCity)) {
      setPlannedRoute(prev => [...prev, selectedCity]);
    }
  };
  const removeStation = c =>
    setPlannedRoute(prev => prev.filter(x => x !== c));

  const runRoute = () => {
    setResult(dijkstra(graph, start, end, blockedCities, blockedEdges));
  };

  const toggleBlockedCity = c =>
    setBlockedCities(p =>
      p.includes(c) ? p.filter(x => x !== c) : [...p, c]
    );

  const addBlockedEdge = () => {
    const parts = edgeInput.split("-").map(s => s.trim());
    if (parts.length !== 2 || !graph[parts[0]] || !graph[parts[1]]) {
      alert("Format: City1-City2 with valid cities");
      return;
    }
    const key = parts.sort().join("-");
    setBlockedEdges(p => (p.includes(key) ? p : [...p, key]));
    setEdgeInput("");
  };
  const removeBlockedEdge = k =>
    setBlockedEdges(p => p.filter(x => x !== k));

  /* ---------- Add New City with Geocoding ---------- */
  const [newCity, setNewCity] = useState("");
  const [connections, setConnections] = useState("");
  const [loadingCity, setLoadingCity] = useState(false);

  const addCity = async () => {
    if (!newCity.trim()) return;

    // Parse connections "Delhi:300,Jaipur:200"
    const conns = {};
    connections.split(",").forEach(pair => {
      const [c, d] = pair.split(":").map(s => s.trim());
      if (c && d && graph[c]) conns[c] = parseFloat(d);
    });
    if (!Object.keys(conns).length) {
      alert("Add at least one valid connection");
      return;
    }

    setLoadingCity(true);
    try {
      // Geocode the city
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          newCity
        )}`
      );
      const data = await resp.json();
      if (!data[0]) {
        alert("❌ Location not found");
        return;
      }
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      // Update graph and coords
      setGraph(prev => {
        const g = { ...prev, [newCity]: conns };
        for (const [c, dist] of Object.entries(conns)) {
          g[c] = { ...g[c], [newCity]: dist };
        }
        return g;
      });
      setCoords(prev => ({ ...prev, [newCity]: [lat, lon] }));

      setNewCity("");
      setConnections("");
    } catch (e) {
      console.error(e);
      alert("Error fetching location");
    } finally {
      setLoadingCity(false);
    }
  };

  /* ---------- Save Route with Duplicate Check ---------- */
  const savePlannedRoute = (routeToSave = plannedRoute) => {
    if (!train || routeToSave.length === 0) return;

    const newPath = routeToSave.join("->");
    const stored = JSON.parse(localStorage.getItem("trainRoutes") || "[]");
    const duplicate = stored.find(
      r =>
        r.trainName !== train.name &&
        r.plannedRoute.map(p => p.city).join("->") === newPath
    );
    if (duplicate) {
      alert(
        `⚠️ Conflict: Train "${duplicate.trainName}" already uses this route.\n` +
          `Please compute an alternate path.`
      );
      return;
    }

    const routePoints = routeToSave
      .filter(c => coords[c])
      .map(c => ({ city: c, lat: coords[c][0], lng: coords[c][1] }));

    const newRoutes = [
      ...stored.filter(r => r.trainName !== train.name),
      { trainName: train.name, plannedRoute: routePoints },
    ];
    localStorage.setItem("trainRoutes", JSON.stringify(newRoutes));
    alert("✅ Route saved successfully!");
  };

  /* ---------- Map Data ---------- */
  const cityList = Object.keys(graph);
  const plannedPositions =
    plannedRoute.length > 1
      ? plannedRoute.map(c => coords[c]).filter(Boolean)
      : [];
  const suggestedPositions =
    result?.path?.length > 1
      ? result.path.map(c => coords[c]).filter(Boolean)
      : [];

  return (
    <div className="flex flex-col md:flex-row bg-slate-600 min-h-screen text-white">
      {/* ===== Map ===== */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Dynamic Railway Route Optimizer</h1>
        <MapContainer center={[25.5, 78]} zoom={6} className="h-[500px] w-full rounded-lg">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {Object.entries(coords).map(([city, c]) => (
            <Marker key={city} position={c}>
              <Popup>{city}</Popup>
            </Marker>
          ))}
          {plannedPositions.length > 1 && (
            <Polyline positions={plannedPositions} color="red" />
          )}
          {suggestedPositions.length > 1 && (
            <Polyline positions={suggestedPositions} color="blue" dashArray="6 6" />
          )}
        </MapContainer>
      </div>

      {/* ===== Sidebar ===== */}
      <div className="w-full md:w-96 bg-gray-900 p-4 overflow-y-auto">
        {train && (
          <>
            <h2 className="text-xl font-semibold mb-2">Train: {train.name}</h2>
            <h3 className="font-semibold">Planned Stations</h3>
            <ul className="mb-3">
              {plannedRoute.map((c, idx) => (
                <li key={idx} className="flex justify-between bg-gray-700 px-2 py-1 rounded my-1">
                  {idx + 1}. {c}
                  <button
                    onClick={() => removeStation(c)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mb-3">
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="text-black bg-white p-1 rounded flex-1"
              >
                <option value="">Add Station…</option>
                {cityList.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                onClick={addStation}
                className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </>
        )}

        {/* Compute Safe Route */}
        <div className="my-4 border-t border-gray-900 pt-3">
          <p className="font-semibold mb-1">Compute Safe Route</p>
          <div className="flex flex-wrap gap-2 mb-2">
            <select value={start} onChange={e => setStart(e.target.value)} className="text-black p-1 bg-white">
              {cityList.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={end} onChange={e => setEnd(e.target.value)} className="text-black p-1 bg-white">
              {cityList.map(c => <option key={c}>{c}</option>)}
            </select>
            <button onClick={runRoute} className="bg-green-600 px-3 py-1 rounded">
              Compute
            </button>
          </div>
          {result &&
            (result.distance !== null ? (
              <>
                <p>Distance: {result.distance} km<br />Path: {result.path.join(" → ")}</p>
                <button
                  onClick={() => savePlannedRoute(result.path)}
                  className="mt-2 bg-emerald-600 px-3 py-1 rounded hover:bg-emerald-700"
                >
                  Save Suggested Path
                </button>
              </>
            ) : (
              <p className="text-red-400">No safe path</p>
            ))}
        </div>

        {/* Block Cities */}
        <div className="mb-4">
          <p className="font-semibold mb-1">Block / Unblock Cities:</p>
          <div className="flex flex-wrap gap-2">
            {cityList.map(c => (
              <button
                key={c}
                onClick={() => toggleBlockedCity(c)}
                className={`px-2 py-1 rounded border ${
                  blockedCities.includes(c)
                    ? "bg-red-500 text-white"
                    : "bg-green-200 text-black"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Block Edges */}
        <div className="mb-4">
          <p className="font-semibold">Block Edge (City1-City2):</p>
          <input
            className="text-black bg-white p-1 mr-2"
            placeholder="City1-City2"
            value={edgeInput}
            onChange={e => setEdgeInput(e.target.value)}
          />
          <button onClick={addBlockedEdge} className="bg-red-600 text-white px-3 py-1 rounded">
            Add
          </button>
          <div className="mt-2 flex flex-wrap gap-2">
            {blockedEdges.map(k => (
              <span key={k} className="bg-red-200 px-2 py-1 rounded text-black">
                {k}
                <button
                  onClick={() => removeBlockedEdge(k)}
                  className="ml-1 text-blue-700 text-xs"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Add New City */}
        <div className="mb-4">
          <p className="font-semibold">Add New City</p>
          <input
            className="text-black bg-white p-1 mr-2 mb-2"
            placeholder="City Name"
            value={newCity}
            onChange={e => setNewCity(e.target.value)}
          />
          <input
            className="text-black bg-white p-1 mr-2 mb-2"
            placeholder="Connections e.g. Delhi:300,Jaipur:200"
            value={connections}
            onChange={e => setConnections(e.target.value)}
          />
          <button
            onClick={addCity}
            disabled={loadingCity}
            className="bg-purple-600 px-3 py-1 rounded"
          >
            {loadingCity ? "Adding..." : "Add City"}
          </button>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => savePlannedRoute()}
              className="bg-emerald-600 px-3 py-1 rounded hover:bg-emerald-700"
            >
              Save Current Planned Route
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
