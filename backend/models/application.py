from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from backend.base import Base

class Application(Base): 
    __tablename__ = "applications"  # or "matches" if you prefer

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    internship_id = Column(Integer, ForeignKey("internships.id"))
    match_score = Column(Float)
    status = Column(String, default="pending") 

    # Relationships
    student = relationship("Student", back_populates="applications")
    internship = relationship("Internship", back_populates="applications")