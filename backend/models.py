from sqlalchemy import Column, Text, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy
from database import Base

class Horse(Base):
    __tablename__ = "horse"
    id = Column(Text, primary_key=True)
    name_english = Column(Text)
    name_japanese = Column(Text)
    gender = Column(Text)
    age = Column(Integer)
    trainer_name = Column(Text)
    father_name = Column(Text)
    father_id = Column(Text)
    mother_name = Column(Text)
    mother_id = Column(Text)
    f_father_id = Column(Text)
    m_father_id = Column(Text)

    results = relationship("RaceResult", back_populates="horse",cascade="all, delete-orphan")
    races= association_proxy('results', 'race')

class Race(Base):
    __tablename__ = "race"
    id = Column(Text, primary_key=True)
    track_id = Column(Text, ForeignKey("track.id"))
    race_number = Column(Integer)
    race_name = Column(Text)
    race_date = Column(Text)
    race_type = Column(Text)
    place = Column(Text)
    length = Column(Integer)
    course = Column(Text)
    condition = Column(Text)
    weather = Column(Text)

    track= relationship("Track", back_populates="races")
    results = relationship("RaceResult", back_populates="race", cascade="all, delete-orphan")
    horses= association_proxy('results', 'horse')
    
class RaceResult(Base):
    __tablename__ = "race_result"
    id = Column(Text, primary_key=True)
    race_id = Column(Text, ForeignKey("race.id"))  
    horse_id = Column(Text, ForeignKey("horse.id"))  
    rank = Column(Integer)
    jockey_name = Column(Text)
    rap_time = Column(Float)
    weight = Column(Integer)
    weight_diff = Column(Integer)
    prize = Column(Float)
    burden = Column(Float)
    last_3f = Column(Float)
    win_odds = Column(Float) 
    bracket = Column(Integer)

    horse = relationship("Horse", back_populates="results")
    race = relationship("Race", back_populates="results")

class Track(Base):
    __tablename__ = "track"
    id = Column(Text, primary_key=True)  # using place value as id, e.g. "中山"
    name = Column(Text) # also using place field, but named "name" instead
    surface = Column(Text) # from course field but named "surface" instead
    length = Column(Integer) 

    races = relationship("Race", back_populates="track", cascade="all, delete-orphan")