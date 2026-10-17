import React from "react";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-blue-600 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-2 border rounded-lg text-sm focus:outline-none"
        />
        <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white">
          U
        </div>
      </div>
    </header>
  );
};

export default Navbar;
