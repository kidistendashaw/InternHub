from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, ForeignKey
from sqlalchemy.orm import relationship
from backend.base import Base

class Internship(Base):
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))  # Changed from employer_id
    title = Column(String)
    description = Column(String)
    required_skills = Column(JSON, default=list)
    min_cgpa = Column(Float)
    min_year = Column(Integer)
    positions_available = Column(Integer)
    domain = Column(String)
    is_active = Column(Boolean, default=True)

    # Relationships
    company = relationship("Company", back_populates="internships")
    applications = relationship("Application", back_populates="internship")