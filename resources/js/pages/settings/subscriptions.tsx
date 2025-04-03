import React, {useState} from "react";
import {BreadcrumbItem, SharedData} from "@/types";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/layouts/settings/layout";
import Pricing from "@/pages/pricing/pricing";
import AppLogoIcon from "@/components/app-logo-icon";
import ChargebeeIcon from "@/components/chargebee-icon";
import {Head, usePage} from "@inertiajs/react";
import {Loader2} from "lucide-react";
import ChargebeeBanner from "@/pages/banners/chargebeeBanner";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing Details',
        href: '/settings/subscriptions',
    }
];

const CancelSubscriptionButton = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        if (isLoading) {
            e.preventDefault(); // Prevent navigation if disabled or already loading
            return;
        }
        setIsLoading(true);
    };

    return (
        !isLoading ? <a
            href={`/subscription/cancel-subscription`}
            className={`px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 ${isLoading
                ? "bg-red-400 cursor-wait"
                : ""
            }`}
            aria-disabled={isLoading}
            onClick={handleClick}
        >
            cancel now
        </a> : <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            Processing...
        </>
    );
};

const SubscriptionSettings: React.FC = () => {
    const {auth} = usePage<SharedData>().props;
    const isSubscribed = auth.subscription && auth.subscription != null;
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});
    };

    // Format currency for display
    const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
        }).format(amount);
    };

    const handleUpdatePaymentMethod = () => {
        setIsUpdating(true);
        window.location.href = "/update-payment-method";
    };

    const handleCancelSubscription = () => {

        setCancelModalOpen(false);
        fetch("/subscription/cancel-subscription")

    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscriptions"/>
            <SettingsLayout>
                <div className="p-6">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Subscriptions</h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-300">
                            Manage your subscription and payment details
                        </p>
                    </div>

                    {!isSubscribed ? (
                        <div className="max-w-4xl mx-auto">
                            <div
                                className="bg-white dark:bg-zinc-800 shadow-lg rounded-xl border-2 border-[#012A38] border-opacity-30 dark:border-opacity-50 overflow-hidden mb-8">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-center space-x-2 mb-4">
                                        <AppLogoIcon className="w-8 h-8"/>
                                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">No Active
                                            Subscription</h2>
                                    </div>
                                    <p className="text-center text-zinc-600 dark:text-zinc-300 mb-4">
                                        You don't have an active subscription. Choose a plan below to get started.
                                    </p>
                                </div>
                            </div>

                            <Pricing/>
                            <ChargebeeBanner/>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto">
                            <div
                                className="bg-white dark:bg-zinc-800 shadow-lg rounded-xl border-2 hover:border-[#FF3300] border-[#012A38] border-opacity-30 dark:border-opacity-50 overflow-hidden"
                                onMouseEnter={() => setHoveredPlan('current')}
                                onMouseLeave={() => setHoveredPlan(null)}
                            >
                                <div
                                    className={`flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                                        hoveredPlan === 'current' ? "border-[#FF3300]" : ""
                                    }`}
                                >
                                    <div>
                                        <h2 className={`text-lg font-semibold ${
                                            hoveredPlan === 'current'
                                                ? "text-[#FF3300] dark:text-[#FF3300]"
                                                : "text-zinc-900 dark:text-zinc-50"
                                        } transition-colors duration-300`}>
                                            {auth.subscription.items[0].plan_name}
                                        </h2>
                                        <p className={`text-sm font-medium ${
                                            auth.subscription.chargebee_status?.toLowerCase() === 'in_trial'
                                                ? "text-amber-500 dark:text-amber-400"
                                                : auth.subscription.chargebee_status?.toLowerCase() === 'active'
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-red-600 dark:text-red-400"
                                        }`}>
                                            {auth.subscription.chargebee_status?.toUpperCase() || "ACTIVE"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                            Started: {formatDate(auth.subscription.created_at)}
                                        </p>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                            Renews: {formatDate(auth.subscription.next_billing_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="mb-6 grid grid-cols-3 gap-4">
                                        <div className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Card Number</p>
                                            <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
                                                {`**** **** **** ${auth?.user.pm_last_four || "****"}`}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Billing Cycle</p>
                                            <p className="text-sm text-zinc-900 dark:text-zinc-50">
                                                {auth.subscription.chargebee_price?.match(/Monthly/i) ? 'Monthly' : 'Yearly'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-lg">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Currency</p>
                                            <p className="text-sm text-zinc-900 dark:text-zinc-50">
                                                {auth.subscription.currency}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-lg mb-6">
                                        <h3 className="text-md font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                                            Subscription Items
                                        </h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                <tr className="bg-white dark:bg-zinc-800">
                                                    <th className="border border-gray-200 dark:border-gray-700 p-2 text-left text-zinc-900 dark:text-zinc-50">Product</th>
                                                    <th className="border border-gray-200 dark:border-gray-700 p-2 text-center text-zinc-900 dark:text-zinc-50">Quantity</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {auth.subscription.items?.map((item, index) => (
                                                    <tr key={index} className="border-t">
                                                        <td className="border border-gray-200 dark:border-gray-700 p-2 text-zinc-600 dark:text-zinc-300">
                                                            {item.plan_name}
                                                        </td>
                                                        <td className="border border-gray-200 dark:border-gray-700 p-2 text-center text-zinc-600 dark:text-zinc-300">
                                                            {item.quantity}
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-lg mb-6">
                                        <h3 className="text-md font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                                            Features Included
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center">
                                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none"
                                                     viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M5 13l4 4L19 7"/>
                                                </svg>
                                                <span
                                                    className="text-zinc-700 dark:text-zinc-300">Unlimited Projects</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none"
                                                     viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M5 13l4 4L19 7"/>
                                                </svg>
                                                <span
                                                    className="text-zinc-700 dark:text-zinc-300">Premium Support</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none"
                                                     viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M5 13l4 4L19 7"/>
                                                </svg>
                                                <span
                                                    className="text-zinc-700 dark:text-zinc-300">Advanced Analytics</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="h-5 w-5 text-green-500 mr-2" fill="none"
                                                     viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M5 13l4 4L19 7"/>
                                                </svg>
                                                <span
                                                    className="text-zinc-700 dark:text-zinc-300">Custom Integrations</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-zinc-50 dark:bg-zinc-900 flex flex-col md:flex-row gap-4">
                                    <button
                                        onClick={handleUpdatePaymentMethod}
                                        disabled={isUpdating}
                                        className={`flex-1 px-4 py-3 text-center font-medium rounded-lg transition-all text-white ${
                                            hoveredPlan === 'current'
                                                ? "bg-[#FF3300] hover:bg-opacity-90"
                                                : "bg-[#012A38] hover:bg-opacity-90"
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {isUpdating ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                     xmlns="http://www.w3.org/2000/svg" fill="none"
                                                     viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10"
                                                            stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor"
                                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                                                <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                                                     viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd"
                                                          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                                Update Payment Method
                                            </span>
                                        )}
                                    </button>
                                    {auth?.subscription?.chargebee_status !== 'cancelled' ? <button
                                        onClick={() => setCancelModalOpen(true)}
                                        className="flex-1 px-4 py-3 text-center font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-zinc-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all"
                                    >
                                        <span className="flex items-center justify-center">
                                            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd"
                                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                            Cancel Subscription
                                        </span>
                                    </button> : <></>}
                                </div>
                            </div>
                        </div>
                    )}

                    {cancelModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 max-w-md w-full">
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Confirm
                                    Cancellation</h3>
                                <p className="text-zinc-600 dark:text-zinc-300 mb-6">
                                    Are you sure you want to cancel your subscription? You'll lose access to premium
                                    features at the end of your current billing cycle.
                                </p>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => setCancelModalOpen(false)}
                                        className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-zinc-700 dark:text-zinc-300"
                                    >
                                        Keep Subscription
                                    </button>
                                    <CancelSubscriptionButton/>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
};

export default SubscriptionSettings;
