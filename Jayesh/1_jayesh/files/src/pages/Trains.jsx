import React, { useState } from "react";

const Trains = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState([]);

  // Dummy train data (later you can fetch from API or backend)
  const trainData = [
    { id: 1, name: "Express 101", from: "Delhi", to: "Mumbai", time: "08:00", status: "On Time" },
    { id: 2, name: "Superfast 202", from: "Delhi", to: "Jaipur", time: "10:30", status: "Delayed" },
    { id: 3, name: "Intercity 303", from: "Mumbai", to: "Pune", time: "12:00", status: "On Time" },
    { id: 4, name: "Rajdhani 404", from: "Delhi", to: "Kolkata", time: "16:00", status: "Cancelled" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    // Filter dummy data (case-insensitive)
    const filtered = trainData.filter(
      (train) =>
        train.from.toLowerCase().includes(from.toLowerCase()) &&
        train.to.toLowerCase().includes(to.toLowerCase())
    );

    setResults(filtered);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Search Trains</h1>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-4"
      >
        <input
          type="text"
          placeholder="From Station"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border rounded-xl px-4 py-2 flex-1 focus:ring focus:ring-blue-400"
          required
        />
        <input
          type="text"
          placeholder="To Station"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border rounded-xl px-4 py-2 flex-1 focus:ring focus:ring-blue-400"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-xl px-4 py-2 flex-1 focus:ring focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {results.length > 0 ? (
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-xl font-semibold mb-4">Available Trains</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Train Name</th>
                <th className="p-2 border">From</th>
                <th className="p-2 border">To</th>
                <th className="p-2 border">Departure</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((train) => (
                <tr key={train.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{train.name}</td>
                  <td className="p-2 border">{train.from}</td>
                  <td className="p-2 border">{train.to}</td>
                  <td className="p-2 border">{train.time}</td>
                  <td
                    className={`p-2 border font-semibold ${
                      train.status === "On Time"
                        ? "text-green-600"
                        : train.status === "Delayed"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {train.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No trains found. Try searching.</p>
      )}
    </div>
  );
};

export default Trains;
