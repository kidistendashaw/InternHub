from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import os
import shutil

from backend.models import Student, Internship, Application, Company,Skill
from backend.base import get_db, engine, Base
from backend.matching import find_matches_for_student, save_match
from backend.resume_parser import process_resume_file

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Internship Allocation Engine", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class StudentCreate(BaseModel):
    email: str
    full_name: str
    degree: str
    year_of_study: int
    cgpa: float
    skills: List[str]
    preferences: List[str]

class InternshipCreate(BaseModel):
    employer_id: int
    title: str
    description: str
    required_skills: List[str]
    min_cgpa: float
    min_year: int
    positions_available: int
    domain: str

class EmployerCreate(BaseModel):
    email: str
    company_name: str
    industry: str
    description: str

class MatchResponse(BaseModel):
    internship_id: int
    title: str
    description: str
    required_skills: List[str]
    domain: str
    match_score: float


# Admin CRUD endpoints

@app.get("/admin/students/")
def get_students(db: Session = Depends(get_db)):
    return db.query(Student).all()

@app.get("/admin/internships/")
def get_internships(db: Session = Depends(get_db)):
    return db.query(Internship).all()

@app.get("/admin/companies/")
def get_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()

@app.get("/admin/Applications/")
def get_matches_admin(db: Session = Depends(get_db)):
    return db.query(Application).all()

@app.put("/admin/students/{student_id}")
def update_student(student_id: int, student: StudentCreate, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in student.dict().items():
        setattr(db_student, key, value)
    db.commit()
    return db_student

@app.put("/admin/internships/{internship_id}")
def update_internship(internship_id: int, internship: InternshipCreate, db: Session = Depends(get_db)):
    db_internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not db_internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    for key, value in internship.dict().items():
        setattr(db_internship, key, value)
    db.commit()
    return db_internship

@app.delete("/admin/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(db_student)
    db.commit()
    return {"message": "Student deleted"}

@app.delete("/admin/internships/{internship_id}")
def delete_internship(internship_id: int, db: Session = Depends(get_db)):
    db_internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not db_internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    db.delete(db_internship)
    db.commit()
    return {"message": "Internship deleted"}

# Company endpoints
@app.post("/companies/", response_model=EmployerCreate)
def create_company(company: EmployerCreate, db: Session = Depends(get_db)):
    db_company = Company(**company.dict())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

# Data management endpoints for settings
@app.delete("/admin/clear/{data_type}")
def clear_data(data_type: str, db: Session = Depends(get_db)):
    """Clear specific type of data or all data"""
    try:
        if data_type == "students":
            db.query(Student).delete()
        elif data_type == "internships":
            db.query(Internship).delete()
        elif data_type == "companies":
            db.query(Company).delete()
        elif data_type == "applications":
            db.query(Application).delete()
        elif data_type == "all":
            db.query(Application).delete()
            db.query(Student).delete()
            db.query(Internship).delete()
            db.query(Company).delete()
        else:
            raise HTTPException(status_code=400, detail="Invalid data type")

        db.commit()
        return {"message": f"{data_type} data cleared successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error clearing data: {str(e)}")

@app.get("/admin/stats")
def get_database_stats(db: Session = Depends(get_db)):
    """Get database statistics"""
    return {
        "companies": db.query(Company).count(),
        "students": db.query(Student).count(),
        "internships": db.query(Internship).count(),
        "applications": db.query(Application).count()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)