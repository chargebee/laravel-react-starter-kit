<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('billing', function () {
    if (auth()->user()?->subscribed('default')) {
        return redirect()->route('subscription-settings');
    }
    return Inertia::render('pricing/billingPage');
})->name('billing');


Route::get('pricing', function () {
    return Inertia::render('pricing/pricing');
})->name('pricing');

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
        return Inertia::render('errorPage', [
            'flash' => session()->only(['error', 'success'])
        ]);
    })->name('something-went-wrong');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/checkout.php';
require __DIR__ . '/subscription.php';
require __DIR__ . '/api.php';

