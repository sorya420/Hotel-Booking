import React, { useEffect, useState } from "react";
import axios from "axios";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=342e320bcc9d0a438de6abf9e54bb13c`,
          );

          setWeather(res.data);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      },
      () => setLoading(false),
    );
  }, []);

  if (loading) {
    return (
      <div className="max-w-[310px] mx-auto bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-center text-white">
        <div className="w-8 h-8 mx-auto border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm">Loading Weather...</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="max-w-[310px] mx-auto bg-red-500 rounded-2xl p-5 text-center text-white">
        Weather not available
      </div>
    );
  }

  const icon = weather.weather[0].icon;

  return (
    <div className="max-w-[310px] mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-600 via-sky-500 to-blue-700 shadow-2xl text-white">
      {/* Header */}

      <div className="p-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-cyan-100">📍 Current Location</p>

            <h2 className="text-xl font-bold">{weather.name}</h2>
          </div>

          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt=""
            className="w-16 h-16"
          />
        </div>

        {/* Temperature */}

        <h1 className="text-5xl font-bold mt-2">
          {Math.round(weather.main.temp)}°
        </h1>

        <p className="capitalize text-cyan-100 text-sm">
          {weather.weather[0].description}
        </p>

        {/* Details */}

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-white/20 rounded-xl p-3">
            <p className="text-xs">💧 Humidity</p>
            <h3 className="font-bold text-lg">{weather.main.humidity}%</h3>
          </div>

          <div className="bg-white/20 rounded-xl p-3">
            <p className="text-xs">💨 Wind</p>
            <h3 className="font-bold text-lg">{weather.wind.speed} m/s</h3>
          </div>

          <div className="bg-white/20 rounded-xl p-3">
            <p className="text-xs">🌡 Feels Like</p>
            <h3 className="font-bold text-lg">
              {Math.round(weather.main.feels_like)}°
            </h3>
          </div>

          <div className="bg-white/20 rounded-xl p-3">
            <p className="text-xs">☁ Condition</p>
            <h3 className="font-bold text-base">{weather.weather[0].main}</h3>
          </div>
        </div>

        {/* Footer */}

        <div className="border-t border-white/20 mt-5 pt-3 flex justify-between text-xs text-cyan-100">
          <span>🌍 Travixy</span>
          <span>Live Weather</span>
        </div>
      </div>
    </div>
  );
};

export default Weather;
