<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function cancelSubscription(Request $request)
    {
        try {
            $subscription = $request->user()?->subscription('default');

            if ($subscription && $subscription->cancelNow()) {
                return redirect('/pricing')->with('success', 'Subscription canceled successfully.');
            }

            return redirect('/something-went-wrong')->with('error', 'Something went wrong while canceling the subscription.');
        } catch (\Exception $e) {
            return redirect('/something-went-wrong')->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }

    public function downloadInvoices(Request $request, string $invoiceId)
    {
        return $request->user()?->downloadInvoice($invoiceId);
    }
}
