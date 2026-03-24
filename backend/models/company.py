from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from backend.base import Base

class Company(Base): 
    __tablename__ = "companies" 

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    company_name = Column(String)
    industry = Column(String)
    description = Column(String)
    is_active = Column(Boolean, default=True)

    # Relationship
    internships = relationship("Internship", back_populates="company")