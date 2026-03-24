from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.base import get_db
from backend.models import Internship

router = APIRouter(prefix="/internships", tags=["internships"])

@router.get("/", response_model=List[dict])
def list_internships(db: Session = Depends(get_db)):
    internships = db.query(Internship).filter(Internship.is_active == True).all()
    return [
        {
            "id": i.id,
            "title": i.title,
            "company": i.company.company_name if i.company else "Unknown",
            "domain": i.domain,
            "skills": i.required_skills
        } for i in internships
    ]
