<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\WeatherController;
Route::get('/', function () {
    return redirect('https://your-nextjs-app-url.com'); 
});

