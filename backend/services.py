import json
import os
import keibascraper
from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Horse, Race, RaceResult, Track


# Load English name lookup once when the module is imported
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "src", "features", "horse-viewer", "en_horse_names.json")

with open(DATA_PATH, "r") as f:
    english_names = json.load(f)


def load_horse_into_db(db: Session, horse_id: str) -> Horse:
    """
    Returns a Horse object. If the horse does not exist in the database, fetches it from KeibaScraper and caches the horse, races, and race results.
    """

    # Check whether horse already exists
    horse = db.query(Horse).filter(Horse.id == horse_id).first()

    if horse:
        return horse

    # Retrieve the horse profile and complete race history from KeibaScraper
    try:
        horse_data, history = keibascraper.load("horse", horse_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Horse not found in scraper")

    if not horse_data or not history:
        raise HTTPException(status_code=404, detail="No data returned for this horse ID")

    # The horse profile endpoint does not include some fields (horse name, gender, age, and trainer), so use the horse's most recent race result to obtain those attributes
    most_recent_history = max(history, key=lambda r: r["race_date"])

    most_recent_race_id = most_recent_history["race_id"]

    # Load the results for the horse's most recent race
    try:
        _, race_results = keibascraper.load("result", most_recent_race_id)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to load result data for horse profile")

    # Locate this horse within the race results list
    horse_result = next(
        (r for r in race_results if r["horse_id"] == horse_id), None)

    if not horse_result:
        raise HTTPException(status_code=500, detail="Could not find horse in its most recent race result")

    # Create horse
    horse = Horse(
        id=horse_data[0]["id"],
        name_english=english_names.get(horse_id),
        name_japanese=horse_result["horse_name"],
        gender=horse_result["gender"],
        age=horse_result["age"],
        trainer_name=horse_result["trainer_name"],
        father_name=horse_data[0]["father_name"],
        father_id=horse_data[0]["father_id"],
        mother_name=horse_data[0]["mother_name"],
        mother_id=horse_data[0]["mother_id"],
        f_father_id=horse_data[0]["f_father_id"],
        m_father_id=horse_data[0]["m_father_id"],
    )

    db.add(horse)

    # Create tracks, races and race results
    for r in history:

        track = db.query(Track).filter(Track.place == r['place'], Track.course == r["course"], Track.length == r["length"]).first()
        if not track:
            track = Track(
                place=r["place"],
                course=r["course"],
                length=r["length"],
            )
            db.add(track)
            db.flush()

        existing_race = (db.query(Race).filter(Race.id == r["race_id"]).first())

        if not existing_race:
            race = Race(
                id=r["race_id"],
                track_id=track.id,
                race_number=r["race_number"],
                race_name=r["race_name"],
                race_date=r["race_date"],
                race_type=r["type"],
                place=r["place"],
                length=r["length"],
                course=r["course"],
                condition=r["condition"],
                weather=r["weather"],
            )
            db.add(race)

        race_result = RaceResult(
            id=r["id"],
            race_id=r["race_id"],
            horse_id=horse_id,
            rank=r["rank"],
            jockey_name=r["jockey_name"],
            rap_time=r["rap_time"],
            weight=r["weight"],
            weight_diff=r["weight_diff"],
            prize=r["prize"],
            burden=r["burden"],
            last_3f=r["last_3f"],
            win_odds=r["win_odds"],
            bracket=r["bracket"],
        )
        db.add(race_result)

    db.commit()
    db.refresh(horse)

    return horse


def serialize_horse(horse: Horse) -> dict:
    return {
        "id": horse.id,
        "name_english": horse.name_english,
        "name_japanese": horse.name_japanese,
        "gender": horse.gender,
        "age": horse.age,
        "trainer_name": horse.trainer_name,
        "father_name": horse.father_name,
        "father_id": horse.father_id,
        "mother_name": horse.mother_name,
        "mother_id": horse.mother_id,
        "f_father_id": horse.f_father_id,
        "m_father_id": horse.m_father_id,
        "results": [
            {
                "id": result.id,
                "race_id": result.race_id,
                "horse_id": result.horse_id,
                "rank": result.rank,
                "jockey_name": result.jockey_name,
                "rap_time": result.rap_time,
                "weight": result.weight,
                "weight_diff": result.weight_diff,
                "prize": result.prize,
                "burden": result.burden,
                "last_3f": result.last_3f,
                "win_odds": result.win_odds,
                "bracket": result.bracket,
                "race": {
                    "id": result.race.id,
                    "race_name": result.race.race_name,
                    "race_date": result.race.race_date,
                    "race_type": result.race.race_type,
                    "race_number": result.race.race_number,
                    "place": result.race.place,
                    "length": result.race.length,
                    "course": result.race.course,
                    "condition": result.race.condition,
                    "weather": result.race.weather,
                },
            }
            for result in horse.results
        ],
    }