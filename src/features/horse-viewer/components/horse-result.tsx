import { Card, CardContent } from "@/components/ui/card";
import enHorseNames from "../en_horse_names.json";
import { Horse } from "@/types";
import Image from "next/image";

export default function HorseResult({ horse }: { horse?: Horse }) {
    if (!horse) return <></>;

    return (
        <div>
            <Card className="bg-indigo-950/50 hover:bg-indigo-900/50 hover:cursor-pointer">
                <CardContent className="pt-0">
                    <div className="flex gap-4">
                        <div className="w-32">
                            <Image
                                src={`https://cdn.netkeiba.com/img.en/db/show_photo.html?horse_id=${horse.id}&no=spdb&tn=yes&tmp=no&default_image=horse_noimage`}
                                alt={horse.name_english}
                                width={400}
                                height={225}
                                className="rounded-md"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="text-[15px] font-semibold tracking-tight text-foreground">
                                {horse.name_english}
                            </span>
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
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
