const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "";


export async function fetchWeather(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("Weather fetch failed");
  return res.json();
}
