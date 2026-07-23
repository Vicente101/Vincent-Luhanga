<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PortfolioController;

Route::get('/', [PortfolioController::class, 'index'])->name('home');
Route::get('/work', [PortfolioController::class, 'work'])->name('work');
Route::get('/projects', [PortfolioController::class, 'projects'])->name('projects');
Route::get('/capabilities', [PortfolioController::class, 'capabilities'])->name('capabilities');
Route::get('/experience', [PortfolioController::class, 'experience'])->name('experience');
Route::get('/templates', [PortfolioController::class, 'templates'])->name('templates');
Route::get('/components', [PortfolioController::class, 'components'])->name('components');
Route::get('/contact', [PortfolioController::class, 'contactPage'])->name('contact');
Route::get('/cv', [PortfolioController::class, 'cv'])->name('cv');
Route::post('/contact', [PortfolioController::class, 'contact'])->name('contact.submit');
