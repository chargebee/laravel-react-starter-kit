import React, { useState } from "react";
import { ClipboardCopy } from "lucide-react";

const CommandWithCopyButton = ({ command, note }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="mt-4 flex flex-col items-center">
            <div className="flex items-center space-x-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 p-3 text-sm relative">
                <div className="flex items-center">
                    <span className="text-zinc-400 mr-2">$</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-mono">{command}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors relative"
                    aria-label="Copy to clipboard"
                >
                    <ClipboardCopy size={16} className="text-zinc-500 dark:text-zinc-400" />
                    <span
                        className={`absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 transition-opacity ${
                            copied ? "opacity-100" : "opacity-0"
                        }`}
                    >
            Copied!
          </span>
                </button>
            </div>
            {note && (
                <p className="mt-4 text-center text-sm text-black-500 dark:text-red-400">
                    {note}
                </p>
            )}
        </div>
    );
};

export default CommandWithCopyButton;
