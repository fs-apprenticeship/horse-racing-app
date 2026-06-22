from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from services import load_horse_into_db

# Create database tables automatically when the application starts.
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
def root():
    return {"message": "Horse racing API is running"}

@app.get("/horses/{horse_id}")
def get_horse(horse_id: str, db: Session = Depends(get_db)):
    return load_horse_into_db(db, horse_id)