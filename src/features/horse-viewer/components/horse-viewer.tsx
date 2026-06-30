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
import { horses } from "../temp_data";
import { Horse } from "@/types";

export default function HorseViewer() {
    const [loading, startTransition] = useTransition();
    const [searchValue, setSearchValue] = useState("");
    const [results, setResults] = useState<Horse[]>([]);
    const [noResults, setNoResults] = useState(false);

    const handleInputChange = (event: React.BaseSyntheticEvent) => {
        setSearchValue(event.target.value);
    };

    // TODO: Set up API route that returns a list of all horses
    useEffect(() => {
        const res = horses.filter((horse) =>
            horse.name_english
                .toLowerCase()
                .includes(searchValue.toLowerCase()),
        );

        startTransition(() => {
            if (searchValue !== "") {
                if (res.length > 0) {
                    setResults(res);
                    setNoResults(false);
                } else {
                    setResults([]);
                    setNoResults(true);
                }
            } else {
                setResults([]);
                setNoResults(false);
            }
        });
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
