from sqlalchemy import Column, Integer, String, Float, Boolean, JSON
from sqlalchemy.orm import relationship
from backend.base import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    year_of_study = Column(Integer)
    cgpa = Column(Float)
    skills = Column(JSON)  # Can be null or empty
    preferences = Column(JSON)  # Can be null or empty
    resume_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    applications = relationship("Application", back_populates="student")