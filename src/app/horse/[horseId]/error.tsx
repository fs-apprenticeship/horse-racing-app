"use client";

import { useEffect } from "react";

export default function HorseDetailError({ error, reset }: { error: Error; reset: () => void; }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1100px] flex-col items-center justify-center gap-4 px-4 py-12 sm:py-16">
            <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center shadow-sm">
                <h1 className="text-xl font-semibold text-red-800">Unable to load horse details</h1>
                <p className="mt-2 text-sm text-red-700">
                    {error.message || "There was a problem fetching the horse information."}
                </p>
                <button
                    type="button"
                    onClick={() => reset()}
                    className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        </div>
    );
}
