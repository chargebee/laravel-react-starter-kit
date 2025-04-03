<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Chargebee\Cashier\Billable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public  function subsriptionWithProductDetails() {
       $subscriptionDetails = $this->subscription('default');
       if(!$subscriptionDetails){
           return null;
       }
        foreach ($subscriptionDetails->items as $item) {
            $chargebeeProductId = $item->chargebee_product;
            $plan = \App\Models\Plan::where('chargebee_product', $chargebeeProductId)->first();
            $item->plan_name = $plan->display_name ?? null;
        }
       $subscriptionDetails->currency = $plan->currency ?? null;
       return $subscriptionDetails;
    }
}
