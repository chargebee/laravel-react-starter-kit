import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorPage() {
    const { props } = usePage();
    const errorMessage = props.flash?.error || "Something went wrong. Please try again.";

    const refreshPage = () => {
        window.location.reload();
    };

    const goBack = () => {
        window.history.back();
    };

    return (
        <AppLayout>
            <Head title="Something Went Wrong" />
            <div className="flex h-full flex-1 flex-col items-center justify-center p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border max-w-md rounded-xl border bg-white p-8 text-center shadow-lg dark:bg-gray-800">
                    <div className="mb-6 flex justify-center">
                        <AlertCircle className="h-16 w-16 text-red-500" />
                    </div>

                    <h1 className="mb-2 text-2xl font-bold">Something Went Wrong</h1>

                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                        {errorMessage}
                    </p>

                    <div className="space-y-3">
                        <Button onClick={refreshPage} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh Page
                        </Button>

                        <Button onClick={goBack} variant="outline" className="w-full border-gray-300 dark:border-gray-600">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>

                        <Link href="/">
                            <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600">
                                <Home className="mr-2 h-4 w-4" />
                                Return to Home
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                        If this problem persists, please contact our support team at
                        <a href="mailto:support@example.com" className="text-blue-600 hover:underline dark:text-blue-400"> support@example.com</a>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
