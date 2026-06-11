import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
import keibascraper
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import Horse, Race, RaceResult
import os

# Create database tables automatically when the application starts.
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(lifespan=lifespan)

# Load the horse ID -> English name mapping into memory at startup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "en_horse_names.json")

with open(DATA_PATH, "r") as f:
    english_names = json.load(f)

@app.get("/")
def root():
    return {"message": "Horse racing API is running"}

@app.get("/horses/{horse_id}")
def get_horse(horse_id: str, db: Session = Depends(get_db)):

    # Check whether this horse has already been cached in the database
    horse = db.query(Horse).filter(Horse.id == horse_id).first()

    # If the horse is not already stored, fetch data from scraper and create new instance
    if not horse:
        try:
            # Retrieve the horse profile and race history from KeibaScraper
            horse_data, history = keibascraper.load("horse", horse_id)
        except Exception:
            raise HTTPException(status_code=404, detail="Horse not found in scraper")

        if not horse_data or not history:
            raise HTTPException(status_code=404, detail="No data returned for this horse ID")

        # Horse profile data does not include name, gender, age, and trainer, so use the horse's most recent race result to obtain those attributes
        most_recent_history = max(history, key=lambda r: r["race_date"])
        most_recent_race_id = most_recent_history["race_id"]

        # Second scraper call to get horse_name, gender, age, and trainer
        try:
            _, race_results = keibascraper.load("result", most_recent_race_id)
        except Exception:
            raise HTTPException(status_code=500, detail="Failed to load result data for horse profile")

        # Finding this specific horse in the result list
        horse_result = next(
            (r for r in race_results if r["horse_id"] == horse_id),
            None
        )

        if not horse_result:
            raise HTTPException(status_code=500, detail="Could not find horse in its most recent race result")

        # Create and store the horse record
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

        # Add horse's race history to database. Create race records only if they don't already exist, then create the horse's result for that race
        for r in history:
            existing_race = db.query(Race).filter(Race.id == r["race_id"]).first()
            if not existing_race:
                race = Race(
                    id=r["race_id"],
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

        # Commit all inserts as a single transaction and refresh the ORM object
        db.commit()
        db.refresh(horse)

    return horse