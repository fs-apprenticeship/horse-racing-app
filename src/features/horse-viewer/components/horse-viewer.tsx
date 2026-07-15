"use client";

import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import HorseResult from "./horse-result";
import { horses as fallbackHorses } from "../temp_data";
import { Horse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function HorseViewer() {
    const [loading, startTransition] = useTransition();
    const [searchValue, setSearchValue] = useState("");
    const [results, setResults] = useState<Horse[]>([]);
    const [noResults, setNoResults] = useState(false);

    const handleInputChange = (event: React.BaseSyntheticEvent) => {
        setSearchValue(event.target.value);
    };

    useEffect(() => {
        if (!searchValue.trim()) {
            setResults([]);
            setNoResults(false);
            return;
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        startTransition(() => {
            fetch(`${API_BASE_URL}/horses?q=${encodeURIComponent(searchValue)}`, {
                cache: "no-store",
                signal: controller.signal,
            })
                .then(async (res) => {
                    if (!res.ok) {
                        throw new Error("Search request failed");
                    }

                    const data = (await res.json()) as Horse[];
                    if (data.length > 0) {
                        setResults(data);
                        setNoResults(false);
                    } else {
                        const fallbackResults = fallbackHorses.filter((horse) =>
                            horse.name_english
                                .toLowerCase()
                                .includes(searchValue.toLowerCase()),
                        );

                        setResults(fallbackResults);
                        setNoResults(fallbackResults.length === 0);
                    }
                })
                .catch(() => {
                    const fallbackResults = fallbackHorses.filter((horse) =>
                        horse.name_english
                            .toLowerCase()
                            .includes(searchValue.toLowerCase()),
                    );

                    setResults(fallbackResults);
                    setNoResults(fallbackResults.length === 0);
                })
                .finally(() => {
                    clearTimeout(timeout);
                });
        });

        return () => {
            controller.abort();
            clearTimeout(timeout);
        };
    }, [searchValue]);

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center bg-background px-4 pt-12 sm:pt-36">
            <div className="w-full max-w-180 space-y-3 pb-12 duration-500 ease-out">
                <Card className="bg-indigo-950/50">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-[15px] font-semibold tracking-tight text-foreground">
                            Horse Searcher
                        </CardTitle>
                        <CardDescription className="text-[13px] leading-5 text-muted-foreground">
                            Enter a horse name to view details about it.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex flex-col gap-4">
                            <Input
                                id="horse-name-input"
                                name="horse-name-input"
                                type="text"
                                value={searchValue}
                                required
                                placeholder="Horse"
                                className="h-8 text-[13px] bg-indigo-900/50"
                                onChange={(e) => handleInputChange(e)}
                            />
                            {noResults && (
                                <div>
                                    <CardDescription className="text-[13px] leading-5 text-muted-foreground">
                                        {`No results found for "`}
                                        <b>{searchValue}</b>
                                        {`"`}
                                    </CardDescription>
                                </div>
                            )}
                            {!noResults && !loading && (
                                <div className="flex flex-col gap-2 max-h-120 overflow-y-auto scrollbar-gutter-both scrollbar-thumb-violet-400">
                                    {results.map((horse) => (
                                        <HorseResult
                                            key={horse.id}
                                            horse={horse}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
