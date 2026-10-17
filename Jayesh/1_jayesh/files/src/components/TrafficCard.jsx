import React from "react";

const TrafficCard = ({ title, value, status }) => {
  return (
    <div className="bg-slate-500 shadow-md rounded-2xl p-6 flex flex-col">
      <h3 className="text-gray-900 text-sm">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <span className="mt-2 text-sm text-blue-900">{status}</span>
    </div>
  );
};

export default TrafficCard;
