import HorsePageHeader from "@/features/horse-page/components/header";
import HorseDetails from "@/features/horse-page/components/details";
import RaceResults from "@/features/race-results/race-results";
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
            <HorsePageHeader horse={horse} />
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                <HorseDetails horse={horse} />
                <RaceResults results={horse.results} />
            </div>
        </div>
    );
}
