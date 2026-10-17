// src/components/TrainMap.jsx
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const trainIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
  iconSize: [30, 30],
});

export default function TrainMap({ stations = [], routes = [] }) {
  if (!stations.length) return <p className="text-gray-500">No stations to display.</p>;

  const center = stations[0].coords; // center map on first station

  return (
    <MapContainer center={center} zoom={7} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* Draw dynamic train routes */}
      {routes.map((route, idx) => (
       <Polyline
  key={idx}
  positions={route.path}
  color={route.color}
  dashArray={route.status === "alternate" ? "8,6" : null}
  weight={5}
/>

        
      ))}

      {/* Station markers */}
      {stations.map((station, idx) => (
        <Marker key={idx} position={station.coords}>
          <Popup>
            <b>{station.name}</b>
          </Popup>
        </Marker>
      ))}

      {/* Train markers */}
      {routes.map((route, idx) => (
        <Marker
          key={`train-${idx}`}
          position={route.path[Math.floor(route.path.length / 2)]}
          icon={trainIcon}
        >
          <Popup>
            <b>{route.name}</b> <br />
            {route.status === "allocated" ? "✅ Track Allocated" : "❌ Track Rejected"}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
