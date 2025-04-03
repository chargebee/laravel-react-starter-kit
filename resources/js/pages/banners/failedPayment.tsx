import {Head, Link} from '@inertiajs/react';
import React, {useState} from "react";
import {Loader2} from "lucide-react";
import AppLayout from "@/layouts/app-layout";
import {BreadcrumbItem} from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payment Failed',
        href: '/failed-payment',
    },
];

export default function PaymentFailed() {
    const updatePaymentMethodButton = () => {
        const [isLoading, setIsLoading] = useState(false);

        const handleClick = (e: React.MouseEvent) => {
            if (isLoading) {
                e.preventDefault(); // Prevent navigation if disabled or already loading
                return;
            }
            setIsLoading(true);
        };

        return (
            <a
                href={`/update-payment-method`}
                className={`w-full flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:w-auto ${
                    isLoading ? "bg-red-400 cursor-wait pointer-events-none opacity-50" : ""
                }`}
                aria-disabled={isLoading}
                tabIndex={isLoading ? -1 : undefined}
                onClick={isLoading ? (e) => e.preventDefault() : handleClick}
            >
                Update Payment Method
                {isLoading && <Loader2 className="animate-spin ml-2"/>}
            </a>
        );
    };
    return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Payment Failed"/>
                <div className="flex h-full flex-1 flex-col rounded-xl p-4">
                    <div className="mx-auto max-w-2xl">
                        <div
                            className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-8 text-center">
                            <div
                                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                                <svg
                                    className="h-8 w-8 text-red-600 dark:text-red-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>

                            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Payment Failed</h1>
                            <p className="mb-6 text-gray-600 dark:text-gray-400">
                                We were unable to process your payment. This could be due to insufficient funds,
                                an expired card, or incorrect payment details.
                            </p>

                            <div
                                className="border-sidebar-border/70 dark:border-sidebar-border mb-6 rounded-lg border bg-gray-50 p-4 text-left dark:bg-gray-800/50">
                                <h3 className="mb-2 font-semibold">Common reasons for payment failure:</h3>
                                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                    <li className="flex items-start">
                                        <svg className="mr-2 h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                        <span>Insufficient funds in your account</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="mr-2 h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                        <span>Expired or invalid credit card</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="mr-2 h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                        <span>Card declined by your bank</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="mr-2 h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24"
                                             stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                        <span>Incorrect billing information</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                {updatePaymentMethodButton()}
                                <Link
                                    href="/billing"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:w-auto">
                                    Review Billing Details
                                </Link>
                            </div>

                            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                                <p>Need help? <Link href="/support"
                                                    className="text-blue-600 hover:underline dark:text-blue-400">Contact
                                    support</Link></p>
                            </div>
                        </div>

                        <div className="mt-6 text-center space-x-4">
                            <Link
                                href="/pricing"
                                className="text-blue-600 hover:underline dark:text-blue-400">
                                Return to Pricing
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-blue-600 hover:underline dark:text-blue-400">
                                Return to Dashboard
                            </Link>
                        </div>

                    </div>
                </div>
            </AppLayout>
    );
}
