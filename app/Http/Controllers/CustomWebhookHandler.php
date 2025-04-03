<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Carbon\Carbon;
use Chargebee\Cashier\Listeners\HandleWebhookReceived;
use ChargeBee\ChargeBee\Models\ItemPrice;
use Illuminate\Support\Facades\Log;
use PHPUnit\Exception;


class CustomWebhookHandler extends HandleWebhookReceived
{
    protected function updateOrCreateSubscriptionFromPayload($user, array $data)
    {
        $firstItem = $data['subscription_items'][0];
        $isSinglePrice = count($data['subscription_items']) === 1;

        $trialEndsAt = isset($data['trial_end']) ? Carbon::createFromTimestamp($data['trial_end']) : null;
        $endsAt = isset($data['cancelled_at']) ? Carbon::createFromTimestamp($data['cancelled_at']) : null;
        $nextBillingCycle = isset($data['next_billing_at']) ? Carbon::createFromTimestamp($data['next_billing_at']) : null;

        $subscription = $user->subscriptions()->updateOrCreate(
            ['chargebee_id' => $data['id']],
            [
                'type' => $data['meta_data']['type'] ?? $data['meta_data']['name'] ?? $this->newSubscriptionType($data),
                'chargebee_status' => $data['status'],
                'chargebee_price' => $isSinglePrice ? $firstItem['item_price_id'] : null,
                'quantity' => $isSinglePrice && isset($firstItem['quantity']) ? $firstItem['quantity'] : null,
                'trial_ends_at' => $trialEndsAt,
                'ends_at' => $endsAt,
                'next_billing_at' => $nextBillingCycle
            ]
        );

        $subscriptionItemPriceIds = [];

        foreach ($data['subscription_items'] as $item) {
            $subscriptionItemPriceIds[] = $item['item_price_id'];

            $subscription->items()->updateOrCreate(
                ['chargebee_price' => $item['item_price_id']],
                [
                    'chargebee_product' => ItemPrice::retrieve($item['item_price_id'])->itemPrice()->itemId,
                    'quantity' => $item['quantity'] ?? null,
                ]
            );
        }

        $subscription->items()->whereNotIn('chargebee_price', $subscriptionItemPriceIds)->delete();

        return $subscription;
    }

    protected function updateOrCreateItemPrice(array $itemPrice): void
    {
        if (empty($itemPrice['price']) || $itemPrice['price'] === 0) {
            return;
        }
        if ($itemPrice['item_type'] !== 'plan') {
            return;
        }
        if (!in_array($itemPrice['period_unit'], ['month', 'year'], true)) {
            return;
        }

        Plan::updateOrCreate(
            ['chargebee_id' => $itemPrice['id']], // Fixed missing closing bracket
            [
                "display_name" => $itemPrice['external_name'] ?? $itemPrice['name'],
                "price" => $itemPrice['price'],
                "chargebee_product" => $itemPrice['item_id'],
                "frequency" => $itemPrice['period_unit'],
                "currency" => $itemPrice['currency_code'],
                "quantity" => 1
            ]
        );
    }

    /**
     * handles item_price_created event
     * @return void
     */
    protected function handleItemPriceCreated(array $payload): void
    {
        try {
            $itemPrice = $payload['content']['item_price'];
            $this->updateOrCreateItemPrice($itemPrice);
            Log::info('ItemPrice created successfully.', [
                'item_price_id' => $itemPrice['id'],
            ]);
        } catch (Exception $ex) {
            Log::info('Exception while handling item_price_created webhook from chargebee', [
                'message' => $ex->getMessage()
            ]);
        }
    }

    /**
     * handles item_price_updated event
     * @return void
     */
    protected function handleItemPriceUpdated(array $payload): void
    {
        try {
            $itemPrice = $payload['content']['item_price'];
            $this->updateOrCreateItemPrice($itemPrice);
            Log::info('ItemPrice updated successfully.', [
                'item_price_id' => $itemPrice->id,
            ]);
        } catch (Exception $ex) {
            Log::info('Exception while handling item_price_updated webhook from ChargeBee', [
                'message' => $ex->getMessage()
            ]);
        }
    }


}
