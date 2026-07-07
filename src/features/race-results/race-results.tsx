import RaceResultRow from "./race-result-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HorseRaceResult } from "@/types";

export default function RaceResults({
    results,
}: {
    results?: HorseRaceResult[];
}) {
    if (!results) return <></>;

    const rows = [
        "Date",
        "Race",
        "Track",
        "Rank",
        "Jockey",
        "Time",
        "Odds",
        "Weight",
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Race history</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto px-0 py-0">
                <table className="min-w-full border-separate border-spacing-0 text-sm">
                    <thead>
                        <tr className="bg-slate-950/5 text-left text-xs uppercase tracking-wide text-muted-foreground">
                            {rows.map((label) => (
                                <th key={label} className="px-3 py-2">
                                    {label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result) => (
                            <RaceResultRow key={result.id} result={result} />
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
