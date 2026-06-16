import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import enHorseNames from "../en_horse_names.json";
import { Horse } from "@/types";
import Image from "next/image";

export default function HorseResult({
    horse,
}: {
    horse: Horse | null | undefined;
}) {
    if (horse === null) return <></>;

    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="text-[15px] font-semibold tracking-tight text-foreground">
                    {horse ? horse.name_english : "Horse not found"}
                </CardTitle>
            </CardHeader>
            {horse && (
                <CardContent className="pt-0">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[13px] text-foreground/80">
                            Sire:{" "}
                            {enHorseNames[
                                horse.father_id as keyof typeof enHorseNames
                            ] || horse.father_name}
                        </span>
                        <span className="text-[13px] text-foreground/80">
                            Dam:{" "}
                            {enHorseNames[
                                horse.mother_id as keyof typeof enHorseNames
                            ] || horse.mother_name}
                        </span>
                        <div className="w-full max-w-[360px]">
                            <Image
                                src={`https://cdn.netkeiba.com/img.en/db/show_photo.html?horse_id=${horse.id}&no=spdb&tn=yes&tmp=no&default_image=horse_noimage`}
                                alt={horse.name_english}
                                width={400}
                                height={225}
                            />
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
