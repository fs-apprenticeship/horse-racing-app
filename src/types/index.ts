export interface Horse {
    id: string;
    name_english: string;
    name_japanese?: string;
    gender: string;
    age: number;
    trainer_name?: string;
    father_name?: string;
    father_id?: string;
    mother_name?: string;
    mother_id?: string;
    f_father_id?: string;
    f_mother_id?: string;
    m_father_id?: string;
}

export interface Race {
    id: string;
    race_name: string;
    race_date: string;
    race_type: string;
    race_number: number;
    place: string;
    length: number;
    course: string;
    condition: string;
    weather: string;
}

export interface RaceResult {
    id: string;
    race_id: string;
    horse_id: string;
    rank: number;
    jockey_name: string;
    rap_time: number;
    weight: number;
    weight_diff: number;
    prize: number;
    burden: number;
    last_3f: number;
    win_odds: number;
    bracket: number;
    race?: Race;
}

export interface HorseDetail extends Horse {
    results?: Array<RaceResult & { race: Race }>;
}
