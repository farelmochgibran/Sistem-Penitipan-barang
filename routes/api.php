<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\PelangganController;
use App\Http\Controllers\Api\PenitipanController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/password', [AuthController::class, 'updatePassword']);

    // Dashboard statistics
    Route::get('/dashboard/statistics', [PenitipanController::class, 'statistics']);

    // Kategori routes
    Route::apiResource('kategori', KategoriController::class);

    // Pelanggan routes
    Route::get('/pelanggan/next-id', [PelangganController::class, 'getNextId']);
    Route::apiResource('pelanggan', PelangganController::class);

    // Penitipan routes
    Route::get('/penitipan/next-id', [PenitipanController::class, 'getNextId']);
    Route::post('/penitipan/{penitipan}/pickup', [PenitipanController::class, 'pickup']);
    Route::apiResource('penitipan', PenitipanController::class);
});
