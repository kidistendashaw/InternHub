from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from backend.base import get_db
from backend.models import Application, Student, Internship
from backend.matching import calculate_match_score

router = APIRouter(prefix="/applications", tags=["applications"])


# ---------------------------------------------------------------------------
# Schemas (local — avoids circular imports with schemas.py)
# ---------------------------------------------------------------------------

class ApplicationCreate(BaseModel):
    studentId: int
    internshipId: int


class StatusUpdate(BaseModel):
    status: str  # "pending" | "accepted" | "rejected"


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.post("/", status_code=status.HTTP_201_CREATED)
def apply_for_internship(body: ApplicationCreate, db: Session = Depends(get_db)):
    """Student applies for an internship. Calculates match score automatically."""
    student = db.query(Student).filter(Student.id == body.studentId).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    internship = db.query(Internship).filter(Internship.id == body.internshipId).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    # Prevent duplicate applications
    existing = (
        db.query(Application)
        .filter(
            Application.student_id == body.studentId,
            Application.internship_id == body.internshipId,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Already applied to this internship")

    score = calculate_match_score(student, internship)

    application = Application(
        student_id=body.studentId,
        internship_id=body.internshipId,
        match_score=round(score, 4),
        status="pending",
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    return _serialize(application)


@router.get("/student/{student_id}")
def get_student_applications(student_id: int, db: Session = Depends(get_db)):
    """Return all applications for a given student."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    apps = (
        db.query(Application)
        .filter(Application.student_id == student_id)
        .all()
    )
    return [_serialize(a) for a in apps]


@router.get("/")
def get_all_applications(db: Session = Depends(get_db)):
    """Return all applications (admin view)."""
    apps = db.query(Application).all()
    return [_serialize(a) for a in apps]


@router.get("/{application_id}")
def get_application(application_id: int, db: Session = Depends(get_db)):
    """Return a single application by ID."""
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return _serialize(app)


@router.patch("/{application_id}/status")
def update_application_status(
    application_id: int, body: StatusUpdate, db: Session = Depends(get_db)
):
    """Admin updates the status of an application (accept / reject)."""
    allowed = {"pending", "accepted", "rejected"}
    if body.status not in allowed:
        raise HTTPException(
            status_code=400, detail=f"status must be one of {allowed}"
        )

    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.status = body.status
    db.commit()
    db.refresh(app)
    return _serialize(app)


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(application_id: int, db: Session = Depends(get_db)):
    """Student withdraws an application."""
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app)
    db.commit()


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _serialize(app: Application) -> dict:
    result = {
        "id": app.id,
        "studentId": app.student_id,
        "internshipId": app.internship_id,
        "matchScore": app.match_score,
        "status": app.status,
    }
    # Include related data if loaded
    if app.student:
        result["student"] = {
            "id": app.student.id,
            "fullName": app.student.full_name,
            "email": app.student.email,
            "cgpa": app.student.cgpa,
            "skills": app.student.skills,
        }
    if app.internship:
        result["internship"] = {
            "id": app.internship.id,
            "title": app.internship.title,
            "domain": app.internship.domain,
            "company": app.internship.company.company_name if app.internship.company else "Unknown",
        }
    return result
