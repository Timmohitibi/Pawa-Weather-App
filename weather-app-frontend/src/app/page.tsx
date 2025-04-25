"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";

type WeatherData = {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  wind_speed: number;
  icon: string;
};

export default function Home() {
  const [city, setCity] = useState<string>("Nairobi"); // Default city
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/weather/${city}`
      );
      setWeather({
        city: response.data.city,
        temperature: response.data.temperature,
        description: response.data.description,
        humidity: response.data.humidity,
        wind_speed: response.data.wind_speed,
        icon: response.data.icon, // Directly use the icon code from the API response
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold text-blue-800 mb-6">
        Pawa Weather App
      </h1>

      {/* Input for City */}
      <div className="flex space-x-4 items-center mb-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
        />
        <button
          onClick={() => fetchWeather(city)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
        >
          Search
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-blue-700 text-lg">Fetching weather data...</p>
      )}

      {/* Error State */}
      {error && <p className="text-red-500 text-lg">{error}</p>}

      {/* Display Weather Data */}
      {weather && !loading && !error && (
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center max-w-sm">
          <Image
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="Weather icon"
            width={100}
            height={100}
            className="mx-auto"
            onError={({ currentTarget }) => {
              currentTarget.src =
                "https://cdn-icons-png.flaticon.com/128/1163/1163661.png";
            }}
          />
          <h2 className="text-2xl font-bold text-blue-800">{weather.city}</h2>
          <p className="text-lg text-gray-600 capitalize">
            {weather.description}
          </p>
          <p className="text-4xl font-semibold text-blue-900">
            {weather.temperature}°C
          </p>
          <p className="text-gray-500">Humidity: {weather.humidity}%</p>
          <p className="text-gray-500">Wind Speed: {weather.wind_speed} m/s</p>
        </div>
      )}
    </main>
  );
}
