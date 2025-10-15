<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\LocationController;


Route::get('/', function () {
    return view('app'); 
});

Route::get('api/exams', [ExamController::class, 'index']); 
Route::get('api/exams/{id}', [ExamController::class, 'show']); 
Route::get('api/candidates', [CandidateController::class, 'index']); 
Route::get('api/candidates/{id}', [CandidateController::class, 'show']); 
Route::get('api/locations', [LocationController::class, 'index']); 
Route::get('api/locations/{id}', [LocationController::class, 'show']);
Route::patch('api/exams/{id}/status', [ExamController::class, 'updateStatus']);

Route::get('/{any}', function () {
    return view('app'); // your Blade file with React root
})->where('any', '.*');


require __DIR__.'/auth.php';
