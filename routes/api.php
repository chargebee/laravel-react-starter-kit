<?php

use App\Http\Controllers\PlanController;
use Illuminate\Support\Facades\Route;


Route::get('/plans/list', [PlanController::class, 'index']);


