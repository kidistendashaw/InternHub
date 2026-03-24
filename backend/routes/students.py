from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import shutil

from backend.base import get_db
from backend.models import Student
from backend.resume_parser import process_resume_file
from backend.matching import find_matches_for_student

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
        
        # Create or update student
        student = db.query(Student).filter(Student.email == resume_data["email"]).first()
        if not student:
            student = Student(
                email=resume_data["email"],
                full_name=resume_data["full_name"],
                year_of_study=resume_data.get("year_of_study", 1),
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
