from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from backend.base import Base

class Company(Base):  # Keep as Company, not Employer
    __tablename__ = "companies"  # Changed from "employers" to match class

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    company_name = Column(String)
    industry = Column(String)
    description = Column(String)
    is_active = Column(Boolean, default=True)

    # Relationship
    internships = relationship("Internship", back_populates="company")