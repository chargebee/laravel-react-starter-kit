<?php

namespace App\Console\Commands;

use Chargebee\ChargebeeClient;
use Illuminate\Console\Command;
use App\Models\Plan;

class FetchPlans extends Command
{
    protected $signature = 'chargebee:fetch-plans';
    protected $description = 'Fetch plans from Chargebee and store them in the database';

    /**
     * @throws \Exception
     */
    public function handle()
    {
        $site = env('CHARGEBEE_SITE');
        $apiKey = env('CHARGEBEE_API_KEY');

        if (!$site || !$apiKey) {
            $this->error('Chargebee site or API key is missing in .env file');
            return;
        }

        $chargebee = new ChargebeeClient([
            "apiKey"=> $apiKey,
            "site" => $site
        ]);

        try {
            $items = $chargebee->item()->all([
                "type" => [
                    "is" => "plan"
                ]
            ]);
            foreach ($items->list as $itemEntry) {
                $item = $itemEntry->item;
                $response = $chargebee->itemPrice()->all([
                    "item_type" => [
                        "is" => "plan",
                    ],
                    "item_id" => [
                        "is" => $item->id
                    ],
                    "limit" => 30
                ]);

                foreach ($response->list as $entry) {
                    $itemPrice = $entry->item_price;
                    if (!$itemPrice?->price || $itemPrice->price === 0) {
                        continue;
                    }
                    Plan::updateOrCreate(
                        ['chargebee_id' => $itemPrice->id],
                        [
                            "display_name" => $item->external_name ?? $item->name,
                            "price" => $itemPrice->price,
                            "chargebee_product" => $itemPrice->item_id,
                            "frequency" => $itemPrice->period_unit,
                            "currency" => $itemPrice->currency_code,
                            "quantity" => 1
                        ]
                    );
                }

                $this->info("Plans " . $item->id . " details successfully stored in the database.");
            }

        } catch (\Exception $e) {
            $this->error("Error fetching plans: " . $e->getMessage());
        }
    }
}
