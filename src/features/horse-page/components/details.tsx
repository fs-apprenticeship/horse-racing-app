import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HorseDetail } from "@/types";

export default function HorseDetails({ horse }: { horse: HorseDetail }) {
    const details = [
        { label: "Trainer", value: horse.trainer_name || "Unknown" },
        { label: "Gender", value: horse.gender || "Unknown" },
        { label: "Age", value: horse.age || "Unknown" },
        { label: "Sire", value: horse.father_name || "Unknown" },
        { label: "Dam", value: horse.mother_name || "Unknown" },
    ];
    return (
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
                    {details.map(({ label, value }) => (
                        <div key={label}>
                            <strong>{label}:</strong> {value}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
