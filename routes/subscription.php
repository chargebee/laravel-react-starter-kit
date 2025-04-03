<?php

use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\SubscriptionController;


Route::get('/subscription/cancel-subscription', [SubscriptionController::class, "cancelSubscription"])
    ->middleware(['auth', 'verified'])
    ->name('cancel-subscription');

Route::get('/user/invoice/{invoice}', [SubscriptionController::class, "downloadInvoices"])
    ->middleware(['auth', 'verified'])
    ->name('download-invoice');

Route::get('/invoices', [SubscriptionController::class, "listInvoicesForSubscription"])
    ->middleware(['auth', 'verified'])
    ->name("list-invoices");

require __DIR__ . '/auth.php';
