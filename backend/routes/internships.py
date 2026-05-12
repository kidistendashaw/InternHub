from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from backend.base import get_db
from backend.models import Internship, Company

router = APIRouter(prefix="/internships", tags=["internships"])


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class InternshipCreate(BaseModel):
    title: str
    description: str
    required_skills: List[str] = []
    min_cgpa: float = 0.0
    min_year: int = 1
    positions_available: int = 1
    domain: str
    company_id: Optional[int] = None


class InternshipUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    min_cgpa: Optional[float] = None
    min_year: Optional[int] = None
    positions_available: Optional[int] = None
    domain: Optional[str] = None
    is_active: Optional[bool] = None


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.get("/")
def list_internships(
    domain: Optional[str] = None,
    skill: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """List active internships with optional domain/skill filters."""
    query = db.query(Internship).filter(Internship.is_active == True)

    if domain:
        query = query.filter(Internship.domain.ilike(f"%{domain}%"))

    internships = query.all()

    # Apply skill filter in Python (JSON column)
    if skill:
        skill_lower = skill.lower()
        internships = [
            i for i in internships
            if any(skill_lower in s.lower() for s in (i.required_skills or []))
        ]

    return [_serialize(i) for i in internships]


@router.get("/{internship_id}")
def get_internship(internship_id: int, db: Session = Depends(get_db)):
    """Get a single internship by ID."""
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    return _serialize(internship, detailed=True)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_internship(body: InternshipCreate, db: Session = Depends(get_db)):
    """Admin creates a new internship listing."""
    # If no company_id provided, use the first company or create a placeholder
    company_id = body.company_id
    if not company_id:
        company = db.query(Company).first()
        if company:
            company_id = company.id
        else:
            # Create a default company so the FK constraint is satisfied
            default_company = Company(
                email="admin@internhub.com",
                company_name="InternHub",
                industry="Technology",
                description="Default company",
            )
            db.add(default_company)
            db.commit()
            db.refresh(default_company)
            company_id = default_company.id

    internship = Internship(
        company_id=company_id,
        title=body.title,
        description=body.description,
        required_skills=body.required_skills,
        min_cgpa=body.min_cgpa,
        min_year=body.min_year,
        positions_available=body.positions_available,
        domain=body.domain,
        is_active=True,
    )
    db.add(internship)
    db.commit()
    db.refresh(internship)
    return _serialize(internship, detailed=True)


@router.put("/{internship_id}")
def update_internship(
    internship_id: int, body: InternshipUpdate, db: Session = Depends(get_db)
):
    """Admin updates an existing internship."""
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(internship, field, value)

    db.commit()
    db.refresh(internship)
    return _serialize(internship, detailed=True)


@router.delete("/{internship_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_internship(internship_id: int, db: Session = Depends(get_db)):
    """Admin soft-deletes an internship (sets is_active=False)."""
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    internship.is_active = False
    db.commit()


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _serialize(i: Internship, detailed: bool = False) -> dict:
    base = {
        "id": i.id,
        "title": i.title,
        "company": i.company.company_name if i.company else "Unknown",
        "companyId": i.company_id,
        "domain": i.domain,
        "skills": i.required_skills or [],
        "isActive": i.is_active,
    }
    if detailed:
        base.update(
            {
                "description": i.description,
                "minCgpa": i.min_cgpa,
                "minYear": i.min_year,
                "positionsAvailable": i.positions_available,
            }
        )
    return base
