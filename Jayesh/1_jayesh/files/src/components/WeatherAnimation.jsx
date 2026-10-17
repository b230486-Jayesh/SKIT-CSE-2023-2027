import React from "react";
import { motion } from "framer-motion";

const WeatherAnimation = ({ weather }) => {
  if (weather === "Rain") {
    return (
      <div className="relative h-40 w-full overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: "100%", opacity: 1 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="absolute top-0 left-0 w-1 h-6 bg-blue-400 rounded"
            style={{ left: `${i * 5}%` }}
          />
        ))}
      </div>
    );
  }

  if (weather === "Thunderstorm") {
    return (
      <motion.div
        className="h-40 flex items-center justify-center text-4xl font-bold text-yellow-400"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.3, repeat: Infinity }}
      >
        ⚡ Thunderstorm ⚡
      </motion.div>
    );
  }

  if (weather === "Snow") {
    return (
      <div className="relative h-40 w-full overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: "100%", opacity: 1 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute top-0 left-0 w-4 h-4 bg-white rounded-full"
            style={{ left: `${i * 7}%` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="h-40 flex items-center justify-center text-2xl font-semibold text-green-600">
      ☀️ Clear Skies – On Time
    </div>
  );
};

export default WeatherAnimation;
