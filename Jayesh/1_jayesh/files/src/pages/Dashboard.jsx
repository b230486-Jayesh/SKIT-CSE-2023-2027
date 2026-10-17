import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TrafficCard from "../components/TrafficCard";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

/* ---------------- Helpers for Conflict Detection ---------------- */
const timeToMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const detectConflicts = (routes, buffer = 10) => {
  const visits = [];
  const conflicts = [];
  routes.forEach((r) =>
    (r.plannedRoute || []).forEach((stop) => {
      if (stop.arrival) {
        visits.push({
          train: r.trainName,
          city: stop.city,
          time: stop.arrival,
        });
      }
    })
  );
  for (let i = 0; i < visits.length; i++) {
    for (let j = i + 1; j < visits.length; j++) {
      const a = visits[i],
        b = visits[j];
      if (
        a.city === b.city &&
        Math.abs(timeToMinutes(a.time) - timeToMinutes(b.time)) <= buffer
      ) {
        conflicts.push({
          city: a.city,
          time: a.time,
          trains: [a.train, b.train],
        });
      }
    }
  }
  return conflicts;
};

/* -------- Helpers to Adjust Time -------- */
function addMinutes(t, m) {
  const [h, min] = t.split(":").map(Number);
  const total = h * 60 + min + m;
  const nh = String(Math.floor(total / 60)).padStart(2, "0");
  const nm = String(total % 60).padStart(2, "0");
  return `${nh}:${nm}`;
}

function adjustTrainTime(trainName, city) {
  const routes = JSON.parse(localStorage.getItem("trainRoutes") || "[]");
  const updated = routes.map((r) => {
    if (r.trainName === trainName) {
      r.plannedRoute = r.plannedRoute.map((p) =>
        p.city === city ? { ...p, arrival: addMinutes(p.arrival, 15) } : p
      );
    }
    return r;
  });
  localStorage.setItem("trainRoutes", JSON.stringify(updated));
  alert(`Adjusted ${trainName} arrival at ${city} by +15 minutes.`);
  window.location.reload();
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [trainsData, setTrainsData] = useState([]);

  useEffect(() => {
    const storedTrains = JSON.parse(localStorage.getItem("trains") || "[]");
    if (storedTrains.length === 0) {
      const seed = [
        {
          id: 1,
          name: "Express 101",
          from: "Delhi",
          to: "Jaipur",
          departure: "08:00",
          arrival: "12:00",
          status: "On Time",
        },
        {
          id: 2,
          name: "Shatabdi 202",
          from: "Lucknow",
          to: "Bhopal",
          departure: "09:00",
          arrival: "15:00",
          status: "Delayed",
        },
        {
          id: 3,
          name: "Intercity 303",
          from: "Jaipur",
          to: "Indore",
          departure: "10:00",
          arrival: "18:00",
          status: "On Time",
        },
      ];
      localStorage.setItem("trains", JSON.stringify(seed));
      setTrainsData(seed);
    } else {
      setTrainsData(storedTrains);
    }

    try {
      const storedRoutes = JSON.parse(localStorage.getItem("trainRoutes") || "[]");
      setSavedRoutes(Array.isArray(storedRoutes) ? storedRoutes : []);
      setConflicts(detectConflicts(storedRoutes));
    } catch {
      setSavedRoutes([]);
      setConflicts([]);
    }
  }, []);

  /* ---------- Add New Train ---------- */
  const [newTrain, setNewTrain] = useState({
    name: "",
    from: "",
    to: "",
    departure: "",
    arrival: "",
    status: "On Time",
  });

  const handleAddTrain = () => {
    const { name, from, to, departure, arrival } = newTrain;
    if (!name || !from || !to || !departure || !arrival) {
      alert("Please fill all fields");
      return;
    }
    const updated = [...trainsData, { id: Date.now(), ...newTrain }];
    setTrainsData(updated);
    localStorage.setItem("trains", JSON.stringify(updated));
    setNewTrain({
      name: "",
      from: "",
      to: "",
      departure: "",
      arrival: "",
      status: "On Time",
    });
  };

  const delayedCount = trainsData.filter((t) => t.status === "Delayed").length;
  const onTimeCount = trainsData.length - delayedCount;

  const barData = [
    { name: "Running", value: onTimeCount },
    { name: "Delayed", value: delayedCount },
  ];

  const delayTrendData = [
    { time: "06:00", delayed: 5 },
    { time: "09:00", delayed: 8 },
    { time: "12:00", delayed: 12 },
    { time: "15:00", delayed: 10 },
    { time: "18:00", delayed: delayedCount },
  ];

  const handleViewRoute = (train) => {
    navigate("/root", { state: { train } });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <main className="p-4 sm:p-6 space-y-6">
          {/* 🚨 AI Conflict Alerts */}
          {conflicts.length > 0 && (
            <div className="bg-red-800 p-3 sm:p-4 rounded-xl shadow mb-4">
              <h2 className="text-base sm:text-lg font-semibold mb-2">
                AI Alerts: Potential Route Conflicts
              </h2>
              {conflicts.map((c, i) => (
                <div key={i} className="mb-1 text-sm sm:text-base">
                  ⚠ Conflict at <b>{c.city}</b> around {c.time}. Trains:{" "}
                  {c.trains.join(", ")}.
                  <button
                    onClick={() => adjustTrainTime(c.trains[1], c.city)}
                    className="ml-2 inline-block bg-yellow-600 px-2 py-1 rounded text-xs sm:text-sm"
                  >
                    Adjust Time
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <TrafficCard title="Active Trains" value={trainsData.length} status="On Time" />
            <TrafficCard title="Delayed Trains" value={delayedCount} status="Delayed" />
            <TrafficCard title="Available Tracks" value="56" status="Clear" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-xl shadow p-3 sm:p-4">
              <h2 className="text-lg sm:text-xl font-semibold mb-3">Train Status Overview</h2>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                    <XAxis dataKey="name" stroke="#ccc" />
                    <YAxis allowDecimals={false} stroke="#ccc" />
                    <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} labelStyle={{ color: "#fff" }} />
                    <Bar dataKey="value" fill="#4ade80" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow p-3 sm:p-4">
              <h2 className="text-lg sm:text-xl font-semibold mb-3">Delayed Trains Trend</h2>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={delayTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                    <XAxis dataKey="time" stroke="#ccc" />
                    <YAxis allowDecimals={false} stroke="#ccc" />
                    <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} labelStyle={{ color: "#fff" }} />
                    <Legend />
                    <Line type="monotone" dataKey="delayed" stroke="#f87171" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Saved Routes Map */}
          <div className="bg-gray-800 rounded-xl shadow p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-3">Saved Train Routes Map</h2>
            <div className="w-full">
              <MapContainer
                center={[25.5, 78]}
                zoom={6}
                className="w-full h-[50vh] md:h-[500px] rounded-lg"
                scrollWheelZoom={false}
              >
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {savedRoutes.map((route, rIndex) => {
                  const positions =
                    route.plannedRoute?.filter((p) => p.lat && p.lng).map((p) => [p.lat, p.lng]) || [];
                  const lineColor = route.color || `hsl(${(rIndex * 60) % 360}, 80%, 50%)`;
                  return (
                    <React.Fragment key={`${route.trainName || "route"}-${rIndex}`}>
                      {positions.length > 1 && <Polyline positions={positions} color={lineColor} weight={4} />}
                      {route.plannedRoute?.map((p, i) =>
                        p.lat && p.lng ? (
                          <Marker key={`marker-${route.trainName}-${i}`} position={[p.lat, p.lng]}>
                            <Popup>{`${route.trainName} – ${p.city}`}</Popup>
                          </Marker>
                        ) : null
                      )}
                    </React.Fragment>
                  );
                })}
              </MapContainer>
            </div>
          </div>

          {/* Train Schedule Table */}
          <div className="bg-gray-800 rounded-xl shadow p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-3">Train Schedule</h2>

            {/* Make table horizontally scrollable on small screens */}
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[720px]">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="py-2 text-sm sm:text-base">Train</th>
                    <th className="text-sm sm:text-base">From</th>
                    <th className="text-sm sm:text-base">To</th>
                    <th className="text-sm sm:text-base">Departure</th>
                    <th className="text-sm sm:text-base">Arrival</th>
                    <th className="text-sm sm:text-base">Status</th>
                    <th className="text-sm sm:text-base"></th>
                  </tr>
                </thead>
                <tbody>
                  {trainsData.map((train) => (
                    <tr key={train.id} className="border-b border-gray-700">
                      <td className="py-2 text-sm sm:text-base">{train.name}</td>
                      <td className="text-sm sm:text-base">{train.from}</td>
                      <td className="text-sm sm:text-base">{train.to}</td>
                      <td className="text-sm sm:text-base">{train.departure}</td>
                      <td className="text-sm sm:text-base">{train.arrival}</td>
                      <td className={train.status === "Delayed" ? "text-red-400 text-sm sm:text-base" : "text-sm sm:text-base"}>
                        {train.status}
                      </td>
                      <td>
                        <button
                          onClick={() => handleViewRoute(train)}
                          className="px-2 py-1 bg-blue-600 rounded text-xs sm:text-sm hover:bg-blue-700"
                        >
                          View Route
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add New Train Form */}
            <div className="bg-gray-700 p-3 sm:p-4 rounded mt-4">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Add New Train</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  className="text-black p-2 rounded"
                  placeholder="Train Name"
                  value={newTrain.name}
                  onChange={(e) => setNewTrain({ ...newTrain, name: e.target.value })}
                />
                <input
                  className="text-black p-2 rounded"
                  placeholder="From"
                  value={newTrain.from}
                  onChange={(e) => setNewTrain({ ...newTrain, from: e.target.value })}
                />
                <input
                  className="text-black p-2 rounded"
                  placeholder="To"
                  value={newTrain.to}
                  onChange={(e) => setNewTrain({ ...newTrain, to: e.target.value })}
                />
                <input
                  className="text-black p-2 rounded"
                  placeholder="Departure HH:MM"
                  value={newTrain.departure}
                  onChange={(e) => setNewTrain({ ...newTrain, departure: e.target.value })}
                />
                <input
                  className="text-black p-2 rounded"
                  placeholder="Arrival HH:MM"
                  value={newTrain.arrival}
                  onChange={(e) => setNewTrain({ ...newTrain, arrival: e.target.value })}
                />
                <select
                  className="text-black p-2 rounded"
                  value={newTrain.status}
                  onChange={(e) => setNewTrain({ ...newTrain, status: e.target.value })}
                >
                  <option>On Time</option>
                  <option>Delayed</option>
                </select>
              </div>
              <button
                onClick={handleAddTrain}
                className="mt-3 bg-green-600 px-3 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
              >
                Add Train
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
