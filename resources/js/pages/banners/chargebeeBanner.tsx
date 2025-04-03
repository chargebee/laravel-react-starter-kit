import ChargebeeIcon from "@/components/chargebee-icon";
import React from "react";

export default function ChargebeeBanner(){
    return (
        <div
            className="flex items-center justify-center mt-6 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <p className="flex items-center text-zinc-600 dark:text-zinc-300">
                <span className="mr-1">Billing is securely managed via</span>
                <ChargebeeIcon/>
                <strong className="ml-1">Chargebee Billing Platform</strong>.
            </p>
        </div>
    )
}
