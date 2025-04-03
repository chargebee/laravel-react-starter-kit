<?php

namespace App\Providers;

use App\Console\Commands\FetchPlans;
use Illuminate\Support\ServiceProvider;
use Chargebee\Cashier\Cashier;
use App\Models\Subscription;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->commands([
            FetchPlans::class
        ]);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Cashier::useSubscriptionModel(Subscription::class);
    }
}
