import React, {useEffect, useState} from "react";
import {BreadcrumbItem} from "@/types";
import AppLayout from "@/layouts/app-layout";
import {Head} from "@inertiajs/react";
import SettingsLayout from "@/layouts/settings/layout";

interface LineItem {
    id: string;
    description: string;
    quantity: number;
    unit_amount: number;
    amount: number;
}

interface Invoice {
    id: string;
    customer_id: string;
    status: string;
    total: number;
    amount_paid: number;
    amount_due: number;
    currency_code: string;
    date: number;
    due_date: number;
    line_items: LineItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoices',
        href: '/settings/invoices',
    }
];

const Invoices: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);
    const [hoveredInvoiceId, setHoveredInvoiceId] = useState<string | null>(null);

    useEffect(() => {
        // Fetch invoices with loading state
        const fetchInvoices = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("/invoices");
                const data = await response.json();
                setInvoices(data);
            } catch (error) {
                console.error("Error fetching invoices:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
        }).format(amount / 100);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    const handleDownloadInvoice = async (invoiceId: string) => {
        setDownloadingInvoiceId(invoiceId);
        try {
            const response = await fetch(`/user/invoice/${invoiceId}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `invoice-${invoiceId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading invoice:", error);
        } finally {
            setDownloadingInvoiceId(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoices"/>
            <SettingsLayout>
                <div className="p-6">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Invoices</h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-300">
                            View and download your billing history
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3300]"></div>
                        </div>
                    ) : invoices.length === 0 ? (
                        <div className="text-center py-10 bg-white dark:bg-zinc-800 rounded-xl shadow-md">
                            <p className="text-zinc-600 dark:text-zinc-300">No invoices found.</p>
                        </div>
                    ) : (
                        <div className="mx-33 flex-1">
                            {invoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="flex-1 min-w-[300px] max-w-[700px] px-3 mb-6 transition-all duration-300 ease-in-out"
                                    onMouseEnter={() => setHoveredInvoiceId(invoice.id)}
                                    onMouseLeave={() => setHoveredInvoiceId(null)}
                                >
                                    <div
                                        className={`bg-white dark:bg-zinc-800 shadow-lg rounded-xl border-2 overflow-hidden flex flex-col h-full transition-all duration-300 ${
                                            hoveredInvoiceId === invoice.id
                                                ? "border-[#FF3300]"
                                                : "border-[#012A38] border-opacity-30 dark:border-opacity-50"
                                        }`}
                                    >
                                        <div
                                            className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                                            <div>
                                                <h2 className={`text-lg font-semibold ${
                                                    hoveredInvoiceId === invoice.id
                                                        ? "text-[#FF3300] dark:text-[#FF3300]"
                                                        : "text-zinc-900 dark:text-zinc-50"
                                                } transition-colors duration-300`}>
                                                    Invoice #{invoice.id}
                                                </h2>
                                                <p className={`text-sm font-medium ${
                                                    invoice.status === "paid"
                                                        ? "text-green-600 dark:text-green-400"
                                                        : "text-red-600 dark:text-red-400"
                                                }`}>
                                                    {invoice.status.toUpperCase()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-zinc-600 dark:text-zinc-300">Date: {formatDate(invoice.date)}</p>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-300">Due: {formatDate(invoice.due_date)}</p>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="mb-6 grid grid-cols-3 gap-4">
                                                <div className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-lg">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                                                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                                        {formatCurrency(invoice.total, invoice.currency_code)}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-lg">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount
                                                        Paid</p>
                                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                        {formatCurrency(invoice.amount_paid, invoice.currency_code)}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-lg">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount
                                                        Due</p>
                                                    <p className={`text-lg font-bold ${
                                                        invoice.amount_due > 0
                                                            ? "text-red-600 dark:text-red-400"
                                                            : "text-zinc-900 dark:text-zinc-50"
                                                    }`}>
                                                        {formatCurrency(invoice.amount_due, invoice.currency_code)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="overflow-x-auto">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                    <tr className="bg-gray-50 dark:bg-zinc-700">
                                                        <th className="border border-gray-200 dark:border-gray-700 p-2 text-left text-zinc-900 dark:text-zinc-50">Item</th>
                                                        <th className="border border-gray-200 dark:border-gray-700 p-2 text-center text-zinc-900 dark:text-zinc-50">Quantity</th>
                                                        <th className="border border-gray-200 dark:border-gray-700 p-2 text-right text-zinc-900 dark:text-zinc-50">Unit
                                                            Price
                                                        </th>
                                                        <th className="border border-gray-200 dark:border-gray-700 p-2 text-right text-zinc-900 dark:text-zinc-50">Total</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {invoice.line_items.map((item) => (
                                                        <tr key={item.id} className="border-t">
                                                            <td className="border border-gray-200 dark:border-gray-700 p-2 text-zinc-600 dark:text-zinc-300">{item.description}</td>
                                                            <td className="border border-gray-200 dark:border-gray-700 p-2 text-center text-zinc-600 dark:text-zinc-300">{item.quantity}</td>
                                                            <td className="border border-gray-200 dark:border-gray-700 p-2 text-right text-zinc-600 dark:text-zinc-300">{formatCurrency(item.unit_amount, invoice.currency_code)}</td>
                                                            <td className="border border-gray-200 dark:border-gray-700 p-2 text-right text-zinc-600 dark:text-zinc-300">{formatCurrency(item.amount, invoice.currency_code)}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="p-6 mt-auto bg-zinc-50 dark:bg-zinc-900">
                                            <button
                                                onClick={() => handleDownloadInvoice(invoice.id)}
                                                disabled={downloadingInvoiceId === invoice.id}
                                                className={`w-full px-4 py-3 text-center font-medium rounded-lg transition-all text-white ${
                                                    hoveredInvoiceId === invoice.id
                                                        ? "bg-[#FF3300] hover:bg-opacity-90"
                                                        : "bg-[#012A38] hover:bg-opacity-90"
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {downloadingInvoiceId === invoice.id ? (
                                                    <span className="flex items-center justify-center">
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                             xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10"
                                                                    stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor"
                                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Downloading...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center justify-center">
                                                        <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                                                             viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd"
                                                                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                        Download Invoice
                                                    </span>
                                                )}
                                            </button>
                                        </div>

                                        {hoveredInvoiceId === invoice.id && (
                                            <div className="absolute top-0 right-0 w-full bg-[#FF3300]"></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
};

export default Invoices;
