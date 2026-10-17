import React from "react";
import { motion } from "framer-motion";

const TrackAnimation = ({ tracks, currentTrack }) => {
  return (
    <div className="p-4 bg-gray-900 rounded-xl mt-4">
      <h3 className="text-lg font-bold text-white mb-3">🚉 Track Allocation</h3>

      <div className="space-y-4">
        {tracks.map((track, idx) => (
          <div key={idx} className="relative h-12">
            {/* Track line */}
            <div className="absolute inset-0 bg-gray-700 rounded-lg"></div>

            {/* Track label */}
            <p className="absolute -left-20 top-1/2 -translate-y-1/2 text-white font-semibold">
              {track.name}
            </p>

            {/* Animated Train */}
            {track.name === currentTrack && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 left-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ left: "90%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              >
                🚂
              </motion.div>
            )}

            {/* Status text */}
            <p
              className={`absolute right-2 top-1/2 -translate-y-1/2 font-bold ${
                track.status.includes("❌") ? "text-red-500" : "text-green-400"
              }`}
            >
              {track.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackAnimation;
