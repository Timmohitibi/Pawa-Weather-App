<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class WeatherController extends Controller
{
    public function getWeather($city)
    {
        $apiKey = env('OPENWEATHER_API_KEY');

        // Cache weather data for 10 minutes
        $weatherData = Cache::remember("weather_{$city}", 600, function () use ($city, $apiKey) {
            $response = Http::get("https://api.openweathermap.org/data/2.5/weather", [
                'q' => $city,
                'appid' => $apiKey,
                'units' => 'metric'
            ]);

            // Handle failed responses or missing data
            if ($response->failed() || !$response->json('name')) {
                return null; // Return null for cache if data is invalid
            }

            return $response->json();
        });

        // Handle cases where data retrieval fails
        if (!$weatherData) {
            return response()->json(['error' => 'City not found or failed to retrieve weather data.'], 404);
        }

        return response()->json([
            'city' => $weatherData['name'],
            'temperature' => $weatherData['main']['temp'],
            'description' => $weatherData['weather'][0]['description'],
            'humidity' => $weatherData['main']['humidity'],
            'wind_speed' => $weatherData['wind']['speed'],
            'icon' => $weatherData['weather'][0]['icon'], // Ensure the icon field is included
        ]);
    }
}
