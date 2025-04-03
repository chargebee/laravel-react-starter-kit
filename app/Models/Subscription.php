<?php

namespace App\Models;
use Chargebee\Cashier\Subscription as CashierSubscription;

class Subscription extends CashierSubscription
{
    protected $casts = [
        'billing_cycle_anchor' => 'datetime',
    ];
}
