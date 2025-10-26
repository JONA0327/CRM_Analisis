<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login');

Route::view('dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::view('profile', 'profile')
    ->middleware(['auth'])
    ->name('profile');

// Rutas para análisis de PDFs médicos
Route::middleware(['auth'])->group(function () {
    Route::post('/upload-pdf', [App\Http\Controllers\PdfAnalysisController::class, 'upload'])->name('pdf.upload');
    Route::get('/medical-reports', [App\Http\Controllers\PdfAnalysisController::class, 'index'])->name('reports.index');
    Route::get('/medical-reports/{id}', [App\Http\Controllers\PdfAnalysisController::class, 'show'])->name('reports.show');
});

require __DIR__.'/auth.php';
