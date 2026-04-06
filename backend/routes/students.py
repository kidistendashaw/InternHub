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
        
        # Calculate year of study (e.g., if 2024 is the current graduation year, 
        # and current year is 2024, they are likely in year 4 or 5)
        raw_year = resume_data.get("year_of_study", "")
        safe_year = 1 # Default
        
        from datetime import datetime
        current_year = datetime.now().year
        
        if isinstance(raw_year, int):
            safe_year = raw_year
        elif raw_year:
            # Extract the last 4 digits (likely graduation year)
            year_match = re.search(r'(\d{4})', str(raw_year))
            if year_match:
                grad_year = int(year_match.group(1))
                # Simple estimate: 4-year degree (grad_year - 4 = start_year)
                # Current year - start_year = year of study
                estimated_year = 4 - (grad_year - current_year)
                safe_year = max(1, min(5, estimated_year))
                
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
            student.year_of_study = safe_year # Update year as well
        
        db.commit()
        db.refresh(student)
        
        return {
            "message": "Resume processed successfully", 
            "student_id": student.id, 
            "parsed_data": {**resume_data, "year_of_study": safe_year}
        }
    
    except Exception as e:
        # Cleanup temp file on error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Parsing error: {str(e)}")

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
