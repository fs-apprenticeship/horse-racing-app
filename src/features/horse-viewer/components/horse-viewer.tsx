"use client";

import horseNames from "../en_horse_names.json";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export default function HorseViewer() {
    const [horseInput, setHorseInput] = useState("");

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center bg-background px-4 pt-12 sm:pt-36">
            <div className="animate-in fade-in slide-in-from-bottom-3 w-full max-w-[720px] space-y-3 pb-12 duration-500 ease-out">
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-[15px] font-semibold tracking-tight text-foreground">
                            Horse Searcher
                        </CardTitle>
                        <CardDescription className="text-[13px] leading-5 text-muted-foreground">
                            Enter a horse name to view details about it.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <form className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <Input
                                    id="horse-name-input"
                                    name="horse-name-input"
                                    type="text"
                                    value={horseInput}
                                    required
                                    placeholder="Horse"
                                    className="h-8 text-[13px]"
                                    onChange={(e) =>
                                        setHorseInput(e.target.value)
                                    }
                                />
                            </div>
                            <Button
                                type="submit"
                                size="sm"
                                className="mt-1 w-full h-8 text-[13px] font-medium hover:opacity-90"
                            >
                                Search
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
