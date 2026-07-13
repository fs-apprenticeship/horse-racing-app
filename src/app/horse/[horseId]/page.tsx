import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HorseDetail } from "@/types";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";

async function fetchHorse(horseId: string): Promise<HorseDetail> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
        const res = await fetch(`${API_BASE_URL}/horses/${horseId}`, {
            cache: "no-store",
            signal: controller.signal,
        });

        if (!res.ok) {
            throw new Error(
                `Failed to load horse ${horseId}: ${res.status} ${res.statusText}`,
            );
        }

        return await res.json();
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            throw new Error("Request timed out while loading horse details.");
        }

        throw new Error(
            error instanceof Error
                ? error.message
                : "Unable to fetch horse details.",
        );
    } finally {
        clearTimeout(timeout);
    }
}

export default async function HorseDetailPage({
    params,
}: {
    params: Promise<{ horseId: string }>;
}) {
    const { horseId } = await params;
    const horse = await fetchHorse(horseId);

    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1100px] flex-col gap-6 px-4 py-12 sm:py-16">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                        {horse.name_english}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {horse.name_japanese || "No Japanese name available"}
                    </p>
                </div>
                <Link
                    href="/"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
                >
                    Back to search
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Horse overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="overflow-hidden rounded-md border border-border bg-muted p-2">
                            <Image
                                src={`https://cdn.netkeiba.com/img.en/db/show_photo.html?horse_id=${horse.id}&no=spdb&tn=yes&tmp=no&default_image=horse_noimage`}
                                alt={horse.name_english}
                                width={720}
                                height={405}
                                className="h-auto w-full object-cover"
                            />
                        </div>
                        <div className="space-y-2 text-sm text-foreground/90">
                            <div>
                                <strong>Trainer:</strong> {horse.trainer_name || "Unknown"}
                            </div>
                            <div>
                                <strong>Gender:</strong> {horse.gender || "Unknown"}
                            </div>
                            <div>
                                <strong>Age:</strong> {horse.age ?? "Unknown"}
                            </div>
                            <div>
                                <strong>Sire:</strong> {horse.father_name}
                            </div>
                            <div>
                                <strong>Dam:</strong> {horse.mother_name}
                            </div>
                            <div>
                                <strong>Horse ID:</strong> {horse.id}
                            </div>
                        </div>

                        {horse.summary?.summary ? (
                            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                                    Race summary
                                </div>
                                <p className="mt-2 text-sm leading-6 text-foreground/90">
                                    {horse.summary.summary}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    <span>Starts: {horse.summary.stats.total_races}</span>
                                    <span>Wins: {horse.summary.stats.wins}</span>
                                    <span>Top-3: {horse.summary.stats.top_three}</span>
                                </div>
                            </div>
                        ) : null}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Race history</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto px-0 py-0">
                        <table className="min-w-full border-separate border-spacing-0 text-sm">
                            <thead>
                                <tr className="bg-slate-950/5 text-left text-xs uppercase tracking-wide text-muted-foreground">
                                    <th className="px-3 py-2">Date</th>
                                    <th className="px-3 py-2">Race</th>
                                    <th className="px-3 py-2">Place</th>
                                    <th className="px-3 py-2">Rank</th>
                                    <th className="px-3 py-2">Jockey</th>
                                    <th className="px-3 py-2">Time</th>
                                    <th className="px-3 py-2">Odds</th>
                                    <th className="px-3 py-2">Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {horse.results?.map((result) => (
                                    <tr
                                        key={result.id}
                                        className="border-b border-slate-950/5 even:bg-slate-950/10"
                                    >
                                        <td className="px-3 py-2 align-top">
                                            {result.race?.race_date ?? "—"}
                                        </td>
                                        <td className="px-3 py-2 align-top max-w-[250px]">
                                            <div className="line-clamp-2 text-sm font-medium text-foreground">
                                                {result.race?.race_name ?? "Unknown race"}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {result.race?.race_type} · {result.race?.length}m
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 align-top">
                                            {result.race?.place ?? "—"}
                                        </td>
                                        <td className="px-3 py-2 align-top">
                                            {result.rank}
                                        </td>
                                        <td className="px-3 py-2 align-top">
                                            {result.jockey_name}
                                        </td>
                                        <td className="px-3 py-2 align-top">
                                            {result.rap_time ?? "—"}
                                        </td>
                                        <td className="px-3 py-2 align-top">
                                            {result.win_odds?.toFixed(1) ?? "—"}
                                        </td>
                                        <td className="px-3 py-2 align-top">
                                            {result.weight ?? "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
