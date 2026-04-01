from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import shutil
import re

from backend.base import get_db
from backend.models import Student
from backend.resume_parser import process_resume_file
from backend.matching import find_matches_for_student
from backend.schemas import StudentUpdate

router = APIRouter(prefix="/students", tags=["students"])

@router.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Save the file temporarily
    temp_dir = "temp_resumes"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Parse resume
        resume_data = process_resume_file(file_path)
        
        # Try to parse year safely to int 
        raw_year = resume_data.get("year_of_study", "")
        safe_year = 1
        if isinstance(raw_year, int):
            safe_year = raw_year
        elif raw_year:
            # If it's a string like "2019-2023", maybe take the last 4 digits
            year_match = re.search(r'(\d{4})$', str(raw_year))
            if year_match:
                # Estimate year of study based on current year vs grad year or just default 
                pass 
                
        # Create or update student
        student = db.query(Student).filter(Student.email == resume_data["email"]).first()
        if not student:
            student = Student(
                email=resume_data["email"],
                full_name=resume_data["full_name"],
                year_of_study=safe_year,
                cgpa=resume_data.get("cgpa", 0.0),
                skills=resume_data["skills"],
                preferences=resume_data["preferences"],
                resume_url=file_path
            )
            db.add(student)
        else:
            student.full_name = resume_data["full_name"]
            student.skills = resume_data["skills"]
            student.preferences = resume_data["preferences"]
        
        db.commit()
        db.refresh(student)
        
        return {"message": "Resume processed successfully", "student_id": student.id, "parsed_data": resume_data}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{student_id}/matches/")
def get_matches(student_id: int, threshold: float = 0.5):
    matches = find_matches_for_student(student_id, threshold)
    return {"student_id": student_id, "matches": matches}

@router.get("/{student_id}")
def get_student_profile(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    return {
        "userId": str(student.id),
        "resumeUrl": student.resume_url,
        "skills": student.skills or [],
        "education": student.education or "",
        "experience": student.experience or "",
        "gpa": student.cgpa
    }

@router.put("/{student_id}")
def update_student_profile(student_id: int, profile_update: StudentUpdate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    if profile_update.education is not None:
        student.education = profile_update.education
    if profile_update.experience is not None:
        student.experience = profile_update.experience
    if profile_update.skills is not None:
        student.skills = profile_update.skills
    if profile_update.gpa is not None:
        student.cgpa = profile_update.gpa
        
    db.commit()
    db.refresh(student)
    return {"message": "Profile updated successfully"}

@router.post("/{student_id}/resume")
async def upload_student_resume(student_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    temp_dir = "temp_resumes"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    student.resume_url = file_path
    
    try:
        resume_data = process_resume_file(file_path)
        if resume_data.get("skills") and not student.skills:
           student.skills = resume_data["skills"]
    except Exception as e:
        pass 
        
    db.commit()
    return {"message": "Resume uploaded successfully", "resume_url": file_path}
