import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/reports";
import Trains from "./pages/Trains";
import TrainRouting from "./pages/TrainRouting";
import AI from "./components/AI";
import Root from "./pages/Root";
function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-8">Railway Traffic</h1>
        <nav className="flex flex-col gap-4">
          <Link to="/" className="px-3 py-2 rounded-lg hover:bg-gray-700 transition">
            Dashboard
          </Link>
          <Link to="/reports" className="px-3 py-2 rounded-lg hover:bg-gray-700 transition">
            Reports
          </Link>
          
          <Link to="/trainroute" className="px-3 py-2 rounded-lg hover:bg-gray-700 transition">Trainroute</Link>
          <Link to="/ai" className="px-3 py-2 rounded-lg hover:bg-gray-700 transition">Ask AI </Link>
          <Link to="/root" className="px-3 py-2 rounded-lg hover:bg-gray-700 transition">RoutePlanner </Link>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/trains" element={<Trains />} />
          <Route path="/trainroute" element={<TrainRouting/>}/>
          <Route path="/ai" element={<AI/>}/>
          <Route path="/root" element={<Root/>}/>

          

        </Routes>
      </main>
    </div>
  );
}

export default App;
