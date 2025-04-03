<?php

namespace App\Console\Commands;

use ChargeBee\ChargeBee\Models\ItemPrice;
use ChargeBee\ChargeBee\Models\Item;
use ChargeBee\ChargeBee\Environment;
use Illuminate\Console\Command;
use App\Models\Plan;

class FetchPlans extends Command
{
    protected $signature = 'chargebee:fetch-plans';
    protected $description = 'Fetch plans from ChargeBee and store them in the database';

    public function handle()
    {
        $site = env('CHARGEBEE_SITE');
        $apiKey = env('CHARGEBEE_API_KEY');

        if (!$site || !$apiKey) {
            $this->error('ChargeBee site or API key is missing in .env file');
            return;
        }

        Environment::configure($site, $apiKey);

        try {
            $items = Item::all([
                "type[is]" => "plan"
            ]);
            foreach ($items as $itemEntry) {
                $item = $itemEntry->item();
                $response = ItemPrice::all([
                    "item_type[is]" => "plan",
                    "item_id[is]" => $item->id,
                    "limit" => 30
                ]);

                foreach ($response as $entry) {
                    $itemPrice = $entry->itemPrice();
                    if (!$itemPrice?->price || $itemPrice->price === 0) {
                        continue;
                    }
                    Plan::updateOrCreate(
                        ['chargebee_id' => $itemPrice->id],
                        [
                            "display_name" => $item->externalName ?? $item->name,
                            "price" => $itemPrice->price,
                            "chargebee_product" => $itemPrice->itemId,
                            "frequency" => $itemPrice->periodUnit,
                            "currency" => $itemPrice->currencyCode,
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
