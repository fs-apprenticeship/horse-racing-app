import Link from "next/link";
import { Horse } from "@/types";

export default function HorsePageHeader({ horse }: { horse: Horse }) {
    return (
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
    );
}
