<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Plan;
use Inertia\Inertia;

class BillingController extends Controller
{
    private function getAllPlans()
    {
        $plans = Plan::all()->groupBy('chargebee_product')->map(function ($group) {
            $monthly = $group->where('frequency', 'month')->first();
            $yearly = $group->where('frequency', 'year')->first();

            $monthlyPrice = $monthly ? number_format($monthly->price / 100, 2) : 0;
            $yearlyPrice = $yearly ? number_format($yearly->price / 100, 2) : 0;

            return array_filter([
                'name' => $group->first()->display_name,
                'monthly_price' => $monthlyPrice > 0 ? $monthlyPrice : null,
                'yearly_price' => $yearlyPrice > 0 ? $yearlyPrice : null,
                'monthly_chargebee_id' => $monthlyPrice > 0 ? optional($monthly)->chargebee_id : null,
                'yearly_chargebee_id' => $yearlyPrice > 0 ? optional($yearly)->chargebee_id : null,
                'features' => ["Feature A", "Feature B", "Feature C"],
                'default' => false,
                'currency' => $monthly?->currency ?? $yearly?->currency,
            ], fn($value) => !is_null($value));

        })->values();

        return $plans;
    }

    public function pricing()
    {
        return Inertia::render('pricing/pricing', [
            "plans" => $this->getAllPlans()
        ]);
    }

    public function billing(Request $request) {
        if ($request->user()?->subscribed('default')) {
            return redirect()->route('subscription-settings');
        }
        return Inertia::render('pricing/billingPage', [
            "plans" => $this->getAllPlans()
        ]);
    }

    function invoices(Request $request) {
        return Inertia::render('settings/invoices', [
            "invoices" => $request->user()->invoices()
        ]);
    }

    function subscriptions(Request $request) {
        return Inertia::render('settings/subscription', [
            "subscriptions" => $request?->user()?->subsriptionWithProductDetails() ?? null,
            "plans" => $this->getAllPlans()
        ]);
    }
}
