export interface Horse {
    id: string;
    name_english: string;
    name_japanese: string;
    gender: string;
    age: number;
    trainer_name: string;
    father_name: string;
    father_id: string;
    mother_name: string;
    mother_id: string;
    f_father_id: string;
    f_mother_id: string;
}

export interface Race {
    id: string;
    race_name: string;
    race_date: string;
    race_type: string;
    place: string;
    length: number;
    course: string;
    condition: string;
    weather: string;
    max_prize: number;
}

export interface RaceResult {
    id: string;
    race_id: string;
    horse_id: string;
    rank: number;
    horse_name: string;
    gender: string;
    age: number;
    jockey_name: string;
    trainer_name: string;
    rap_time: number;
    weight: number;
    weight_diff: number;
    prize: number;
    burden: number;
    diff_time: number;
    last_3f: number;
    win_odds: number;
    bracket: number;
}
