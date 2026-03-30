from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# Student Schemas
class StudentBase(BaseModel):
    email: EmailStr
    full_name: str
    year_of_study: int
    cgpa: float
    skills: List[str] = []
    preferences: List[str] = []

class StudentRead(StudentBase):
    id: int
    resume_url: Optional[str] = None
    
    class Config:
        from_attributes = True

# Company Schemas
class CompanyBase(BaseModel):
    company_name: str
    email: EmailStr
    industry: str
    description: str

class CompanyRead(CompanyBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True

# Internship Schemas
class InternshipBase(BaseModel):
    title: str
    description: str
    required_skills: List[str] = []
    min_cgpa: float
    min_year: int
    positions_available: int
    domain: str

class InternshipRead(InternshipBase):
    id: int
    company_id: int
    is_active: bool
    
    class Config:
        from_attributes = True

# Application Schemas
class ApplicationCreate(BaseModel):
    student_id: int
    internship_id: int

class ApplicationRead(BaseModel):
    id: int
    student_id: int
    internship_id: int
    match_score: float
    status: str
    applied_at: datetime
    
    # We can add extra fields if needed later via ORM relationships
    class Config:
        from_attributes = True
