<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

// Test route to verify API is working
Route::get('/test', function () {
    return response()->json(['message' => 'API is online!']);
});

// Weather endpoint (call from Next.js)
Route::get('/weather', function (Request $request) {
    $request->validate([
        'city' => 'required|string', // Validate input
    ]);

    $apiKey = env('OPENWEATHERMAP_API_KEY');
    $response = Http::get('https://api.openweathermap.org/data/2.5/weather', [
        'q' => $request->city,
        'appid' => $apiKey,
        'units' => 'metric',
    ]);

    return $response->json(); // Return raw weather data
});

