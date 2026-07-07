import { HorseRaceResult } from "@/types";

export default function RaceResultRow({ result }: { result: HorseRaceResult }) {
    const baseStyle = "px-3 py-2 align-top";

    return (
        <tr
            key={result.id}
            className="border-b border-slate-950/5 even:bg-slate-950/10"
        >
            <td className={baseStyle}>{result.race?.race_date ?? "—"}</td>
            <td className={`${baseStyle} max-w-[250px]`}>
                <div className="line-clamp-2 text-sm font-medium text-foreground">
                    {result.race?.race_name ?? "Unknown race"}
                </div>
                <div className="text-xs text-muted-foreground">
                    {result.race?.race_type} · {result.race?.length}m
                </div>
            </td>
            <td className={baseStyle}>{result.race?.place ?? "—"}</td>
            <td className={baseStyle}>{result.rank}</td>
            <td className={baseStyle}>{result.jockey_name}</td>
            <td className={baseStyle}>{result.rap_time ?? "—"}</td>
            <td className={baseStyle}>{result.win_odds?.toFixed(1) ?? "—"}</td>
            <td className={baseStyle}>{result.weight ?? "—"}</td>
        </tr>
    );
}
