from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from services import (
    generate_horse_race_summary,
    load_horse_into_db,
    serialize_horse,
    serialize_horse_search_result,
)
from models import Horse

# Create database tables automatically when the application starts.
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
def root():
    return {"message": "Horse racing API is running"}

@app.get("/horses")
def search_horses(q: str | None = None, db: Session = Depends(get_db)):
    if not q or not q.strip():
        return []

    query = f"%{q.strip()}%"
    horses = (
        db.query(Horse)
        .filter(
            or_(
                Horse.name_english.ilike(query),
                Horse.name_japanese.ilike(query),
            )
        )
        .limit(20)
        .all()
    )
    return [serialize_horse_search_result(horse) for horse in horses]


@app.get("/horses/{horse_id}")
def get_horse(horse_id: str, db: Session = Depends(get_db)):
    horse = load_horse_into_db(db, horse_id)
    horse_payload = serialize_horse(horse)
    horse_payload["summary"] = generate_horse_race_summary(horse)
    return horse_payload


@app.get("/horses/{horse_id}/summary")
def get_horse_summary(horse_id: str, db: Session = Depends(get_db)):
    horse = load_horse_into_db(db, horse_id)
    return generate_horse_race_summary(horse)