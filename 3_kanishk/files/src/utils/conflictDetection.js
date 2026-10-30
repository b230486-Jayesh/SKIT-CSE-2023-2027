// --- src/utils/conflictDetection.js ---

// Helper to convert "HH:MM" to minutes
export function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function detectConflicts(trains, timeBuffer = 10) {
  const visits = [];
  const conflicts = [];

  trains.forEach((t) =>
    (t.plannedRoute || []).forEach((stop) => {
      if (stop.arrival) {
        visits.push({
          trainId: t.id || t.trainName,
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
        Math.abs(timeToMinutes(a.time) - timeToMinutes(b.time)) <= timeBuffer
      ) {
        conflicts.push({
          city: a.city,
          time: a.time,
          trains: [a.trainId, b.trainId],
        });
      }
    }
  }
  return conflicts;
}
