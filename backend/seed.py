from database import SessionLocal, engine, Base
from services import load_horse_into_db


# Create tables if they don't exist
Base.metadata.create_all(bind=engine)


SEED_HORSE_IDS = [
    "2009102739",  # Gold Ship
    "2002100816",  # Deep Impact
    "2008102636",  # Orfevre
    "2012102013",  # Kitasan Black
    "2009106253",  # Gentildonna
]


if __name__ == "__main__":
    db = SessionLocal()

    try:
        print("Starting seed...")

        for horse_id in SEED_HORSE_IDS:
            print(f"Loading {horse_id}")
            load_horse_into_db(db, horse_id)

        print("Seed complete.")

    except Exception as e:
        print(f"Seed failed: {e}")
        db.rollback()

    finally:
        db.close()