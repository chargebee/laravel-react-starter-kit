<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BillingController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('billing', [BillingController::class, "billing"])->name('billing');
Route::get('pricing', [BillingController::class, "pricing"])->name('pricing');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('failed-payment', function () {
        return Inertia::render('banners/failedPayment');
    })->name('failed-payment');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('subscription/success', function () {
        return Inertia::render('banners/successfulSubscription');
    })->name('successful-subscription');
});
Route::middleware([])->group(function () {
    Route::get('something-went-wrong', function () {
        return Inertia::render('banners/errorPage', [
            'flash' => session()->only(['error', 'success'])
        ]);
    })->name('something-went-wrong');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/checkout.php';
require __DIR__ . '/subscription.php';

