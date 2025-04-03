<?php

use App\Http\Controllers\CheckoutController;
use Illuminate\Support\Facades\Route;


Route::get('/checkout/{plan?}', [CheckoutController::class, "productCheckout"])
->middleware(['auth', 'verified'])
->name('checkout');

Route::get('/update-payment-method', [CheckoutController::class, "updatePaymentMethod"])
    ->middleware(['auth', 'verified'])
    ->name('updatePaymentMethod');

require __DIR__.'/auth.php';
