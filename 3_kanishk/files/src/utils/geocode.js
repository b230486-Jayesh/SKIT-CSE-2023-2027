// src/utils/geocode.js
export async function getLatLon(city) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      city
    )}`
  );
  const data = await res.json();
  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };
  }
  throw new Error("City not found");
}
